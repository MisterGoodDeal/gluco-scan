import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { en } from '@/i18n/locales/en';
import { fr } from '@/i18n/locales/fr';
import { readStoredLocale, writeStoredLocale } from '@/i18n/localeStorage';
import { supportedLocales, type SupportedLocale } from '@/i18n/types';

export { supportedLocales, type SupportedLocale };

const resolveInitialLocale = (): SupportedLocale => {
  const stored = readStoredLocale();
  if (stored) return stored;

  const deviceLocale = getLocales()[0]?.languageCode ?? 'fr';
  return supportedLocales.includes(deviceLocale as SupportedLocale)
    ? (deviceLocale as SupportedLocale)
    : 'fr';
};

export const setAppLocale = async (locale: SupportedLocale): Promise<void> => {
  writeStoredLocale(locale);
  await i18n.changeLanguage(locale);
};

export const getLanguageLabelKey = (locale: SupportedLocale): 'settings.languageFr' | 'settings.languageEn' =>
  locale === 'fr' ? 'settings.languageFr' : 'settings.languageEn';

void i18n.use(initReactI18next).init({
  resources: {
    fr: { translation: fr },
    en: { translation: en },
  },
  lng: resolveInitialLocale(),
  fallbackLng: 'fr',
  interpolation: { escapeValue: false },
  compatibilityJSON: 'v4',
});

export default i18n;

export const getCurrentLocale = (): SupportedLocale =>
  supportedLocales.includes(i18n.language as SupportedLocale)
    ? (i18n.language as SupportedLocale)
    : 'fr';

export const getOffLocaleParams = (): { cc: string; lc: string } => {
  const locale = getCurrentLocale();
  return locale === 'fr' ? { cc: 'fr', lc: 'fr' } : { cc: 'world', lc: 'en' };
};

export const getSortLocale = (): string => (getCurrentLocale() === 'fr' ? 'fr' : 'en');

export const getDecimalSeparator = (): string => (getCurrentLocale() === 'fr' ? ',' : '.');
