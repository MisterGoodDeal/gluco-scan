import { type FC } from 'react';
import styled, { useTheme } from 'styled-components/native';

import { inputFieldStyles } from '@/styles/input';

type InputNumberProps = {
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  placeholder?: string;
};

const StyledInput = styled.TextInput`
  ${inputFieldStyles}
  min-width: 72px;
  font-size: ${({ theme }) => theme.typography.mono.fontSize}px;
  font-weight: ${({ theme }) => theme.typography.mono.fontWeight};
  font-family: ${({ theme }) => theme.typography.mono.fontFamily};
  text-align: center;
`;

export const InputNumber: FC<InputNumberProps> = ({
  value,
  onChangeText,
  onBlur,
  placeholder = '100',
}) => {
  const theme = useTheme();
  return (
  <StyledInput
    value={value}
    onChangeText={onChangeText}
    onBlur={onBlur}
    placeholder={placeholder}
    placeholderTextColor={theme.colors.textSecondary}
    keyboardType="decimal-pad"
    returnKeyType="done"
  />
  );
};
