import { createMMKV } from 'react-native-mmkv';
import { create } from 'zustand';

import type { ThemePreference } from '@/styles/theme';

const storage = createMMKV({ id: 'glucoscan-settings' });
const THEME_PREFERENCE_KEY = 'theme_preference';

const readPreference = (): ThemePreference => {
  const value = storage.getString(THEME_PREFERENCE_KEY);
  if (value === 'light' || value === 'dark' || value === 'system') {
    return value;
  }
  return 'system';
};

type ThemeStore = {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
};

export const useThemeStore = create<ThemeStore>((set) => ({
  preference: readPreference(),
  setPreference: (preference) => {
    storage.set(THEME_PREFERENCE_KEY, preference);
    set({ preference });
  },
}));
