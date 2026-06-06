import type { EnrichedMealRecord } from '@/features/statistics/types/enrichedMeal';
import { filterMealsByPeriod } from '@/features/statistics/utils/periodFilter';
import type { StatisticsPeriod } from '@/features/statistics/types/statisticsPeriod';
import { buildMealFingerprint, buildMealLabel } from '@/features/statistics/utils/mealFingerprint';

export type FavoriteMealEntry = {
  fingerprint: string;
  name: string;
  count: number;
  averageCarbs: number;
};

export const selectFavoriteMeals = (
  allMeals: EnrichedMealRecord[],
  period: StatisticsPeriod,
  limit = 10,
): FavoriteMealEntry[] => {
  const meals = filterMealsByPeriod(allMeals, period);
  const groups = new Map<string, { name: string; count: number; totalCarbs: number }>();

  for (const meal of meals) {
    const fingerprint = buildMealFingerprint(meal);
    const existing = groups.get(fingerprint);
    if (existing) {
      existing.count += 1;
      existing.totalCarbs += meal.totalCarbs;
    } else {
      groups.set(fingerprint, {
        name: buildMealLabel(meal),
        count: 1,
        totalCarbs: meal.totalCarbs,
      });
    }
  }

  return [...groups.entries()]
    .map(([fingerprint, entry]) => ({
      fingerprint,
      name: entry.name,
      count: entry.count,
      averageCarbs: entry.totalCarbs / entry.count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};
