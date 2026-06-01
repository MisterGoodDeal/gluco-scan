import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'styled-components/native';

export const useTutorialCardTopInset = (): number => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  return insets.top + theme.spacing.md;
};
