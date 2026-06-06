import type { EnrichedMealRecord } from '@/features/statistics/types/enrichedMeal';
import { filterMealsByPeriod, getPeriodBounds } from '@/features/statistics/utils/periodFilter';
import type { StatisticsPeriod } from '@/features/statistics/types/statisticsPeriod';
import { computeConsistencyScore } from '@/features/statistics/utils/consistencyScore';
import { getDailyTotalsMap } from '@/features/statistics/selectors/summary.selectors';
import { selectDailyCarbs } from '@/features/statistics/selectors/dailyCarbs.selectors';

export type ConsistencyStats = {
  score: number;
  dayCount: number;
};

export const selectConsistencyScore = (
  allMeals: EnrichedMealRecord[],
  period: StatisticsPeriod,
): ConsistencyStats => {
  const dailyPoints = selectDailyCarbs(allMeals, period);
  const dailyTotals = dailyPoints.map((point) => point.carbs).filter((carbs) => carbs > 0);

  return {
    score: computeConsistencyScore(dailyTotals),
    dayCount: dailyTotals.length,
  };
};

export type BestDayEntry = {
  date: string;
  carbs: number;
};

export const selectBestDays = (
  allMeals: EnrichedMealRecord[],
  period: StatisticsPeriod,
  limit = 10,
): BestDayEntry[] => {
  const bounds = getPeriodBounds(period);
  const meals = filterMealsByPeriod(allMeals, period);
  const totalsMap = getDailyTotalsMap(meals, bounds);

  return [...totalsMap.entries()]
    .filter(([, carbs]) => carbs > 0)
    .map(([date, carbs]) => ({ date, carbs }))
    .sort((a, b) => a.carbs - b.carbs)
    .slice(0, limit);
};
