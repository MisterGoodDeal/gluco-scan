import { BlurView } from 'expo-blur';
import { type FC, type RefObject } from 'react';
import { View } from 'react-native';
import styled, { useTheme } from 'styled-components/native';

import { Text } from '@/components/atoms/Text';

type FloatingActionButtonProps = {
  onPress: () => void;
  bottom: number;
  blurTarget?: RefObject<View | null>;
  accessibilityLabel: string;
  label?: string;
};

const FabWrapper = styled.View<{ $bottom: number }>`
  position: absolute;
  right: ${({ theme }) => theme.spacing.md}px;
  bottom: ${({ $bottom }) => $bottom}px;
  z-index: 20;
`;

const FabPressable = styled.Pressable`
  width: 56px;
  height: 56px;
  border-radius: 28px;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.glass.border};
  ${({ theme }) => theme.shadows.glass};
`;

export const FloatingActionButton: FC<FloatingActionButtonProps> = ({
  onPress,
  bottom,
  blurTarget,
  accessibilityLabel,
  label = '☰',
}) => {
  const theme = useTheme();

  return (
    <FabWrapper $bottom={bottom} pointerEvents="box-none">
      <FabPressable onPress={onPress} accessibilityLabel={accessibilityLabel} accessibilityRole="button">
        <BlurView
          blurTarget={blurTarget}
          intensity={80}
          tint={theme.blur.tint}
          blurMethod={theme.blur.androidMethod}
          style={{
            width: 56,
            height: 56,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.accentMuted,
          }}>
          <Text $variant="subtitle" $color="accent">
            {label}
          </Text>
        </BlurView>
      </FabPressable>
    </FabWrapper>
  );
};

export const FAB_SIZE = 56;
