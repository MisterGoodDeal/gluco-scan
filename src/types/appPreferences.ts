import type { SupportedLocale } from '@/i18n/types';
import type { ThemePreference } from '@/styles/theme';
import type { UnitSystem } from '@/types/unitSystem';

export interface AppPreferences {
  theme: ThemePreference;
  locale: SupportedLocale;
  unitSystem: UnitSystem;
}

export const defaultAppPreferences: AppPreferences = {
  theme: 'system',
  locale: 'fr',
  unitSystem: 'metric',
};
