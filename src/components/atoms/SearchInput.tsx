import { type FC } from 'react';
import { type KeyboardTypeOptions } from 'react-native';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

import { inputFieldStyles, inputPlainStyles } from '@/styles/input';

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

const Input = styled.TextInput<{ $mono?: boolean; $flex?: boolean; $plain?: boolean }>`
  ${({ $plain }) => ($plain ? inputPlainStyles : inputFieldStyles)}
  ${({ $flex }) => ($flex ? 'flex: 1;' : '')}
  font-size: ${({ theme, $mono }) =>
    $mono ? theme.typography.mono.fontSize : theme.typography.body.fontSize}px;
  font-family: ${({ theme, $mono }) => ($mono ? theme.typography.mono.fontFamily : 'System')};
  opacity: ${({ editable }) => (editable === false ? 0.85 : 1)};
`;

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

  return (
    <Input
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder ?? t('common.searchPlaceholder')}
      placeholderTextColor="#9AA3B5"
      autoCapitalize="none"
      autoCorrect={false}
      clearButtonMode="while-editing"
      editable={editable}
      keyboardType={keyboardType}
      autoFocus={autoFocus}
      $mono={mono}
      $flex={flex}
      $plain={variant === 'plain'}
    />
  );
};
