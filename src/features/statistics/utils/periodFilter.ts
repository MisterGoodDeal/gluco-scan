import type { StatisticsPeriod } from '@/features/statistics/types/statisticsPeriod';
import { PERIOD_DAYS } from '@/features/statistics/types/statisticsPeriod';
import type { EnrichedMealRecord } from '@/features/statistics/types/enrichedMeal';
import { addDays, toDateKey } from '@/utils/date';

export type PeriodBounds = {
  startDate: string | null;
  endDate: string;
};

export const getPeriodBounds = (period: StatisticsPeriod, referenceDate = new Date()): PeriodBounds => {
  const endDate = toDateKey(referenceDate);
  if (period === 'all') {
    return { startDate: null, endDate };
  }
  const days = PERIOD_DAYS[period];
  return { startDate: addDays(endDate, -(days - 1)), endDate };
};

export const isDateInPeriod = (dateKey: string, bounds: PeriodBounds): boolean => {
  if (bounds.startDate != null && dateKey < bounds.startDate) return false;
  return dateKey <= bounds.endDate;
};

export const filterMealsByPeriod = (
  meals: EnrichedMealRecord[],
  period: StatisticsPeriod,
  referenceDate = new Date(),
): EnrichedMealRecord[] => {
  const bounds = getPeriodBounds(period, referenceDate);
  return meals.filter((meal) => isDateInPeriod(meal.date, bounds));
};
