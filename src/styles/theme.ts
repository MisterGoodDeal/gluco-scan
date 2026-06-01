export type ThemeMode = 'light' | 'dark';
export type ThemePreference = 'system' | ThemeMode;

export interface AppTheme {
  mode: ThemeMode;
  colors: {
    background: string;
    backgroundGradient: readonly [string, string, string];
    text: string;
    textSecondary: string;
    accent: string;
    accentMuted: string;
    success: string;
    error: string;
    glass: {
      background: string;
      border: string;
      highlight: string;
    };
  };
  blur: {
    intensity: number;
    tint: 'dark' | 'light' | 'default';
    androidMethod: 'dimezisBlurViewSdk31Plus' | 'dimezisBlurView' | 'none';
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  radius: {
    sm: number;
    md: number;
    lg: number;
    full: number;
  };
  typography: {
    title: { fontSize: number; fontWeight: '700' };
    subtitle: { fontSize: number; fontWeight: '600' };
    body: { fontSize: number; fontWeight: '500' };
    caption: { fontSize: number; fontWeight: '500' };
    mono: { fontSize: number; fontWeight: '600'; fontFamily: string };
  };
  shadows: {
    glass: {
      shadowColor: string;
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
  };
}

const shared = {
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radius: { sm: 12, md: 20, lg: 28, full: 9999 },
  typography: {
    title: { fontSize: 28, fontWeight: '700' as const },
    subtitle: { fontSize: 17, fontWeight: '600' as const },
    body: { fontSize: 15, fontWeight: '500' as const },
    caption: { fontSize: 13, fontWeight: '500' as const },
    mono: { fontSize: 14, fontWeight: '600' as const, fontFamily: 'monospace' },
  },
};

export const darkTheme: AppTheme = {
  mode: 'dark',
  colors: {
    background: '#05070F',
    backgroundGradient: ['#05070F', '#1A3A6B', '#2D1B69'],
    text: '#F4F6FB',
    textSecondary: '#9AA3B5',
    accent: '#5B8CFF',
    accentMuted: 'rgba(91, 140, 255, 0.15)',
    success: '#34D399',
    error: '#F87171',
    glass: {
      background: 'rgba(255, 255, 255, 0.08)',
      border: 'rgba(255, 255, 255, 0.18)',
      highlight: 'rgba(255, 255, 255, 0.35)',
    },
  },
  blur: {
    intensity: 60,
    tint: 'dark',
    androidMethod: 'dimezisBlurViewSdk31Plus',
  },
  shadows: {
    glass: {
      shadowColor: '#000',
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 8,
    },
  },
  ...shared,
};

export const lightTheme: AppTheme = {
  mode: 'light',
  colors: {
    background: '#F3F5FA',
    backgroundGradient: ['#EEF2FF', '#E0E7FF', '#F5F3FF'],
    text: '#0F172A',
    textSecondary: '#64748B',
    accent: '#3B6FE8',
    accentMuted: 'rgba(59, 111, 232, 0.12)',
    success: '#059669',
    error: '#DC2626',
    glass: {
      background: 'rgba(255, 255, 255, 0.72)',
      border: 'rgba(15, 23, 42, 0.1)',
      highlight: 'rgba(255, 255, 255, 0.95)',
    },
  },
  blur: {
    intensity: 40,
    tint: 'light',
    androidMethod: 'dimezisBlurViewSdk31Plus',
  },
  shadows: {
    glass: {
      shadowColor: '#64748B',
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 4,
    },
  },
  ...shared,
};

export const resolveTheme = (
  preference: ThemePreference,
  systemScheme: ThemeMode | null | undefined,
): AppTheme => {
  const mode: ThemeMode =
    preference === 'system' ? (systemScheme ?? 'dark') : preference;
  return mode === 'light' ? lightTheme : darkTheme;
};

/** @deprecated Use resolveTheme / darkTheme */
export const theme = darkTheme;
