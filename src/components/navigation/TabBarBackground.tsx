import { BlurView } from 'expo-blur';
import { type FC } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from 'styled-components/native';

export const TabBarBackground: FC = () => {
  const theme = useTheme();

  return (
    <BlurView
      intensity={theme.blur.intensity}
      tint={theme.blur.tint}
      blurMethod={theme.blur.androidMethod}
      style={StyleSheet.absoluteFill}
    />
  );
};
