import type { EnrichedMealRecord } from '@/features/statistics/types/enrichedMeal';
import { filterMealsByPeriod, type PeriodBounds } from '@/features/statistics/utils/periodFilter';
import type { StatisticsPeriod } from '@/features/statistics/types/statisticsPeriod';

export type SummaryStats = {
  totalCarbs: number;
  averagePerDay: number;
  mealCount: number;
  uniqueProductCount: number;
  mostConsumedProduct: { name: string; count: number } | null;
};

export const selectSummary = (
  allMeals: EnrichedMealRecord[],
  period: StatisticsPeriod,
): SummaryStats => {
  const meals = filterMealsByPeriod(allMeals, period);

  if (meals.length === 0) {
    return {
      totalCarbs: 0,
      averagePerDay: 0,
      mealCount: 0,
      uniqueProductCount: 0,
      mostConsumedProduct: null,
    };
  }

  const totalCarbs = meals.reduce((sum, meal) => sum + meal.totalCarbs, 0);
  const daysWithMeals = new Set(meals.map((meal) => meal.date)).size;
  const productCounts = new Map<string, { name: string; count: number }>();

  for (const meal of meals) {
    for (const item of meal.items) {
      const existing = productCounts.get(item.productId);
      if (existing) {
        existing.count += 1;
      } else {
        productCounts.set(item.productId, { name: item.productName, count: 1 });
      }
    }
  }

  const uniqueProductCount = productCounts.size;
  let mostConsumedProduct: { name: string; count: number } | null = null;
  for (const entry of productCounts.values()) {
    if (!mostConsumedProduct || entry.count > mostConsumedProduct.count) {
      mostConsumedProduct = entry;
    }
  }

  return {
    totalCarbs,
    averagePerDay: daysWithMeals > 0 ? totalCarbs / daysWithMeals : 0,
    mealCount: meals.length,
    uniqueProductCount,
    mostConsumedProduct,
  };
};

export const getDailyTotalsMap = (
  meals: EnrichedMealRecord[],
  bounds: PeriodBounds,
): Map<string, number> => {
  const map = new Map<string, number>();
  for (const meal of meals) {
    if (bounds.startDate != null && meal.date < bounds.startDate) continue;
    if (meal.date > bounds.endDate) continue;
    map.set(meal.date, (map.get(meal.date) ?? 0) + meal.totalCarbs);
  }
  return map;
};
