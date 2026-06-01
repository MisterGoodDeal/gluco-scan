import { StatusBar } from 'expo-status-bar';
import { type FC, type ReactNode, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeProvider } from 'styled-components/native';

import { resolveTheme } from '@/styles/theme';
import { useThemeStore } from '@/store/theme.store';

type AppThemeProviderProps = {
  children: ReactNode;
};

export const AppThemeProvider: FC<AppThemeProviderProps> = ({ children }) => {
  const preference = useThemeStore((s) => s.preference);
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
