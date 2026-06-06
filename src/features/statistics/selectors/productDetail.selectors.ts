import type { EnrichedMealRecord } from '@/features/statistics/types/enrichedMeal';
import type { MealType } from '@/types/mealType';
import { hasCookingConversion } from '@/utils/cooking/hasCookingConversion';

export type ProductDetailStats = {
  timesConsumed: number;
  lastConsumedDate: string | null;
  totalCarbs: number;
  averagePortion: number | null;
  averageCookedPortion: number | null;
  averageRawPortion: number | null;
  favoriteMealType: MealType | null;
};

export const selectProductDetailStats = (
  allMeals: EnrichedMealRecord[],
  productId: string,
): ProductDetailStats => {
  const mealTypeCounts = new Map<MealType, number>();
  let timesConsumed = 0;
  let lastConsumedDate: string | null = null;
  let totalCarbs = 0;
  let portionSum = 0;
  let portionCount = 0;
  let cookedSum = 0;
  let cookedCount = 0;
  let rawSum = 0;
  let rawCount = 0;

  for (const meal of allMeals) {
    for (const item of meal.items) {
      if (item.productId !== productId) continue;

      timesConsumed += 1;
      totalCarbs += item.carbs;
      if (!lastConsumedDate || meal.date > lastConsumedDate) {
        lastConsumedDate = meal.date;
      }

      mealTypeCounts.set(meal.type, (mealTypeCounts.get(meal.type) ?? 0) + 1);

      if (item.unitType === 'grams') {
        portionSum += item.quantity;
        portionCount += 1;

        if (hasCookingConversion({ tags: item.productTags, customCookingFactor: null })) {
          if (item.quantityType === 'cooked') {
            cookedSum += item.quantity;
            cookedCount += 1;
          } else {
            rawSum += item.quantity;
            rawCount += 1;
          }
        }
      }
    }
  }

  let favoriteMealType: MealType | null = null;
  let maxTypeCount = 0;
  for (const [type, count] of mealTypeCounts.entries()) {
    if (count > maxTypeCount) {
      maxTypeCount = count;
      favoriteMealType = type;
    }
  }

  return {
    timesConsumed,
    lastConsumedDate,
    totalCarbs,
    averagePortion: portionCount > 0 ? portionSum / portionCount : null,
    averageCookedPortion: cookedCount > 0 ? cookedSum / cookedCount : null,
    averageRawPortion: rawCount > 0 ? rawSum / rawCount : null,
    favoriteMealType,
  };
};
