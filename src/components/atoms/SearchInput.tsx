import { useThemeColor } from 'heroui-native';
import { type FC } from 'react';
import { TextInput, type KeyboardTypeOptions } from 'react-native';
import { useTranslation } from 'react-i18next';

type SearchInputVariant = 'default' | 'plain';

type SearchInputProps = {
  value: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  editable?: boolean;
  mono?: boolean;
  flex?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoFocus?: boolean;
  variant?: SearchInputVariant;
};

export const SearchInput: FC<SearchInputProps> = ({
  value,
  onChangeText,
  placeholder,
  editable = true,
  mono = false,
  flex = false,
  keyboardType,
  autoFocus = false,
  variant = 'default',
}) => {
  const { t } = useTranslation();
  const placeholderColor = useThemeColor('field-placeholder');

  const baseClasses =
    variant === 'plain'
      ? 'h-10 p-0 bg-transparent text-foreground'
      : 'h-10 px-4 rounded-field border border-field-border bg-field text-field-foreground';

  return (
    <TextInput
      className={[
        baseClasses,
        mono ? 'font-mono text-sm font-semibold' : 'text-base',
        flex ? 'flex-1' : '',
        editable ? '' : 'opacity-85',
      ]
        .filter(Boolean)
        .join(' ')}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder ?? t('common.searchPlaceholder')}
      placeholderTextColor={placeholderColor}
      autoCapitalize="none"
      autoCorrect={false}
      clearButtonMode="while-editing"
      editable={editable}
      keyboardType={keyboardType}
      autoFocus={autoFocus}
    />
  );
};
