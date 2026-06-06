export type StatisticsPeriod = '7d' | '30d' | '90d' | '1y' | 'all';

export const STATISTICS_PERIODS: StatisticsPeriod[] = ['7d', '30d', '90d', '1y', 'all'];

export const PERIOD_DAYS: Record<Exclude<StatisticsPeriod, 'all'>, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
  '1y': 365,
};
