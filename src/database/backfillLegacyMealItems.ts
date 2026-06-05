import type { SQLiteDatabase } from 'expo-sqlite';

import { globalUnitRepository } from '@/repositories/globalUnit.repository';
import { productRepository } from '@/repositories/product.repository';
import { computeMealItemCarbs, resolveUnitEquivalent } from '@/utils/carbs';

type LegacyMealItemRow = {
  id: string;
  product_id: string;
  quantity: number;
  unit_type: string;
  unit_id: string | null;
  carbs: number | null;
};

export const backfillLegacyMealItems = async (db: SQLiteDatabase): Promise<void> => {
  const rows = await db.getAllAsync<LegacyMealItemRow>(
    'SELECT id, product_id, quantity, unit_type, unit_id, carbs FROM meal_items WHERE carbs IS NULL',
  );

  if (rows.length === 0) return;

  const globalUnits = await globalUnitRepository.getAll();

  for (const row of rows) {
    const product = await productRepository.getById(row.product_id);
    if (!product) continue;

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
