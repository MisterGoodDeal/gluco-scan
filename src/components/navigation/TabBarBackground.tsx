import { BlurView } from 'expo-blur';
import { type FC } from 'react';
import { StyleSheet } from 'react-native';

import { useBlurSettings } from '@/hooks/useBlurSettings';

export const TabBarBackground: FC = () => {
  const blur = useBlurSettings();

  return (
    <BlurView
      intensity={blur.intensity}
      tint={blur.tint}
      blurMethod={blur.androidMethod}
      style={StyleSheet.absoluteFill}
    />
  );
};
