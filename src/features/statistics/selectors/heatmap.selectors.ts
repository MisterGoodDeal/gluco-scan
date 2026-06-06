import type { EnrichedMealRecord } from '@/features/statistics/types/enrichedMeal';
import { filterMealsByPeriod, getPeriodBounds, isDateInPeriod } from '@/features/statistics/utils/periodFilter';
import type { StatisticsPeriod } from '@/features/statistics/types/statisticsPeriod';
import { HEATMAP_GRID_DAYS } from '@/features/statistics/utils/heatmapLevels';
import { addDays } from '@/utils/date';
import { getDailyTotalsMap } from '@/features/statistics/selectors/summary.selectors';

export type HeatmapDay = {
  date: string;
  carbs: number;
};

export const selectHeatmapDays = (
  allMeals: EnrichedMealRecord[],
  period: StatisticsPeriod,
): HeatmapDay[] => {
  const periodBounds = getPeriodBounds(period);
  const endDate = periodBounds.endDate;
  const gridStart = addDays(endDate, -(HEATMAP_GRID_DAYS - 1));
  const meals = filterMealsByPeriod(allMeals, period);
  const totalsMap = getDailyTotalsMap(meals, { startDate: gridStart, endDate });

  const days: HeatmapDay[] = [];
  let current = gridStart;
  while (current <= endDate) {
    const inPeriod = isDateInPeriod(current, periodBounds);
    days.push({
      date: current,
      carbs: inPeriod ? (totalsMap.get(current) ?? 0) : 0,
    });
    current = addDays(current, 1);
  }

  return days;
};

export const selectMealsForDate = (
  allMeals: EnrichedMealRecord[],
  date: string,
): EnrichedMealRecord[] =>
  allMeals.filter((meal) => meal.date === date);
