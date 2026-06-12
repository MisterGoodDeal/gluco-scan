import { getDatabase } from '@/database/client';
import type { AppPreferences } from '@/types/appPreferences';
import { defaultAppPreferences } from '@/types/appPreferences';
import type { SupportedLocale } from '@/i18n/types';
import { supportedLocales } from '@/i18n/types';
import { parseMealTypeSchedule, serializeMealTypeSchedule } from '@/types/mealTypeSchedule';
import type { ThemePreference } from '@/types/theme';
import { unitSystems, type UnitSystem } from '@/types/unitSystem';

const PREF_ID = 'default';

type PreferencesRow = {
  theme_preference: string;
  locale: string;
  unit_system: string;
  meal_type_schedule: string | null;
};

const parseTheme = (value: string): ThemePreference => {
  if (value === 'light' || value === 'dark' || value === 'system') return value;
  return defaultAppPreferences.theme;
};

const parseLocale = (value: string): SupportedLocale => {
  if (supportedLocales.includes(value as SupportedLocale)) return value as SupportedLocale;
  return defaultAppPreferences.locale;
};

const parseUnitSystem = (value: string): UnitSystem => {
  if (unitSystems.includes(value as UnitSystem)) return value as UnitSystem;
  return defaultAppPreferences.unitSystem;
};

const mapRow = (row: PreferencesRow): AppPreferences => ({
  theme: parseTheme(row.theme_preference),
  locale: parseLocale(row.locale),
  unitSystem: parseUnitSystem(row.unit_system),
  mealTypeSchedule: parseMealTypeSchedule(row.meal_type_schedule),
});

export const appPreferencesRepository = {
  async get(): Promise<AppPreferences> {
    const db = getDatabase();
    const row = await db.getFirstAsync<PreferencesRow>(
      `SELECT theme_preference, locale, unit_system, meal_type_schedule FROM app_preferences WHERE id = ?`,
      PREF_ID,
    );
    if (!row) return { ...defaultAppPreferences };
    return mapRow(row);
  },

  async update(partial: Partial<AppPreferences>): Promise<AppPreferences> {
    const current = await this.get();
    const next: AppPreferences = { ...current, ...partial };
    const db = getDatabase();
    await db.runAsync(
      `UPDATE app_preferences
       SET theme_preference = ?, locale = ?, unit_system = ?, meal_type_schedule = ?
       WHERE id = ?`,
      next.theme,
      next.locale,
      next.unitSystem,
      serializeMealTypeSchedule(next.mealTypeSchedule),
      PREF_ID,
    );
    return next;
  },
};
