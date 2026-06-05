import type { SQLiteDatabase } from 'expo-sqlite';

import { computeMealItemCarbs, resolveUnitEquivalent } from '@/utils/carbs';
import type { GlobalUnit } from '@/types/globalUnit';
import type { Product } from '@/types/product';
import type { ProductUnit } from '@/types/productUnit';

type GlobalUnitRow = {
  id: string;
  abbreviation: string;
  name: string;
  equivalent_in_grams: number;
};

type LegacyMealItemRow = {
  id: string;
  product_id: string;
  quantity: number;
  unit_type: string;
  unit_id: string | null;
  carbs: number | null;
};

type ProductRow = {
  id: string;
  name: string;
  carbs_per_100g: number;
  image_url: string | null;
  tags: string | null;
  custom_cooking_factor: number | null;
};

type ProductUnitRow = {
  id: string;
  product_id: string;
  abbreviation: string;
  name: string;
  equivalent_in_grams: number;
};

const mapProduct = (row: ProductRow, units: ProductUnit[]): Product => ({
  id: row.id,
  name: row.name,
  carbsPer100g: row.carbs_per_100g,
  imageUrl: row.image_url,
  eans: [],
  tags: row.tags ? (JSON.parse(row.tags) as Product['tags']) : [],
  customCookingFactor: row.custom_cooking_factor,
  customUnits: units,
});

export const backfillLegacyMealItems = async (db: SQLiteDatabase): Promise<void> => {
  const rows = await db.getAllAsync<LegacyMealItemRow>(
    'SELECT id, product_id, quantity, unit_type, unit_id, carbs FROM meal_items WHERE carbs IS NULL',
  );

  if (rows.length === 0) return;

  const globalUnitRows = await db.getAllAsync<GlobalUnitRow>(
    'SELECT id, name, abbreviation, equivalent_in_grams FROM global_units ORDER BY name',
  );
  const globalUnits: GlobalUnit[] = globalUnitRows.map((row) => ({
    id: row.id,
    abbreviation: row.abbreviation,
    name: row.name,
    equivalentInGrams: row.equivalent_in_grams,
  }));

  for (const row of rows) {
    const productRow = await db.getFirstAsync<ProductRow>(
      'SELECT id, name, carbs_per_100g, image_url, tags, custom_cooking_factor FROM products WHERE id = ?',
      row.product_id,
    );
    if (!productRow) continue;

    const unitRows = await db.getAllAsync<ProductUnitRow>(
      'SELECT id, product_id, abbreviation, name, equivalent_in_grams FROM product_units WHERE product_id = ?',
      row.product_id,
    );
    const product = mapProduct(
      productRow,
      unitRows.map((unit) => ({
        id: unit.id,
        abbreviation: unit.abbreviation,
        name: unit.name,
        equivalentInGrams: unit.equivalent_in_grams,
      })),
    );

    const unitType = row.unit_type as 'grams' | 'custom';
    const equivalent = resolveUnitEquivalent(
      unitType,
      row.unit_id ?? undefined,
      product.customUnits,
      globalUnits,
    );
    const grams = unitType === 'grams' ? row.quantity : row.quantity * equivalent;
    const carbs = computeMealItemCarbs(
      {
        quantity: row.quantity,
        unitType,
        unitId: row.unit_id ?? undefined,
      },
      product,
      globalUnits,
    );

    await db.runAsync(
      `UPDATE meal_items
       SET quantity_type = 'raw', raw_equivalent_quantity = ?, carbs = ?
       WHERE id = ?`,
      grams,
      carbs,
      row.id,
    );
  }
};
