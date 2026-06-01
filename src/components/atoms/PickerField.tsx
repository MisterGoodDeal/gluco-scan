import { type FC, type ReactNode } from 'react';
import { Pressable } from 'react-native';
import styled from 'styled-components/native';

import { Text } from '@/components/atoms/Text';
import { INPUT_HEIGHT, inputFieldStyles } from '@/styles/input';

type PickerFieldProps = {
  value: string;
  onPress: () => void;
  accessibilityLabel?: string;
  rightAdornment?: ReactNode;
};

const FieldButton = styled(Pressable)`
  ${inputFieldStyles}
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const PickerField: FC<PickerFieldProps> = ({
  value,
  onPress,
  accessibilityLabel,
  rightAdornment,
}) => (
  <FieldButton
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel ?? value}
    style={{ minHeight: INPUT_HEIGHT }}>
    <Text $variant="body" numberOfLines={1} style={{ flex: 1 }}>
      {value}
    </Text>
    {rightAdornment ?? (
      <Text $variant="caption" $color="textSecondary">
        ›
      </Text>
    )}
  </FieldButton>
);
