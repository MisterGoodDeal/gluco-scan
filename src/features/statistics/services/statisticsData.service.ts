import { getDatabase } from '@/database/client';
import type { EnrichedMealItem, EnrichedMealRecord } from '@/features/statistics/types/enrichedMeal';
import type { MealItemQuantityType, MealItemUnitType } from '@/types/mealItem';
import type { MealType } from '@/types/mealType';
import type { ProductTag } from '@/types/productTag';

type StatisticsRow = {
  meal_id: string;
  meal_type: string;
  meal_date: string;
  meal_created_at: string;
  meal_total_carbs: number;
  item_id: string;
  product_id: string;
  quantity: number;
  unit_type: string;
  unit_id: string | null;
  quantity_type: string;
  raw_equivalent_quantity: number | null;
  item_carbs: number | null;
  product_name: string;
  product_tags: string;
};

const parseTags = (raw: string): ProductTag[] => {
  try {
    const parsed = JSON.parse(raw) as ProductTag[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const loadEnrichedMeals = async (): Promise<EnrichedMealRecord[]> => {
  const db = getDatabase();
  const rows = await db.getAllAsync<StatisticsRow>(
    `SELECT
      m.id AS meal_id,
      m.type AS meal_type,
      m.date AS meal_date,
      m.created_at AS meal_created_at,
      m.total_carbs AS meal_total_carbs,
      mi.id AS item_id,
      mi.product_id,
      mi.quantity,
      mi.unit_type,
      mi.unit_id,
      mi.quantity_type,
      mi.raw_equivalent_quantity,
      mi.carbs AS item_carbs,
      p.name AS product_name,
      p.tags AS product_tags
    FROM meals m
    INNER JOIN meal_items mi ON mi.meal_id = m.id
    INNER JOIN products p ON p.id = mi.product_id
    ORDER BY m.date, m.created_at`,
  );

  const mealsMap = new Map<string, EnrichedMealRecord>();

  for (const row of rows) {
    let meal = mealsMap.get(row.meal_id);
    if (!meal) {
      meal = {
        id: row.meal_id,
        type: row.meal_type as MealType,
        date: row.meal_date,
        createdAt: row.meal_created_at,
        totalCarbs: row.meal_total_carbs,
        items: [],
      };
      mealsMap.set(row.meal_id, meal);
    }

    const item: EnrichedMealItem = {
      id: row.item_id,
      productId: row.product_id,
      productName: row.product_name,
      productTags: parseTags(row.product_tags),
      quantity: row.quantity,
      unitType: row.unit_type as MealItemUnitType,
      unitId: row.unit_id ?? undefined,
      quantityType: row.quantity_type as MealItemQuantityType,
      rawEquivalentQuantity: row.raw_equivalent_quantity ?? undefined,
      carbs: row.item_carbs ?? 0,
    };
    meal.items.push(item);
  }

  return [...mealsMap.values()];
};
