import { MealType } from '@/types/mealType';

export type MealTypeTimeRange = {
  startHours: number;
  startMinutes: number;
  endHours: number;
  endMinutes: number;
};

export type MealTypeSchedule = Record<
  MealType.BREAKFAST | MealType.LUNCH | MealType.SNACK | MealType.DINNER,
  MealTypeTimeRange
>;

export const CONFIGURABLE_MEAL_TYPES = [
  MealType.BREAKFAST,
  MealType.LUNCH,
  MealType.SNACK,
  MealType.DINNER,
] as const;

export type ConfigurableMealType = (typeof CONFIGURABLE_MEAL_TYPES)[number];

export const defaultMealTypeSchedule: MealTypeSchedule = {
  [MealType.BREAKFAST]: {
    startHours: 6,
    startMinutes: 0,
    endHours: 10,
    endMinutes: 0,
  },
  [MealType.LUNCH]: {
    startHours: 11,
    startMinutes: 30,
    endHours: 14,
    endMinutes: 0,
  },
  [MealType.SNACK]: {
    startHours: 15,
    startMinutes: 30,
    endHours: 17,
    endMinutes: 30,
  },
  [MealType.DINNER]: {
    startHours: 19,
    startMinutes: 0,
    endHours: 22,
    endMinutes: 0,
  },
};

const isValidMinute = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 59;

const isValidHour = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 23;

const parseRange = (value: unknown, fallback: MealTypeTimeRange): MealTypeTimeRange => {
  if (!value || typeof value !== 'object') return fallback;
  const range = value as Partial<MealTypeTimeRange>;
  return {
    startHours: isValidHour(range.startHours) ? range.startHours : fallback.startHours,
    startMinutes: isValidMinute(range.startMinutes) ? range.startMinutes : fallback.startMinutes,
    endHours: isValidHour(range.endHours) ? range.endHours : fallback.endHours,
    endMinutes: isValidMinute(range.endMinutes) ? range.endMinutes : fallback.endMinutes,
  };
};

export const parseMealTypeSchedule = (raw: string | null | undefined): MealTypeSchedule => {
  if (!raw) return { ...defaultMealTypeSchedule };
  try {
    const parsed = JSON.parse(raw) as Partial<Record<ConfigurableMealType, unknown>>;
    return {
      [MealType.BREAKFAST]: parseRange(parsed.breakfast, defaultMealTypeSchedule.breakfast),
      [MealType.LUNCH]: parseRange(parsed.lunch, defaultMealTypeSchedule.lunch),
      [MealType.SNACK]: parseRange(parsed.snack, defaultMealTypeSchedule.snack),
      [MealType.DINNER]: parseRange(parsed.dinner, defaultMealTypeSchedule.dinner),
    };
  } catch {
    return { ...defaultMealTypeSchedule };
  }
};

export const serializeMealTypeSchedule = (schedule: MealTypeSchedule): string =>
  JSON.stringify(schedule);
