import { PressableFeedback } from 'heroui-native';
import { forwardRef, useCallback } from 'react';
import type { GestureResponderEvent, View } from 'react-native';

import { triggerImpactLight } from '@/utils/haptics';

type PressableFeedbackProps = React.ComponentProps<typeof PressableFeedback>;

export type AppPressableProps = Omit<PressableFeedbackProps, 'onPress' | 'onLongPress'> & {
  haptic?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  onLongPress?: (event: GestureResponderEvent) => void;
};

/**
 * PressableFeedback HeroUI (scale + highlight) avec feedback haptique léger.
 * Remplace HapticPressable / HapticTouchableOpacity.
 */
const AppPressableRoot = forwardRef<View, AppPressableProps>(function AppPressable(
  { onPress, onLongPress, haptic = true, isDisabled, ...rest },
  ref,
) {
  const runHaptic = useCallback(() => {
    if (haptic && !isDisabled) triggerImpactLight();
  }, [haptic, isDisabled]);

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
    <PressableFeedback
      ref={ref}
      isDisabled={isDisabled}
      onPress={onPress ? handlePress : undefined}
      onLongPress={onLongPress ? handleLongPress : undefined}
      {...rest}
    />
  );
});

export const AppPressable = Object.assign(AppPressableRoot, {
  Scale: PressableFeedback.Scale,
  Highlight: PressableFeedback.Highlight,
  Ripple: PressableFeedback.Ripple,
});
