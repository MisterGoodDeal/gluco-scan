import { use, useEffect } from 'react';

import { BottomTabBarHeightContext } from 'expo-router/build/react-navigation/bottom-tabs';

import { useTabBarLayoutStore } from '@/store/tabBarLayout.store';

export const TabBarHeightReporter = () => {
  const height = use(BottomTabBarHeightContext);
  const setHeight = useTabBarLayoutStore((s) => s.setHeight);

  useEffect(() => {
    if (height != null && height > 0) {
      setHeight(height);
    }
  }, [height, setHeight]);

  return null;
};
