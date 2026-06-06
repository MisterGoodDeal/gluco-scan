import type { EnrichedMealRecord } from '@/features/statistics/types/enrichedMeal';

export const buildMealFingerprint = (meal: EnrichedMealRecord): string =>
  meal.items
    .map((item) => `${item.productId}:${item.quantity}:${item.unitType}:${item.unitId ?? ''}`)
    .sort()
    .join('|');

export const buildMealLabel = (meal: EnrichedMealRecord): string =>
  [...meal.items]
    .map((item) => item.productName)
    .sort((a, b) => a.localeCompare(b))
    .join(' + ');
