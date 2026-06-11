import { BlurView, type BlurViewProps } from 'expo-blur';
import { useThemeColor } from 'heroui-native';
import { type FC, type ReactNode, type RefObject } from 'react';
import { type View, type ViewProps } from 'react-native';

import { useBlurSettings } from '@/hooks/useBlurSettings';

type GlassPanelProps = {
  children: ReactNode;
  intensity?: number;
  tint?: BlurViewProps['tint'];
  padding?: number;
  borderRadius?: number;
  blurTarget?: RefObject<View | null>;
  style?: ViewProps['style'];
};

export const GlassPanel: FC<GlassPanelProps> = ({
  children,
  intensity,
  tint,
  padding,
  borderRadius,
  blurTarget,
  style,
}) => {
  const blur = useBlurSettings();
  const borderColor = useThemeColor('border');

  const containerStyle = {
    overflow: 'hidden' as const,
    borderRadius: borderRadius ?? 20,
    borderWidth: 1,
    borderColor,
    padding: padding ?? 16,
  };

  return (
    <BlurView
      blurTarget={blurTarget}
      intensity={intensity ?? blur.intensity}
      tint={tint ?? blur.tint}
      blurMethod={blur.androidMethod}
      style={[containerStyle, style]}>
      {children}
    </BlurView>
  );
};
