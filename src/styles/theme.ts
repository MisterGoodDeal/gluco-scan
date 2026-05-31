export interface AppTheme {
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

export const theme: AppTheme = {
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
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radius: { sm: 12, md: 20, lg: 28, full: 9999 },
  typography: {
    title: { fontSize: 28, fontWeight: '700' },
    subtitle: { fontSize: 17, fontWeight: '600' },
    body: { fontSize: 15, fontWeight: '500' },
    caption: { fontSize: 13, fontWeight: '500' },
    mono: { fontSize: 14, fontWeight: '600', fontFamily: 'monospace' },
  },
  shadows: {
    glass: {
      shadowColor: '#000',
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};
