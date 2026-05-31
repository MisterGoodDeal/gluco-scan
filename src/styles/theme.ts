export const theme = {
  colors: {
    background: '#0B0F1A',
    backgroundGradient: ['#0B0F1A', '#141B2D'] as const,
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
    tint: 'dark' as const,
    androidMethod: 'dimezisBlurViewSdk31Plus' as const,
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radius: { sm: 12, md: 20, lg: 28, full: 9999 },
  typography: {
    title: { fontSize: 28, fontWeight: '700' as const },
    subtitle: { fontSize: 17, fontWeight: '600' as const },
    body: { fontSize: 15, fontWeight: '500' as const },
    caption: { fontSize: 13, fontWeight: '500' as const },
    mono: { fontSize: 14, fontWeight: '600' as const, fontFamily: 'monospace' },
  },
  shadows: {
    glass: {
      shadowColor: '#000',
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 8,
    },
  },
} as const;

export type AppTheme = typeof theme;
