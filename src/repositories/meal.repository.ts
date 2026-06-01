import { getDatabase } from '@/database/client';
import { globalUnitRepository } from '@/repositories/globalUnit.repository';
import { productRepository } from '@/repositories/product.repository';
import type { Meal } from '@/types/meal';
import type { MealItem } from '@/types/mealItem';
import type { MealType } from '@/types/mealType';
import { computeMealItemCarbs, sumCarbs } from '@/utils/carbs';
import { generateId } from '@/utils/id';

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
};

const mapMealItemRow = async (
  row: MealItemRow,
  globalUnits: Awaited<ReturnType<typeof globalUnitRepository.getAll>>,
): Promise<MealItem> => {
  const product = await productRepository.getById(row.product_id);
  const unitType = row.unit_type as MealItem['unitType'];
  let unitLabel = 'g';
  if (unitType === 'custom' && row.unit_id && product) {
    const pu = product.customUnits.find((u) => u.id === row.unit_id);
    const gu = globalUnits.find((u) => u.id === row.unit_id);
    unitLabel = pu?.abbreviation ?? gu?.abbreviation ?? '';
  }
  const carbs =
    product != null
      ? computeMealItemCarbs(
          {
            quantity: row.quantity,
            unitType,
            unitId: row.unit_id ?? undefined,
          },
          product,
          globalUnits,
        )
      : 0;

  return {
    id: row.id,
    productId: row.product_id,
    quantity: row.quantity,
    unitType,
    unitId: row.unit_id ?? undefined,
    productName: product?.name,
    imageUrl: product?.imageUrl ?? null,
    carbs,
    unitLabel,
  };
};

const loadMealWithItems = async (row: MealRow): Promise<Meal> => {
  const db = getDatabase();
  const globalUnits = await globalUnitRepository.getAll();
  const itemRows = await db.getAllAsync<MealItemRow>(
    'SELECT * FROM meal_items WHERE meal_id = ?',
    row.id,
  );
  const items: MealItem[] = [];
  for (const itemRow of itemRows) {
    items.push(await mapMealItemRow(itemRow, globalUnits));
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

  async createWithItems(input: CreateMealInput): Promise<Meal> {
    const db = getDatabase();
    const globalUnits = await globalUnitRepository.getAll();
    const mealId = generateId();

    const itemCarbs: number[] = [];
    for (const item of input.items) {
      const product = await productRepository.getById(item.productId);
      if (!product) continue;
      itemCarbs.push(
        computeMealItemCarbs(item, product, globalUnits),
      );
    }
    const totalCarbs = sumCarbs(itemCarbs);

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

      for (const item of input.items) {
        await db.runAsync(
          `INSERT INTO meal_items (id, meal_id, product_id, quantity, unit_type, unit_id)
           VALUES (?, ?, ?, ?, ?, ?)`,
          generateId(),
          mealId,
          item.productId,
          item.quantity,
          item.unitType,
          item.unitId ?? null,
        );
      }
    });

    const meal = await this.getById(mealId);
    if (!meal) throw new Error('Failed to create meal');
    return meal;
  },

  async delete(id: string): Promise<void> {
    const db = getDatabase();
    await db.runAsync('DELETE FROM meals WHERE id = ?', id);
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
