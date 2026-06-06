import type { EnrichedMealRecord } from '@/features/statistics/types/enrichedMeal';
import type { StatisticsPeriod } from '@/features/statistics/types/statisticsPeriod';
import { selectSummary } from '@/features/statistics/selectors/summary.selectors';
import { selectDailyCarbs } from '@/features/statistics/selectors/dailyCarbs.selectors';
import { selectTrend } from '@/features/statistics/selectors/trend.selectors';
import {
  selectAverageCarbsByMealType,
  selectCarbsByMealType,
} from '@/features/statistics/selectors/mealType.selectors';
import { selectCarbsByCategory } from '@/features/statistics/selectors/category.selectors';
import {
  selectTopProductsByCarbs,
  selectTopProductsByOccurrences,
} from '@/features/statistics/selectors/topProducts.selectors';
import { selectStarchBreakdown } from '@/features/statistics/selectors/starch.selectors';
import { selectCookedVsRaw } from '@/features/statistics/selectors/cookedRaw.selectors';
import { selectFavoriteMeals } from '@/features/statistics/selectors/favoriteMeals.selectors';
import { selectMostConsumedTags } from '@/features/statistics/selectors/tags.selectors';
import { selectHeatmapDays } from '@/features/statistics/selectors/heatmap.selectors';
import {
  selectBestDays,
  selectConsistencyScore,
} from '@/features/statistics/selectors/consistency.selectors';
import { selectRecords } from '@/features/statistics/selectors/records.selectors';

export const computeStatistics = (allMeals: EnrichedMealRecord[], period: StatisticsPeriod) => ({
  summary: selectSummary(allMeals, period),
  dailyCarbs: selectDailyCarbs(allMeals, period),
  trend: selectTrend(allMeals, period),
  carbsByMealType: selectCarbsByMealType(allMeals, period),
  carbsByCategory: selectCarbsByCategory(allMeals, period),
  topProductsByOccurrences: selectTopProductsByOccurrences(allMeals, period),
  topProductsByCarbs: selectTopProductsByCarbs(allMeals, period),
  starchBreakdown: selectStarchBreakdown(allMeals, period),
  averageCarbsByMealType: selectAverageCarbsByMealType(allMeals, period),
  cookedVsRaw: selectCookedVsRaw(allMeals, period),
  favoriteMeals: selectFavoriteMeals(allMeals, period),
  mostConsumedTags: selectMostConsumedTags(allMeals, period),
  heatmapDays: selectHeatmapDays(allMeals, period),
  consistency: selectConsistencyScore(allMeals, period),
  bestDays: selectBestDays(allMeals, period),
  records: selectRecords(allMeals),
});

export type ComputedStatistics = ReturnType<typeof computeStatistics>;
