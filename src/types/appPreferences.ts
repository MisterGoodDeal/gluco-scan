import type { SupportedLocale } from '@/i18n/types';
import { defaultMealTypeSchedule, type MealTypeSchedule } from '@/types/mealTypeSchedule';
import type { ThemePreference } from '@/types/theme';
import type { UnitSystem } from '@/types/unitSystem';

export interface AppPreferences {
  theme: ThemePreference;
  locale: SupportedLocale;
  unitSystem: UnitSystem;
  mealTypeSchedule: MealTypeSchedule;
}

export const defaultAppPreferences: AppPreferences = {
  theme: 'system',
  locale: 'fr',
  unitSystem: 'metric',
  mealTypeSchedule: defaultMealTypeSchedule,
};
