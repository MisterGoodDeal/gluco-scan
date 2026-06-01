import type { MealItemUnitType } from '@/types/mealItem';

export const formatMealItemQuantity = (
  quantity: number,
  unitType: MealItemUnitType,
  unitLabel: string | undefined,
  formatMassValue: (grams: number) => string,
  massUnit: string,
): string => {
  if (unitType === 'grams') {
    return `${formatMassValue(quantity)} ${massUnit}`;
  }
  return `${quantity} ${unitLabel ?? ''}`.trim();
};
