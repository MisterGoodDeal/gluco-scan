import { getDatabase } from '@/database/client';
import { cookingConversionRepository } from '@/repositories/cookingConversion.repository';
import { globalUnitRepository } from '@/repositories/globalUnit.repository';
import { productRepository } from '@/repositories/product.repository';
import type { Meal } from '@/types/meal';
import type { MealItem, MealItemQuantityType } from '@/types/mealItem';
import type { MealType } from '@/types/mealType';
import {
  computeMealItemCarbsWithCooking,
  sumCarbs,
} from '@/utils/carbs';
import { generateId } from '@/utils/id';
import { scheduleWidgetSync } from '@/features/widgets/services/widgetSync.service';

type MealRow = {
  id: string;
  type: string;
  date: string;
  created_at: string;
  total_carbs: number;
};

type MealItemRow = {
  id: string;
  meal_id: string;
  product_id: string;
  quantity: number;
  unit_type: string;
  unit_id: string | null;
  quantity_type: string;
  raw_equivalent_quantity: number | null;
  carbs: number | null;
};

const mapMealItemRow = async (
  row: MealItemRow,
  globalUnits: Awaited<ReturnType<typeof globalUnitRepository.getAll>>,
  userConversions: Awaited<ReturnType<typeof cookingConversionRepository.getAll>>,
): Promise<MealItem> => {
  const product = await productRepository.getById(row.product_id);
  const unitType = row.unit_type as MealItem['unitType'];
  const quantityType = row.quantity_type as MealItemQuantityType;
  let unitLabel = 'g';
  if (unitType === 'custom' && row.unit_id && product) {
    const pu = product.customUnits.find((u) => u.id === row.unit_id);
    const gu = globalUnits.find((u) => u.id === row.unit_id);
    unitLabel = pu?.abbreviation ?? gu?.abbreviation ?? '';
  }

  let carbs = row.carbs ?? undefined;
  let rawEquivalentQuantity = row.raw_equivalent_quantity ?? undefined;

  if (carbs == null && product != null) {
    const computed = computeMealItemCarbsWithCooking(
      {
        quantity: row.quantity,
        unitType,
        unitId: row.unit_id ?? undefined,
        quantityType,
      },
      product,
      globalUnits,
      userConversions,
    );
    carbs = computed.carbs;
    rawEquivalentQuantity = computed.rawEquivalentQuantity;
  }

  return {
    id: row.id,
    productId: row.product_id,
    quantity: row.quantity,
    unitType,
    unitId: row.unit_id ?? undefined,
    quantityType,
    rawEquivalentQuantity,
    productName: product?.name,
    imageUrl: product?.imageUrl ?? null,
    carbs: carbs ?? 0,
    unitLabel,
  };
};

const loadMealWithItems = async (row: MealRow): Promise<Meal> => {
  const db = getDatabase();
  const [globalUnits, userConversions] = await Promise.all([
    globalUnitRepository.getAll(),
    cookingConversionRepository.getAll(),
  ]);
  const itemRows = await db.getAllAsync<MealItemRow>(
    'SELECT * FROM meal_items WHERE meal_id = ?',
    row.id,
  );
  const items: MealItem[] = [];
  for (const itemRow of itemRows) {
    items.push(await mapMealItemRow(itemRow, globalUnits, userConversions));
  }
  return {
    id: row.id,
    type: row.type as MealType,
    date: row.date,
    createdAt: row.created_at,
    items,
    totalCarbs: row.total_carbs,
  };
};

export type CreateMealInput = {
  type: MealType;
  date: string;
  createdAt: string;
  items: Omit<MealItem, 'id'>[];
};

