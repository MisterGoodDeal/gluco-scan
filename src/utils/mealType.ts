import { MealType } from '@/types/mealType';

const toMinutes = (hours: number, minutes: number) => hours * 60 + minutes;

/** Plages horaires pour la sélection automatique du type de repas. */
export const inferMealTypeFromTime = (hours: number, minutes: number): MealType => {
  const t = toMinutes(hours, minutes);

  if (t >= toMinutes(6, 0) && t <= toMinutes(10, 0)) return MealType.BREAKFAST;
  if (t >= toMinutes(11, 30) && t <= toMinutes(14, 0)) return MealType.LUNCH;
  if (t >= toMinutes(15, 30) && t <= toMinutes(17, 30)) return MealType.SNACK;
  if (t >= toMinutes(19, 0) && t <= toMinutes(22, 0)) return MealType.DINNER;

  return MealType.COLLATION;
};

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
