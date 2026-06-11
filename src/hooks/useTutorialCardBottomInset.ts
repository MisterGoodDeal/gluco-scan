import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTabBarBottomInset } from '@/hooks/useTabBarBottomInset';
import { useTabBarLayoutStore } from '@/store/tabBarLayout.store';

export const useTutorialCardBottomInset = (includeTabBar = true): number => {
  const insets = useSafeAreaInsets();
  const measuredTabBarHeight = useTabBarLayoutStore((s) => s.height);
  const tabBarInset = useTabBarBottomInset();

  if (includeTabBar) {
    const tabBarClearance = measuredTabBarHeight ?? tabBarInset;
    return tabBarClearance + 24;
  }

  return insets.bottom + 16;
};