export const mealRepository = {
  async getByDate(date: string): Promise<Meal[]> {
    const db = getDatabase();
    const rows = await db.getAllAsync<MealRow>(
      'SELECT * FROM meals WHERE date = ? ORDER BY created_at',
      date,
    );
    const meals: Meal[] = [];
    for (const row of rows) {
      meals.push(await loadMealWithItems(row));
    }
    return meals;
  },

  async getById(id: string): Promise<Meal | null> {
    const db = getDatabase();
    const row = await db.getFirstAsync<MealRow>('SELECT * FROM meals WHERE id = ?', id);
    if (!row) return null;
    return loadMealWithItems(row);
  },

  async getDayTotalCarbs(date: string): Promise<number> {
    const db = getDatabase();
    const row = await db.getFirstAsync<{ total: number }>(
      'SELECT COALESCE(SUM(total_carbs), 0) as total FROM meals WHERE date = ?',
      date,
    );
    return row?.total ?? 0;
  },

  async getDayTotalsBetween(startDate: string, endDate: string): Promise<Record<string, number>> {
    const db = getDatabase();
    const rows = await db.getAllAsync<{ date: string; total: number }>(
      `SELECT date, COALESCE(SUM(total_carbs), 0) AS total
       FROM meals
       WHERE date >= ? AND date <= ?
       GROUP BY date`,
      startDate,
      endDate,
    );
    const totals: Record<string, number> = {};
    for (const row of rows) {
      totals[row.date] = row.total;
    }
    return totals;
  },

  async createWithItems(input: CreateMealInput): Promise<Meal> {
    const db = getDatabase();
    const [globalUnits, userConversions] = await Promise.all([
      globalUnitRepository.getAll(),
      cookingConversionRepository.getAll(),
    ]);
    const mealId = generateId();

    const computedItems: Array<{
      item: Omit<MealItem, 'id'>;
      carbs: number;
      rawEquivalentQuantity: number;
      quantityType: MealItemQuantityType;
    }> = [];

    for (const item of input.items) {
      const product = await productRepository.getById(item.productId);
      if (!product) continue;

      const result =
        item.carbs != null && item.rawEquivalentQuantity != null
          ? {
              carbs: item.carbs,
              rawEquivalentQuantity: item.rawEquivalentQuantity,
              quantityType: item.quantityType ?? 'raw',
            }
          : computeMealItemCarbsWithCooking(item, product, globalUnits, userConversions);

      computedItems.push({
        item,
        ...result,
      });
    }

    const totalCarbs = sumCarbs(computedItems.map((entry) => entry.carbs));

    await db.withTransactionAsync(async () => {
      await db.runAsync(
        `INSERT INTO meals (id, type, date, created_at, total_carbs)
         VALUES (?, ?, ?, ?, ?)`,
        mealId,
        input.type,
        input.date,
        input.createdAt,
        totalCarbs,
      );

      for (const { item, carbs, rawEquivalentQuantity, quantityType } of computedItems) {
        await db.runAsync(
          `INSERT INTO meal_items (id, meal_id, product_id, quantity, unit_type, unit_id, quantity_type, raw_equivalent_quantity, carbs)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          generateId(),
          mealId,
          item.productId,
          item.quantity,
          item.unitType,
          item.unitId ?? null,
          quantityType,
          rawEquivalentQuantity,
          carbs,
        );
      }
    });

    const meal = await this.getById(mealId);
    if (!meal) throw new Error('Failed to create meal');
    scheduleWidgetSync();
    return meal;
  },

  async updateWithItems(mealId: string, input: CreateMealInput): Promise<Meal> {
    const db = getDatabase();
    const [globalUnits, userConversions] = await Promise.all([
      globalUnitRepository.getAll(),
      cookingConversionRepository.getAll(),
    ]);

    const computedItems: Array<{
      item: Omit<MealItem, 'id'>;
      carbs: number;
      rawEquivalentQuantity: number;
      quantityType: MealItemQuantityType;
    }> = [];

    for (const item of input.items) {
      const product = await productRepository.getById(item.productId);
      if (!product) continue;

      const result =
        item.carbs != null && item.rawEquivalentQuantity != null
          ? {
              carbs: item.carbs,
              rawEquivalentQuantity: item.rawEquivalentQuantity,
              quantityType: item.quantityType ?? 'raw',
            }
          : computeMealItemCarbsWithCooking(item, product, globalUnits, userConversions);

      computedItems.push({
        item,
        ...result,
      });
    }

    const totalCarbs = sumCarbs(computedItems.map((entry) => entry.carbs));

    await db.withTransactionAsync(async () => {
      await db.runAsync(
        `UPDATE meals SET type = ?, date = ?, created_at = ?, total_carbs = ? WHERE id = ?`,
        input.type,
        input.date,
        input.createdAt,
        totalCarbs,
        mealId,
      );
      await db.runAsync('DELETE FROM meal_items WHERE meal_id = ?', mealId);

      for (const { item, carbs, rawEquivalentQuantity, quantityType } of computedItems) {
        await db.runAsync(
          `INSERT INTO meal_items (id, meal_id, product_id, quantity, unit_type, unit_id, quantity_type, raw_equivalent_quantity, carbs)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          generateId(),
          mealId,
          item.productId,
          item.quantity,
          item.unitType,
          item.unitId ?? null,
          quantityType,
          rawEquivalentQuantity,
          carbs,
        );
      }
    });

    const meal = await this.getById(mealId);
    if (!meal) throw new Error('Failed to update meal');
    scheduleWidgetSync();
    return meal;
  },

  async delete(id: string): Promise<void> {
    const db = getDatabase();
    await db.runAsync('DELETE FROM meals WHERE id = ?', id);
    scheduleWidgetSync();
  },

  async getAllForExport(): Promise<Meal[]> {
    const db = getDatabase();
    const rows = await db.getAllAsync<MealRow>('SELECT * FROM meals ORDER BY date, created_at');
    const meals: Meal[] = [];
    for (const row of rows) {
      meals.push(await loadMealWithItems(row));
    }
    return meals;
  },
};
