import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useTutorialCardTopInset = (): number => {
  const insets = useSafeAreaInsets();
  return insets.top + 16;
};
