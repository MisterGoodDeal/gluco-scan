import type { EnrichedMealRecord } from '@/features/statistics/types/enrichedMeal';
import { filterMealsByPeriod } from '@/features/statistics/utils/periodFilter';
import type { StatisticsPeriod } from '@/features/statistics/types/statisticsPeriod';
import { CATEGORY_TAGS, getPrimaryTag } from '@/features/statistics/utils/tagAttribution';
import type { ProductTag } from '@/types/productTag';

export type CategorySlice = {
  tag: ProductTag;
  carbs: number;
  percentage: number;
};

export const selectCarbsByCategory = (
  allMeals: EnrichedMealRecord[],
  period: StatisticsPeriod,
): CategorySlice[] => {
  const meals = filterMealsByPeriod(allMeals, period);
  const totals = new Map<ProductTag, number>();

  for (const meal of meals) {
    for (const item of meal.items) {
      const tag = getPrimaryTag(item.productTags);
      if (!tag || !CATEGORY_TAGS.includes(tag)) continue;
      totals.set(tag, (totals.get(tag) ?? 0) + item.carbs);
    }
  }

  const grandTotal = [...totals.values()].reduce((sum, value) => sum + value, 0);

  return CATEGORY_TAGS.map((tag) => ({
    tag,
    carbs: totals.get(tag) ?? 0,
    percentage: grandTotal > 0 ? ((totals.get(tag) ?? 0) / grandTotal) * 100 : 0,
  })).filter((slice) => slice.carbs > 0);
};
