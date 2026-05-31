import { type FC } from 'react';
import styled from 'styled-components/native';

type InputNumberProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

const StyledInput = styled.TextInput`
  min-width: 72px;
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.glass.border};
  background-color: ${({ theme }) => theme.colors.glass.background};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.mono.fontSize}px;
  font-weight: ${({ theme }) => theme.typography.mono.fontWeight};
  text-align: center;
`;

export const InputNumber: FC<InputNumberProps> = ({
  value,
  onChangeText,
  placeholder = '100',
}) => (
  <StyledInput
    value={value}
    onChangeText={onChangeText}
    placeholder={placeholder}
    placeholderTextColor="#9AA3B5"
    keyboardType="decimal-pad"
    returnKeyType="done"
  />
);
