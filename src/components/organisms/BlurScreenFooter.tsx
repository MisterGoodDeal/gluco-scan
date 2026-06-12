import { BlurView } from 'expo-blur';
import { useThemeColor } from 'heroui-native';
import { type FC, type ReactNode, type RefObject } from 'react';
import { View } from 'react-native';

import { useBlurSettings } from '@/hooks/useBlurSettings';

type BlurScreenFooterProps = {
  blurTarget?: RefObject<View | null>;
  children: ReactNode;
  intensity?: number;
  onLayoutHeight?: (height: number) => void;
};

export const BlurScreenFooter: FC<BlurScreenFooterProps> = ({
  blurTarget,
  children,
  intensity,
  onLayoutHeight,
}) => {
  const blur = useBlurSettings();
  const borderColor = useThemeColor('border');

  return (
    <View
      className="absolute bottom-0 left-0 right-0 z-10"
      onLayout={(event) => {
        onLayoutHeight?.(event.nativeEvent.layout.height);
      }}>
      <BlurView
        blurTarget={blurTarget}
        intensity={intensity ?? blur.intensity}
        tint={blur.tint}
        blurMethod={blur.androidMethod}
        style={{
          borderTopWidth: 1,
          borderTopColor: borderColor,
          overflow: 'hidden',
        }}>
        {children}
      </BlurView>
    </View>
  );
};
