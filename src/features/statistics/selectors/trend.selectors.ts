import type { EnrichedMealRecord } from '@/features/statistics/types/enrichedMeal';
import type { StatisticsPeriod } from '@/features/statistics/types/statisticsPeriod';
import { selectDailyCarbs } from '@/features/statistics/selectors/dailyCarbs.selectors';

export type TrendPoint = {
  date: string;
  label: string;
  carbs: number;
};

export const selectTrend = (
  allMeals: EnrichedMealRecord[],
  period: StatisticsPeriod,
): TrendPoint[] => selectDailyCarbs(allMeals, period);
