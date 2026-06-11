import { useUniwind } from 'uniwind';

import type { ThemeMode } from '@/types/theme';

type BlurSettings = {
  mode: ThemeMode;
  intensity: number;
  tint: 'dark' | 'light';
  androidMethod: 'dimezisBlurViewSdk31Plus';
};

export const useBlurSettings = (): BlurSettings => {
  const { theme } = useUniwind();
  const isDark = theme !== 'light';
  return {
    mode: isDark ? 'dark' : 'light',
    intensity: isDark ? 60 : 40,
    tint: isDark ? 'dark' : 'light',
    androidMethod: 'dimezisBlurViewSdk31Plus',
  };
};
