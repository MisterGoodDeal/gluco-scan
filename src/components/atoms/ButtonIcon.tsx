import { type FC, type ReactNode } from 'react';
import { type AccessibilityState } from 'react-native';

import { AppButton, type AppButtonProps } from '@/components/ui/AppButton';

type ButtonIconProps = {
  onPress: () => void;
  children: ReactNode;
  accessibilityLabel: string;
  accessibilityState?: AccessibilityState;
  variant?: AppButtonProps['variant'];
};

export const ButtonIcon: FC<ButtonIconProps> = ({
  onPress,
  children,
  accessibilityLabel,
  accessibilityState,
  variant = 'tertiary',
}) => (
  <AppButton
    isIconOnly
    variant={variant}
    onPress={onPress}
    accessibilityLabel={accessibilityLabel}
    accessibilityState={accessibilityState}>
    {children}
  </AppButton>
);
