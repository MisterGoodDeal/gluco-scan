import { BlurView } from 'expo-blur';
import { useThemeColor } from 'heroui-native';
import { type FC, type ReactNode, type RefObject } from 'react';
import { View } from 'react-native';

import { useBlurSettings } from '@/hooks/useBlurSettings';
import { topScreenSpace } from '@/utils/screen';

type BlurScreenHeaderProps = {
  blurTarget?: RefObject<View | null>;
  children: ReactNode;
  onLayoutHeight?: (height: number) => void;
};

export const estimateBlurHeaderHeight = (extraRows = 0): number => {
  const rowHeight = 44;
  return topScreenSpace + 8 + rowHeight * (1 + extraRows);
};

export const BlurScreenHeader: FC<BlurScreenHeaderProps> = ({
  blurTarget,
  children,
  onLayoutHeight,
}) => {
  const blur = useBlurSettings();
  const borderColor = useThemeColor('border');

  return (
    <View
      className="absolute top-0 left-0 right-0 z-10"
      onLayout={(event) => {
        onLayoutHeight?.(event.nativeEvent.layout.height);
      }}>
      <BlurView
        blurTarget={blurTarget}
        intensity={blur.intensity}
        tint={blur.tint}
        blurMethod={blur.androidMethod}
        style={{
          borderBottomWidth: 1,
          borderBottomColor: borderColor,
          overflow: 'hidden',
        }}>
        <View className="px-4 pb-2" style={{ paddingTop: topScreenSpace }}>
          {children}
        </View>
      </BlurView>
    </View>
  );
};
