import type { EnrichedMealRecord } from '@/features/statistics/types/enrichedMeal';
import { getDailyTotalsMap } from '@/features/statistics/selectors/summary.selectors';
import { WIDGET_HEATMAP_DAYS, type WidgetHeatmapDay } from '@/features/widgets/types/widgetData';
import { addDays, toDateKey } from '@/utils/date';

export const selectWidgetHeatmapDays = (allMeals: EnrichedMealRecord[]): WidgetHeatmapDay[] => {
  const endDate = toDateKey(new Date());
  const startDate = addDays(endDate, -(WIDGET_HEATMAP_DAYS - 1));
  const totalsMap = getDailyTotalsMap(allMeals, { startDate, endDate });

  const days: WidgetHeatmapDay[] = [];
  let current = startDate;
  while (current <= endDate) {
    days.push({ date: current, carbs: totalsMap.get(current) ?? 0 });
    current = addDays(current, 1);
  }

  return days;
};
