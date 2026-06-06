import type { EnrichedMealRecord } from '@/features/statistics/types/enrichedMeal';
import { filterMealsByPeriod } from '@/features/statistics/utils/periodFilter';
import type { StatisticsPeriod } from '@/features/statistics/types/statisticsPeriod';
import { getPrimaryTag } from '@/features/statistics/utils/tagAttribution';
import type { ProductTag } from '@/types/productTag';

export type TagRankEntry = {
  tag: ProductTag;
  count: number;
};

export const selectMostConsumedTags = (
  allMeals: EnrichedMealRecord[],
  period: StatisticsPeriod,
  limit = 10,
): TagRankEntry[] => {
  const meals = filterMealsByPeriod(allMeals, period);
  const counts = new Map<ProductTag, number>();

  for (const meal of meals) {
    for (const item of meal.items) {
      const tag = getPrimaryTag(item.productTags);
      if (!tag) continue;
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};
