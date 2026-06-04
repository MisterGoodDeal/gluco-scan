import { forwardRef, useCallback } from 'react';
import {
  TouchableOpacity,
  type GestureResponderEvent,
  type TouchableOpacityProps,
  type View,
} from 'react-native';

import { triggerImpactLight } from '@/utils/haptics';

export type HapticTouchableOpacityProps = TouchableOpacityProps & {
  haptic?: boolean;
};

export const HapticTouchableOpacity = forwardRef<View, HapticTouchableOpacityProps>(
  function HapticTouchableOpacity(
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
      <TouchableOpacity
        ref={ref}
        disabled={disabled}
        onPress={onPress ? handlePress : undefined}
        onLongPress={onLongPress ? handleLongPress : undefined}
        {...rest}
      />
    );
  },
);
