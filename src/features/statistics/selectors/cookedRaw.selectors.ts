import type { EnrichedMealRecord } from '@/features/statistics/types/enrichedMeal';
import { filterMealsByPeriod } from '@/features/statistics/utils/periodFilter';
import type { StatisticsPeriod } from '@/features/statistics/types/statisticsPeriod';
import { hasCookingConversion } from '@/utils/cooking/hasCookingConversion';

export type CookedRawSlice = {
  key: 'raw' | 'cooked';
  carbs: number;
  count: number;
  percentage: number;
};

export const selectCookedVsRaw = (
  allMeals: EnrichedMealRecord[],
  period: StatisticsPeriod,
): CookedRawSlice[] => {
  const meals = filterMealsByPeriod(allMeals, period);
  const totals = {
    raw: { carbs: 0, count: 0 },
    cooked: { carbs: 0, count: 0 },
  };

  for (const meal of meals) {
    for (const item of meal.items) {
      if (item.unitType !== 'grams') continue;
      if (!hasCookingConversion({ tags: item.productTags, customCookingFactor: null })) continue;

      const key = item.quantityType === 'cooked' ? 'cooked' : 'raw';
      totals[key].carbs += item.carbs;
      totals[key].count += 1;
    }
  }

  const grandTotal = totals.raw.carbs + totals.cooked.carbs;

  return (['raw', 'cooked'] as const).map((key) => ({
    key,
    carbs: totals[key].carbs,
    count: totals[key].count,
    percentage: grandTotal > 0 ? (totals[key].carbs / grandTotal) * 100 : 0,
  })).filter((slice) => slice.count > 0);
};
