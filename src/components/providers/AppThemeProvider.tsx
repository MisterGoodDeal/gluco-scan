import { StatusBar } from 'expo-status-bar';
import { type FC, type ReactNode, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeProvider } from 'styled-components/native';

import { resolveTheme } from '@/styles/theme';
import { usePreferencesStore } from '@/store/preferences.store';

type AppThemeProviderProps = {
  children: ReactNode;
};

export const AppThemeProvider: FC<AppThemeProviderProps> = ({ children }) => {
  const preference = usePreferencesStore((s) => s.theme);
  const systemScheme = useColorScheme();

  const theme = useMemo(
    () => resolveTheme(preference, systemScheme === 'light' ? 'light' : 'dark'),
    [preference, systemScheme],
  );

  return (
    <ThemeProvider theme={theme}>
      <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />
      {children}
    </ThemeProvider>
  );
};
