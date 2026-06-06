import type { EnrichedMealRecord } from '@/features/statistics/types/enrichedMeal';
import type { ProductTag } from '@/types/productTag';
import { convertRawToCooked } from '@/utils/cooking/convertRawToCooked';
import { getCookingFactor } from '@/utils/cooking/getCookingFactor';
import { hasCookingConversion } from '@/utils/cooking/hasCookingConversion';

export type MealDetailStats = {
  mealCarbs: number;
  dayPercentage: number | null;
  equivalentRawWeight: number | null;
  equivalentCookedWeight: number | null;
  tags: ProductTag[];
  mostCarbRichProduct: { name: string; carbs: number } | null;
};

export const selectMealDetailStats = (
  allMeals: EnrichedMealRecord[],
  meal: EnrichedMealRecord,
): MealDetailStats => {
  const dayMeals = allMeals.filter((entry) => entry.date === meal.date);
  const dayTotal = dayMeals.reduce((sum, entry) => sum + entry.totalCarbs, 0);

  let equivalentRawWeight = 0;
  let equivalentCookedWeight = 0;
  let hasRaw = false;
  let hasCooked = false;
  const tagSet = new Set<ProductTag>();
  let mostCarbRichProduct: MealDetailStats['mostCarbRichProduct'] = null;

  for (const item of meal.items) {
    for (const tag of item.productTags) {
      tagSet.add(tag);
    }

    if (!mostCarbRichProduct || item.carbs > mostCarbRichProduct.carbs) {
      mostCarbRichProduct = { name: item.productName, carbs: item.carbs };
    }

    if (item.unitType !== 'grams') continue;
    if (!hasCookingConversion({ tags: item.productTags, customCookingFactor: null })) continue;

    const rawGrams = item.rawEquivalentQuantity ?? item.quantity;
    equivalentRawWeight += rawGrams;
    hasRaw = true;

    const factor = getCookingFactor({ tags: item.productTags, customCookingFactor: null }, []);
    if (factor != null) {
      equivalentCookedWeight += convertRawToCooked(rawGrams, factor);
      hasCooked = true;
    }
  }

  return {
    mealCarbs: meal.totalCarbs,
    dayPercentage: dayTotal > 0 ? (meal.totalCarbs / dayTotal) * 100 : null,
    equivalentRawWeight: hasRaw ? equivalentRawWeight : null,
    equivalentCookedWeight: hasCooked ? equivalentCookedWeight : null,
    tags: [...tagSet],
    mostCarbRichProduct,
  };
};
