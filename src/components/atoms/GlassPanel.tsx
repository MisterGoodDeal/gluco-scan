import { BlurView, type BlurViewProps } from 'expo-blur';
import { type FC, type ReactNode, type RefObject } from 'react';
import { View, type ViewProps } from 'react-native';
import { useTheme } from 'styled-components/native';

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
  const theme = useTheme();
  const resolvedIntensity = intensity ?? theme.blur.intensity;
  const resolvedTint = tint ?? theme.blur.tint;
  const resolvedPadding = padding ?? theme.spacing.md;
  const resolvedRadius = borderRadius ?? theme.radius.md;

  const containerStyle = {
    overflow: 'hidden' as const,
    borderRadius: resolvedRadius,
    borderWidth: 1,
    borderColor: theme.colors.glass.border,
    padding: resolvedPadding,
    ...theme.shadows.glass,
  };

  return (
    <BlurView
      blurTarget={blurTarget}
      intensity={resolvedIntensity}
      tint={resolvedTint}
      blurMethod={theme.blur.androidMethod}
      style={[containerStyle, style]}>
      {children}
    </BlurView>
  );
};
