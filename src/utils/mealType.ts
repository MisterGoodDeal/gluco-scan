import { MealType } from '@/types/mealType';

export const getMealTypeLabelKey = (type: MealType): string => {
  const map: Record<MealType, string> = {
    [MealType.BREAKFAST]: 'meals.breakfast',
    [MealType.LUNCH]: 'meals.lunch',
    [MealType.SNACK]: 'meals.snack',
    [MealType.COLLATION]: 'meals.collation',
    [MealType.DINNER]: 'meals.dinner',
  };
  return map[type];
};
