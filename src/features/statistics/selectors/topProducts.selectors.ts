import type { EnrichedMealRecord } from '@/features/statistics/types/enrichedMeal';
import { filterMealsByPeriod } from '@/features/statistics/utils/periodFilter';
import type { StatisticsPeriod } from '@/features/statistics/types/statisticsPeriod';

export type ProductRankEntry = {
  productId: string;
  name: string;
  value: number;
};

export const selectTopProductsByOccurrences = (
  allMeals: EnrichedMealRecord[],
  period: StatisticsPeriod,
  limit = 10,
): ProductRankEntry[] => {
  const meals = filterMealsByPeriod(allMeals, period);
  const counts = new Map<string, { name: string; count: number }>();

  for (const meal of meals) {
    for (const item of meal.items) {
      const existing = counts.get(item.productId);
      if (existing) {
        existing.count += 1;
      } else {
        counts.set(item.productId, { name: item.productName, count: 1 });
      }
    }
  }

  return [...counts.entries()]
    .map(([productId, entry]) => ({
      productId,
      name: entry.name,
      value: entry.count,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
};

export const selectTopProductsByCarbs = (
  allMeals: EnrichedMealRecord[],
  period: StatisticsPeriod,
  limit = 10,
): ProductRankEntry[] => {
  const meals = filterMealsByPeriod(allMeals, period);
  const totals = new Map<string, { name: string; carbs: number }>();

  for (const meal of meals) {
    for (const item of meal.items) {
      const existing = totals.get(item.productId);
      if (existing) {
        existing.carbs += item.carbs;
      } else {
        totals.set(item.productId, { name: item.productName, carbs: item.carbs });
      }
    }
  }

  return [...totals.entries()]
    .map(([productId, entry]) => ({
      productId,
      name: entry.name,
      value: entry.carbs,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
};
