import { Chip } from 'heroui-native';
import { forwardRef, useCallback, type ReactNode } from 'react';
import type { GestureResponderEvent, StyleProp, TextStyle, View } from 'react-native';

import { triggerImpactLight } from '@/utils/haptics';

type ChipProps = React.ComponentProps<typeof Chip>;

export type AppChipProps = Omit<ChipProps, 'children'> & {
  label: string;
  startContent?: ReactNode;
  endContent?: ReactNode;
  labelClassName?: string;
  labelStyle?: StyleProp<TextStyle>;
  haptic?: boolean;
};

/**
 * Chip HeroUI avec contenus de début/fin (icônes) et haptique au press.
 */
export const AppChip = forwardRef<View, AppChipProps>(function AppChip(
  {
    label,
    startContent,
    endContent,
    labelClassName,
    labelStyle,
    haptic = true,
    onPress,
    disabled,
    ...rest
  },
  ref,
) {
  const handlePress = useCallback(
    (event: GestureResponderEvent) => {
      if (haptic && !disabled) triggerImpactLight();
      onPress?.(event);
    },
    [onPress, haptic, disabled],
  );

  return (
    <Chip
      ref={ref}
      disabled={disabled}
      onPress={onPress ? handlePress : undefined}
      {...rest}>
      {startContent}
      <Chip.Label className={labelClassName} style={labelStyle}>
        {label}
      </Chip.Label>
      {endContent}
    </Chip>
  );
});
