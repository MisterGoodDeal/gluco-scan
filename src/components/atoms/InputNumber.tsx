import { useThemeColor } from 'heroui-native';
import { type FC } from 'react';
import { TextInput } from 'react-native';

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
}) => {
  const placeholderColor = useThemeColor('field-placeholder');

  return (
    <TextInput
      className="h-10 min-w-[72px] px-4 rounded-field border border-field-border bg-field text-field-foreground text-center font-mono text-sm font-semibold"
      value={value}
      onChangeText={onChangeText}
      onBlur={onBlur}
      placeholder={placeholder}
      placeholderTextColor={placeholderColor}
      keyboardType="decimal-pad"
      returnKeyType="done"
    />
  );
};
