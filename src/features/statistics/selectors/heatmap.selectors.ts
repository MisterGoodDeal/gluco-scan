import type { EnrichedMealRecord } from '@/features/statistics/types/enrichedMeal';
import { filterMealsByPeriod, getPeriodBounds } from '@/features/statistics/utils/periodFilter';
import type { StatisticsPeriod } from '@/features/statistics/types/statisticsPeriod';
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
  const bounds = getPeriodBounds(period);
  const meals = filterMealsByPeriod(allMeals, period);
  const totalsMap = getDailyTotalsMap(meals, bounds);

  if (bounds.startDate == null) {
    return [...totalsMap.entries()]
      .map(([date, carbs]) => ({ date, carbs }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  const days: HeatmapDay[] = [];
  let current = bounds.startDate;
  while (current <= bounds.endDate) {
    days.push({ date: current, carbs: totalsMap.get(current) ?? 0 });
    current = addDays(current, 1);
  }
  return days;
};

export const selectMealsForDate = (
  allMeals: EnrichedMealRecord[],
  date: string,
): EnrichedMealRecord[] =>
  allMeals.filter((meal) => meal.date === date);
