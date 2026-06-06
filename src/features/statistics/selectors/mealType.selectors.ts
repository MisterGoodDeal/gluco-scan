import type { EnrichedMealRecord } from '@/features/statistics/types/enrichedMeal';
import { filterMealsByPeriod } from '@/features/statistics/utils/periodFilter';
import type { StatisticsPeriod } from '@/features/statistics/types/statisticsPeriod';
import { MEAL_TYPES, type MealType } from '@/types/mealType';

export type MealTypeSlice = {
  type: MealType;
  carbs: number;
  percentage: number;
  mealCount: number;
};

export type MealTypeAverage = {
  type: MealType;
  averageCarbs: number;
  mealCount: number;
};

export const selectCarbsByMealType = (
  allMeals: EnrichedMealRecord[],
  period: StatisticsPeriod,
): MealTypeSlice[] => {
  const meals = filterMealsByPeriod(allMeals, period);
  const totals = new Map<MealType, { carbs: number; count: number }>();

  for (const type of MEAL_TYPES) {
    totals.set(type, { carbs: 0, count: 0 });
  }

  for (const meal of meals) {
    const entry = totals.get(meal.type) ?? { carbs: 0, count: 0 };
    entry.carbs += meal.totalCarbs;
    entry.count += 1;
    totals.set(meal.type, entry);
  }

  const grandTotal = meals.reduce((sum, meal) => sum + meal.totalCarbs, 0);

  return MEAL_TYPES.map((type) => {
    const entry = totals.get(type) ?? { carbs: 0, count: 0 };
    return {
      type,
      carbs: entry.carbs,
      percentage: grandTotal > 0 ? (entry.carbs / grandTotal) * 100 : 0,
      mealCount: entry.count,
    };
  }).filter((slice) => slice.carbs > 0 || slice.mealCount > 0);
};

export const selectAverageCarbsByMealType = (
  allMeals: EnrichedMealRecord[],
  period: StatisticsPeriod,
): MealTypeAverage[] =>
  selectCarbsByMealType(allMeals, period).map((slice) => ({
    type: slice.type,
    averageCarbs: slice.mealCount > 0 ? slice.carbs / slice.mealCount : 0,
    mealCount: slice.mealCount,
  }));
