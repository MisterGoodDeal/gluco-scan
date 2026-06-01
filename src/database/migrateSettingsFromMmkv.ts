import { createMMKV } from 'react-native-mmkv';

import type { SQLiteDatabase } from 'expo-sqlite';

import { appPreferencesRepository } from '@/repositories/appPreferences.repository';
import type { SupportedLocale } from '@/i18n/types';
import type { ThemePreference } from '@/styles/theme';

const storage = createMMKV({ id: 'glucoscan-settings' });
const MIGRATION_FLAG = 'preferences_migrated_to_sqlite';

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

export const migrateSettingsFromMmkvIfNeeded = async (_db: SQLiteDatabase): Promise<void> => {
  if (storage.getBoolean(MIGRATION_FLAG)) return;

  const theme = readMmkvTheme();
  const locale = readMmkvLocale();
  if (theme || locale) {
    await appPreferencesRepository.update({
      ...(theme ? { theme } : {}),
      ...(locale ? { locale } : {}),
    });
  }

  storage.set(MIGRATION_FLAG, true);
};
