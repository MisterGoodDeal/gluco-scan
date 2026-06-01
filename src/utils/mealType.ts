import { MealType } from '@/types/mealType';

export type MealTypeLabelKey =
  | 'meals.breakfast'
  | 'meals.lunch'
  | 'meals.snack'
  | 'meals.collation'
  | 'meals.dinner';

export const getMealTypeLabelKey = (type: MealType): MealTypeLabelKey => {
  const map: Record<MealType, MealTypeLabelKey> = {
    [MealType.BREAKFAST]: 'meals.breakfast',
    [MealType.LUNCH]: 'meals.lunch',
    [MealType.SNACK]: 'meals.snack',
    [MealType.COLLATION]: 'meals.collation',
    [MealType.DINNER]: 'meals.dinner',
  };
  return map[type];
};
