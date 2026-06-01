export enum MealType {
  BREAKFAST = 'breakfast',
  LUNCH = 'lunch',
  SNACK = 'snack',
  COLLATION = 'collation',
  DINNER = 'dinner',
}

export const MEAL_TYPES = [
  MealType.BREAKFAST,
  MealType.LUNCH,
  MealType.SNACK,
  MealType.COLLATION,
  MealType.DINNER,
] as const;
