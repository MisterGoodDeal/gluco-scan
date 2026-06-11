import { type FC, type ReactNode } from 'react';
import { Text } from 'react-native';

import { AppPressable } from '@/components/ui/AppPressable';

type PickerFieldProps = {
  value: string;
  onPress: () => void;
  accessibilityLabel?: string;
  rightAdornment?: ReactNode;
};

export const PickerField: FC<PickerFieldProps> = ({
  value,
  onPress,
  accessibilityLabel,
  rightAdornment,
}) => (
  <AppPressable
    className="min-h-10 flex-row items-center justify-between rounded-field border border-field-border bg-field px-3 py-2"
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel ?? value}>
    <Text className="flex-1 text-field-foreground text-base" numberOfLines={1}>
      {value}
    </Text>
    {rightAdornment ?? <Text className="text-muted text-sm">›</Text>}
  </AppPressable>
);
