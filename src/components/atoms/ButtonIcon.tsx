import { type FC, type ReactNode } from 'react';
import { type AccessibilityState } from 'react-native';
import styled from 'styled-components/native';

import { HapticPressable } from '@/components/atoms/HapticPressable';

type ButtonIconProps = {
  onPress: () => void;
  children: ReactNode;
  accessibilityLabel: string;
  accessibilityState?: AccessibilityState;
};

const Pressable = styled(HapticPressable)`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.glass.background};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.glass.border};
`;

export const ButtonIcon: FC<ButtonIconProps> = ({
  onPress,
  children,
  accessibilityLabel,
  accessibilityState,
}) => (
  <Pressable
    onPress={onPress}
    accessibilityLabel={accessibilityLabel}
    accessibilityState={accessibilityState}
    accessibilityRole="button"
    hitSlop={8}>
    {children}
  </Pressable>
);
