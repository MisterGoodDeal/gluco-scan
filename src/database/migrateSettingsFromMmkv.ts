import { createMMKV } from 'react-native-mmkv';

import type { SQLiteDatabase } from 'expo-sqlite';

import type { SupportedLocale } from '@/i18n/types';
import type { ThemePreference } from '@/types/theme';

const storage = createMMKV({ id: 'glucoscan-settings' });
const MIGRATION_FLAG = 'preferences_migrated_to_sqlite';
const PREF_ID = 'default';

const THEME_KEY = 'theme_preference';
const LOCALE_KEY = 'app_locale';

const readMmkvTheme = (): ThemePreference | null => {
  const value = storage.getString(THEME_KEY);
  if (value === 'light' || value === 'dark' || value === 'system') return value;
  return null;
};

const readMmkvLocale = (): SupportedLocale | null => {
  const value = storage.getString(LOCALE_KEY);
  if (value === 'fr' || value === 'en') return value;
  return null;
};

export const migrateSettingsFromMmkvIfNeeded = async (db: SQLiteDatabase): Promise<void> => {
  if (storage.getBoolean(MIGRATION_FLAG)) return;

  const theme = readMmkvTheme();
  const locale = readMmkvLocale();
  if (theme || locale) {
    const row = await db.getFirstAsync<{
      theme_preference: string;
      locale: string;
      unit_system: string;
    }>(`SELECT theme_preference, locale, unit_system FROM app_preferences WHERE id = ?`, PREF_ID);

    if (row) {
      await db.runAsync(
        `UPDATE app_preferences
         SET theme_preference = ?, locale = ?, unit_system = ?
         WHERE id = ?`,
        theme ?? row.theme_preference,
        locale ?? row.locale,
        row.unit_system,
        PREF_ID,
      );
    }
  }

  storage.set(MIGRATION_FLAG, true);
};
