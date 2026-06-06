import type { EnrichedMealRecord } from '@/features/statistics/types/enrichedMeal';
import { CATEGORY_TAGS, getPrimaryTag } from '@/features/statistics/utils/tagAttribution';
import type { ProductTag } from '@/types/productTag';

export type RecordsStats = {
  highestCarbMeal: { carbs: number; date: string; mealId: string } | null;
  highestCarbDay: { carbs: number; date: string } | null;
  mostConsumedProduct: { name: string; count: number } | null;
  mostConsumedCategory: { tag: ProductTag; carbs: number } | null;
};

export const selectRecords = (allMeals: EnrichedMealRecord[]): RecordsStats => {
  if (allMeals.length === 0) {
    return {
      highestCarbMeal: null,
      highestCarbDay: null,
      mostConsumedProduct: null,
      mostConsumedCategory: null,
    };
  }

  let highestCarbMeal: RecordsStats['highestCarbMeal'] = null;
  const dayTotals = new Map<string, number>();
  const productCounts = new Map<string, { name: string; count: number }>();
  const categoryTotals = new Map<ProductTag, number>();

  for (const meal of allMeals) {
    if (!highestCarbMeal || meal.totalCarbs > highestCarbMeal.carbs) {
      highestCarbMeal = { carbs: meal.totalCarbs, date: meal.date, mealId: meal.id };
    }
    dayTotals.set(meal.date, (dayTotals.get(meal.date) ?? 0) + meal.totalCarbs);

    for (const item of meal.items) {
      const existing = productCounts.get(item.productId);
      if (existing) {
        existing.count += 1;
      } else {
        productCounts.set(item.productId, { name: item.productName, count: 1 });
      }

      const tag = getPrimaryTag(item.productTags);
      if (tag && CATEGORY_TAGS.includes(tag)) {
        categoryTotals.set(tag, (categoryTotals.get(tag) ?? 0) + item.carbs);
      }
    }
  }

  let highestCarbDay: RecordsStats['highestCarbDay'] = null;
  for (const [date, carbs] of dayTotals.entries()) {
    if (!highestCarbDay || carbs > highestCarbDay.carbs) {
      highestCarbDay = { carbs, date };
    }
  }

  let mostConsumedProduct: RecordsStats['mostConsumedProduct'] = null;
  for (const entry of productCounts.values()) {
    if (!mostConsumedProduct || entry.count > mostConsumedProduct.count) {
      mostConsumedProduct = entry;
    }
  }

  let mostConsumedCategory: RecordsStats['mostConsumedCategory'] = null;
  for (const [tag, carbs] of categoryTotals.entries()) {
    if (!mostConsumedCategory || carbs > mostConsumedCategory.carbs) {
      mostConsumedCategory = { tag, carbs };
    }
  }

  return {
    highestCarbMeal,
    highestCarbDay,
    mostConsumedProduct,
    mostConsumedCategory,
  };
};
