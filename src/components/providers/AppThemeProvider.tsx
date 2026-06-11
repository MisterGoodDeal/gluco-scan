import { StatusBar } from 'expo-status-bar';
import { type FC, type ReactNode, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { Uniwind } from 'uniwind';

import { usePreferencesStore } from '@/store/preferences.store';

type AppThemeProviderProps = {
  children: ReactNode;
};

export const AppThemeProvider: FC<AppThemeProviderProps> = ({ children }) => {
  const preference = usePreferencesStore((s) => s.theme);
  const systemScheme = useColorScheme();

  useEffect(() => {
    Uniwind.setTheme(preference);
  }, [preference]);

  const mode = preference === 'system' ? (systemScheme === 'light' ? 'light' : 'dark') : preference;

  return (
    <>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      {children}
    </>
  );
};
