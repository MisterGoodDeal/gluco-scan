import { forwardRef, useCallback } from 'react';
import {
  Pressable,
  type GestureResponderEvent,
  type PressableProps,
  type View,
} from 'react-native';

import { triggerImpactLight } from '@/utils/haptics';

export type HapticPressableProps = PressableProps & {
  haptic?: boolean;
};

export const HapticPressable = forwardRef<View, HapticPressableProps>(function HapticPressable(
  { onPress, onLongPress, haptic = true, disabled, ...rest },
  ref,
) {
  const runHaptic = useCallback(() => {
    if (haptic && !disabled) triggerImpactLight();
  }, [haptic, disabled]);

  const handlePress = useCallback(
    (event: GestureResponderEvent) => {
      runHaptic();
      onPress?.(event);
    },
    [onPress, runHaptic],
  );

  const handleLongPress = useCallback(
    (event: GestureResponderEvent) => {
      runHaptic();
      onLongPress?.(event);
    },
    [onLongPress, runHaptic],
  );

  return (
    <Pressable
      ref={ref}
      disabled={disabled}
      onPress={onPress ? handlePress : undefined}
      onLongPress={onLongPress ? handleLongPress : undefined}
      {...rest}
    />
  );
});
