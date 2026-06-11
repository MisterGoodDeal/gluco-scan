import { Input } from 'heroui-native';
import { type FC } from 'react';
import { TextInput, type KeyboardTypeOptions } from 'react-native';
import { useTranslation } from 'react-i18next';

import { FIELD_NO_BORDER_CLASSNAME } from '@/components/ui/fieldClassName';

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

  const className = [
    FIELD_NO_BORDER_CLASSNAME,
    flex ? 'flex-1 min-w-0' : 'w-full',
    mono ? 'font-mono text-sm font-semibold' : '',
    editable ? '' : 'opacity-85',
  ]
    .filter(Boolean)
    .join(' ');

  const sharedProps = {
    value,
    onChangeText,
    placeholder: placeholder ?? t('common.searchPlaceholder'),
    autoCapitalize: 'none' as const,
    autoCorrect: false,
    clearButtonMode: 'while-editing' as const,
    editable,
    keyboardType,
    autoFocus,
  };

  if (variant === 'plain') {
    return (
      <TextInput
        className={[className, 'bg-transparent text-foreground'].filter(Boolean).join(' ')}
        placeholderTextColorClassName="accent-field-placeholder"
        {...sharedProps}
      />
    );
  }

  return (
    <Input
      className={className || undefined}
      placeholderColorClassName="accent-field-placeholder"
      {...sharedProps}
    />
  );
};
