import { useFonts } from 'expo-font';
import { type FC, type ReactNode } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { FA_FONT_FAMILY } from '@/constants/fontAwesome';

type FontProviderProps = {
  children: ReactNode;
};

export const FontProvider: FC<FontProviderProps> = ({ children }) => {
  const [loaded, error] = useFonts({
    [FA_FONT_FAMILY]: require('../../../assets/fonts/fa-solid-900.ttf'),
  });

  if (error) throw error;
  if (!loaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return children;
};
