import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'styled-components/native';

const TAB_BAR_CONTENT_HEIGHT = 49;

export const useTabBarBottomInset = (): number => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  return TAB_BAR_CONTENT_HEIGHT + insets.bottom + theme.spacing.md;
};
