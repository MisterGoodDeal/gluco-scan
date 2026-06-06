import type { EnrichedMealRecord } from '@/features/statistics/types/enrichedMeal';
import { selectSummary } from '@/features/statistics/selectors/summary.selectors';
import { getDailyTotalsMap } from '@/features/statistics/selectors/summary.selectors';
import { selectWidgetHeatmapDays } from '@/features/widgets/selectors/widgetHeatmap.selectors';
import type { WidgetData } from '@/features/widgets/types/widgetData';
import { toDateKey } from '@/utils/date';

export const buildWidgetSnapshot = (allMeals: EnrichedMealRecord[]): WidgetData => {
  const today = toDateKey(new Date());
  const heatmap = selectWidgetHeatmapDays(allMeals);
  const todayTotals = getDailyTotalsMap(allMeals, { startDate: today, endDate: today });
  const weekSummary = selectSummary(allMeals, '7d');
  const monthSummary = selectSummary(allMeals, '30d');
  const maxDayCarbs = heatmap.reduce((max, day) => Math.max(max, day.carbs), 0);
  const totalMealsToday = allMeals.filter((meal) => meal.date === today).length;

  return {
    summary: {
      todayCarbs: todayTotals.get(today) ?? 0,
      weekAverageCarbs: weekSummary.averagePerDay,
      monthAverageCarbs: monthSummary.averagePerDay,
      maxDayCarbs,
      totalMealsToday,
      lastUpdate: new Date().toISOString(),
    },
    heatmap,
  };
};
