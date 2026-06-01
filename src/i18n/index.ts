import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { en } from '@/i18n/locales/en';
import { fr } from '@/i18n/locales/fr';

export const supportedLocales = ['fr', 'en'] as const;
export type SupportedLocale = (typeof supportedLocales)[number];

const resolveInitialLocale = (): SupportedLocale => {
  const deviceLocale = getLocales()[0]?.languageCode ?? 'fr';
  return supportedLocales.includes(deviceLocale as SupportedLocale)
    ? (deviceLocale as SupportedLocale)
    : 'fr';
};

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
