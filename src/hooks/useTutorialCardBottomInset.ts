import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'styled-components/native';

import { useTabBarBottomInset } from '@/hooks/useTabBarBottomInset';
import { useTabBarLayoutStore } from '@/store/tabBarLayout.store';

export const useTutorialCardBottomInset = (includeTabBar = true): number => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const measuredTabBarHeight = useTabBarLayoutStore((s) => s.height);
  const tabBarInset = useTabBarBottomInset();

  if (includeTabBar) {
    const tabBarClearance = measuredTabBarHeight ?? tabBarInset;
    return tabBarClearance + theme.spacing.lg;
  }

  return insets.bottom + theme.spacing.md;
};
