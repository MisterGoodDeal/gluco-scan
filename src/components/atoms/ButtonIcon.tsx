import { type FC, type ReactNode } from 'react';
import { type AccessibilityState } from 'react-native';

import { AppPressable } from '@/components/ui/AppPressable';

type ButtonIconProps = {
  onPress: () => void;
  children: ReactNode;
  accessibilityLabel: string;
  accessibilityState?: AccessibilityState;
};

export const ButtonIcon: FC<ButtonIconProps> = ({
  onPress,
  children,
  accessibilityLabel,
  accessibilityState,
}) => (
  <AppPressable
    className="w-10 h-10 rounded-xl items-center justify-center bg-surface border border-border"
    onPress={onPress}
    accessibilityLabel={accessibilityLabel}
    accessibilityState={accessibilityState}
    accessibilityRole="button"
    hitSlop={8}>
    {children}
  </AppPressable>
);
