import { MealType } from '@/types/mealType';
import {
  CONFIGURABLE_MEAL_TYPES,
  defaultMealTypeSchedule,
  type MealTypeSchedule,
  type MealTypeTimeRange,
} from '@/types/mealTypeSchedule';

const toMinutes = (hours: number, minutes: number) => hours * 60 + minutes;

const isInRange = (timeInMinutes: number, range: MealTypeTimeRange): boolean => {
  const start = toMinutes(range.startHours, range.startMinutes);
  const end = toMinutes(range.endHours, range.endMinutes);
  return timeInMinutes >= start && timeInMinutes <= end;
};

/** Plages horaires pour la sélection automatique du type de repas. */
export const inferMealTypeFromTime = (
  hours: number,
  minutes: number,
  schedule: MealTypeSchedule = defaultMealTypeSchedule,
): MealType => {
  const timeInMinutes = toMinutes(hours, minutes);

  for (const mealType of CONFIGURABLE_MEAL_TYPES) {
    if (isInRange(timeInMinutes, schedule[mealType])) return mealType;
  }

  return MealType.COLLATION;
};

export const formatTimeOfDay = (hours: number, minutes: number): string =>
  `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

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
