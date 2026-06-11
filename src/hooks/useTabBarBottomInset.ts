import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TAB_BAR_CONTENT_HEIGHT, TAB_BAR_LIST_CLEARANCE } from '@/constants/tabBar';

export const useTabBarBottomInset = (): number => {
  const insets = useSafeAreaInsets();
  return TAB_BAR_CONTENT_HEIGHT + insets.bottom + TAB_BAR_LIST_CLEARANCE;
};
