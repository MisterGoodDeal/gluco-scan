import { type FC, useCallback, useContext, useEffect, useState } from 'react';
import { Text, type TextProps } from 'react-native';
import {
  cancelAnimation,
  Easing,
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { ScrollRevealActiveContext } from '@/components/animations/ScrollReveal';
import { formatDecimal } from '@/utils/format';

type CountUpTextProps = TextProps & {
  value: number;
  decimals?: number;
  duration?: number;
  active?: boolean;
  formatValue?: (value: number) => string;
};

export const CountUpText: FC<CountUpTextProps> = ({
  value,
  decimals = 1,
  duration = 900,
  active,
  formatValue,
  className,
  ...rest
}) => {
  const revealActive = useContext(ScrollRevealActiveContext);
  const shouldAnimate = active ?? revealActive;
  const progress = useSharedValue(shouldAnimate ? 0 : 1);
  const format = useCallback(
    (animatedValue: number) =>
      formatValue ? formatValue(animatedValue) : formatDecimal(animatedValue, decimals),
    [decimals, formatValue],
  );
  const [display, setDisplay] = useState(() => format(shouldAnimate ? 0 : value));

  const updateDisplay = useCallback(
    (progressValue: number) => {
      setDisplay(format(value * progressValue));
    },
    [format, value],
  );

  useEffect(() => {
    cancelAnimation(progress);
    if (!shouldAnimate) {
      progress.value = 1;
      setDisplay(format(value));
      return;
    }
    progress.value = 0;
    setDisplay(format(0));
    progress.value = withTiming(1, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
  }, [duration, format, progress, shouldAnimate, value]);

  useAnimatedReaction(
    () => progress.value,
    (progressValue) => {
      runOnJS(updateDisplay)(progressValue);
    },
  );

  return (
    <Text className={className} {...rest}>
      {display}
    </Text>
  );
};
