import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { Input } from 'heroui-native';
import { type FC } from 'react';
import { type StyleProp, type TextStyle } from 'react-native';

import { FIELD_NO_BORDER_CLASSNAME } from '@/components/ui/fieldClassName';

type InputNumberProps = {
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  /** `center` for compact fields; `start` for full-width bordered fields. */
  align?: 'center' | 'start';
  /** Use inside `@gorhom/bottom-sheet` so the sheet handles keyboard focus. */
  bottomSheet?: boolean;
};

export const InputNumber: FC<InputNumberProps> = ({
  value,
  onChangeText,
  onBlur,
  placeholder = '100',
  align = 'center',
  bottomSheet = false,
}) => {
  const isStart = align === 'start';
  const style: StyleProp<TextStyle> = {
    textAlign: isStart ? 'left' : 'center',
    ...(isStart ? { paddingHorizontal: 0 } : null),
  };
  const className = isStart
    ? `w-full font-mono text-sm font-semibold px-0 bg-transparent text-foreground ${FIELD_NO_BORDER_CLASSNAME}`
    : `min-w-[72px] font-mono text-sm font-semibold bg-transparent text-foreground ${FIELD_NO_BORDER_CLASSNAME}`;

  const sharedProps = {
    className,
    style,
    value,
    onChangeText,
    onBlur,
    placeholder,
    keyboardType: 'decimal-pad' as const,
    returnKeyType: 'done' as const,
  };

  if (bottomSheet) {
    return (
      <BottomSheetTextInput
        placeholderTextColorClassName="accent-field-placeholder"
        {...sharedProps}
      />
    );
  }

  return (
    <Input
      placeholderColorClassName="accent-field-placeholder"
      {...sharedProps}
    />
  );
};
