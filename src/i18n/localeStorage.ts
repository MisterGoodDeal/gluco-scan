import { createMMKV } from 'react-native-mmkv';

import type { SupportedLocale } from '@/i18n/types';

const storage = createMMKV({ id: 'glucoscan-settings' });
const LOCALE_KEY = 'app_locale';

export const readStoredLocale = (): SupportedLocale | null => {
  const value = storage.getString(LOCALE_KEY);
  if (value === 'fr' || value === 'en') {
    return value;
  }
  return null;
};

export const writeStoredLocale = (locale: SupportedLocale): void => {
  storage.set(LOCALE_KEY, locale);
};
