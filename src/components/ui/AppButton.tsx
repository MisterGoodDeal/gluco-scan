import { Button } from 'heroui-native';
import { forwardRef, useCallback } from 'react';
import type { GestureResponderEvent, View } from 'react-native';

import { triggerImpactLight } from '@/utils/haptics';

type ButtonProps = React.ComponentProps<typeof Button>;

export type AppButtonProps = Omit<ButtonProps, 'onPress'> & {
  haptic?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
};

/**
 * Bouton HeroUI avec feedback haptique léger au press.
 */
export const AppButton = forwardRef<View, AppButtonProps>(function AppButton(
  { onPress, haptic = true, isDisabled, ...rest },
  ref,
) {
  const handlePress = useCallback(
    (event: GestureResponderEvent) => {
      if (haptic && !isDisabled) triggerImpactLight();
      onPress?.(event);
    },
    [onPress, haptic, isDisabled],
  );

  return (
    <Button
      ref={ref}
      isDisabled={isDisabled}
      onPress={onPress ? handlePress : undefined}
      {...(rest as ButtonProps)}
    />
  );
});

export const AppButtonLabel = Button.Label;
