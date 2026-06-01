import { type BottomSheetBackgroundProps } from '@gorhom/bottom-sheet';
import { BlurView } from 'expo-blur';
import { type FC } from 'react';
import { useTheme } from 'styled-components/native';

import type { AppTheme } from '@/styles/theme';

export const BottomSheetBlurBackground: FC<BottomSheetBackgroundProps> = ({ style }) => {
  const theme = useTheme();

  return (
    <BlurView
      intensity={theme.blur.intensity}
      tint={theme.blur.tint}
      blurMethod={theme.blur.androidMethod}
      style={[
        style,
        {
          borderTopWidth: 1,
          borderTopColor: theme.colors.glass.border,
          overflow: 'hidden',
        },
      ]}
    />
  );
};

export const getBottomSheetBlurProps = (theme: AppTheme) => ({
  backgroundComponent: BottomSheetBlurBackground,
  backgroundStyle: { backgroundColor: 'transparent' as const },
  handleIndicatorStyle: { backgroundColor: theme.colors.glass.highlight },
});
