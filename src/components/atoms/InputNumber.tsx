import { Input } from 'heroui-native';
import { type FC } from 'react';

type InputNumberProps = {
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  placeholder?: string;
};

export const InputNumber: FC<InputNumberProps> = ({
  value,
  onChangeText,
  onBlur,
  placeholder = '100',
}) => (
  <Input
    className="min-w-[72px] text-center font-mono text-sm font-semibold"
    placeholderColorClassName="accent-field-placeholder"
    value={value}
    onChangeText={onChangeText}
    onBlur={onBlur}
    placeholder={placeholder}
    keyboardType="decimal-pad"
    returnKeyType="done"
  />
);
