import { create } from 'zustand';

import i18n from '@/i18n';
import { appPreferencesRepository } from '@/repositories/appPreferences.repository';
import type { AppPreferences } from '@/types/appPreferences';
import { defaultAppPreferences } from '@/types/appPreferences';
import type { SupportedLocale } from '@/i18n/types';
import type { ThemePreference } from '@/styles/theme';
import type { UnitSystem } from '@/types/unitSystem';

type PreferencesStore = AppPreferences & {
  hydrated: boolean;
  hydrate: () => Promise<void>;
  setTheme: (theme: ThemePreference) => Promise<void>;
  setLocale: (locale: SupportedLocale) => Promise<void>;
  setUnitSystem: (unitSystem: UnitSystem) => Promise<void>;
  applyImported: (preferences: AppPreferences) => Promise<void>;
};

const applyToI18n = async (locale: SupportedLocale): Promise<void> => {
  await i18n.changeLanguage(locale);
};

export const usePreferencesStore = create<PreferencesStore>((set, get) => ({
  ...defaultAppPreferences,
  hydrated: false,

  hydrate: async () => {
    const prefs = await appPreferencesRepository.get();
    await applyToI18n(prefs.locale);
    set({ ...prefs, hydrated: true });
  },

  setTheme: async (theme) => {
    const prefs = await appPreferencesRepository.update({ theme });
    set({ theme: prefs.theme });
  },

  setLocale: async (locale) => {
    const prefs = await appPreferencesRepository.update({ locale });
    await applyToI18n(prefs.locale);
    set({ locale: prefs.locale });
  },

  setUnitSystem: async (unitSystem) => {
    const prefs = await appPreferencesRepository.update({ unitSystem });
    set({ unitSystem: prefs.unitSystem });
  },

  applyImported: async (preferences) => {
    const prefs = await appPreferencesRepository.update(preferences);
    await applyToI18n(prefs.locale);
    set({ ...prefs });
  },
}));

export const hydrateAppPreferences = (): Promise<void> =>
  usePreferencesStore.getState().hydrate();
