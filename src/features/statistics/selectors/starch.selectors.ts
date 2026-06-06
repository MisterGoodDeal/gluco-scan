import type { EnrichedMealRecord } from '@/features/statistics/types/enrichedMeal';
import { filterMealsByPeriod } from '@/features/statistics/utils/periodFilter';
import type { StatisticsPeriod } from '@/features/statistics/types/statisticsPeriod';
import { getStarchBreakdownTag, STARCH_BREAKDOWN_TAGS } from '@/features/statistics/utils/tagAttribution';
import type { ProductTag } from '@/types/productTag';

export type StarchSlice = {
  tag: ProductTag;
  carbs: number;
  percentage: number;
};

export const selectStarchBreakdown = (
  allMeals: EnrichedMealRecord[],
  period: StatisticsPeriod,
): StarchSlice[] => {
  const meals = filterMealsByPeriod(allMeals, period);
  const totals = new Map<ProductTag, number>();

  for (const meal of meals) {
    for (const item of meal.items) {
      const tag = getStarchBreakdownTag(item.productTags);
      if (!tag) continue;
      totals.set(tag, (totals.get(tag) ?? 0) + item.carbs);
    }
  }

  const grandTotal = [...totals.values()].reduce((sum, value) => sum + value, 0);

  return STARCH_BREAKDOWN_TAGS.map((tag) => ({
    tag,
    carbs: totals.get(tag) ?? 0,
    percentage: grandTotal > 0 ? ((totals.get(tag) ?? 0) / grandTotal) * 100 : 0,
  })).filter((slice) => slice.carbs > 0);
};
