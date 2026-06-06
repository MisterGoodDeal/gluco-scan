import type { EnrichedMealRecord } from '@/features/statistics/types/enrichedMeal';
import { filterMealsByPeriod, getPeriodBounds } from '@/features/statistics/utils/periodFilter';
import type { StatisticsPeriod } from '@/features/statistics/types/statisticsPeriod';
import { addDays } from '@/utils/date';
import { getDailyTotalsMap } from '@/features/statistics/selectors/summary.selectors';

export type DailyCarbPoint = {
  date: string;
  label: string;
  carbs: number;
};

const formatShortLabel = (dateKey: string): string => {
  const [, , d] = dateKey.split('-');
  return String(Number(d));
};

export const selectDailyCarbs = (
  allMeals: EnrichedMealRecord[],
  period: StatisticsPeriod,
): DailyCarbPoint[] => {
  const bounds = getPeriodBounds(period);
  const meals = filterMealsByPeriod(allMeals, period);
  const totalsMap = getDailyTotalsMap(meals, bounds);

  if (bounds.startDate == null) {
    const dates = [...totalsMap.keys()].sort();
    return dates.map((date) => ({
      date,
      label: formatShortLabel(date),
      carbs: totalsMap.get(date) ?? 0,
    }));
  }

  const points: DailyCarbPoint[] = [];
  let current = bounds.startDate;
  while (current <= bounds.endDate) {
    points.push({
      date: current,
      label: formatShortLabel(current),
      carbs: totalsMap.get(current) ?? 0,
    });
    current = addDays(current, 1);
  }
  return points;
};
