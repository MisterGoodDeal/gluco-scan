import { type FC, type ReactNode } from 'react';
import styled from 'styled-components/native';

type ButtonIconProps = {
  onPress: () => void;
  children: ReactNode;
  accessibilityLabel: string;
};

const Pressable = styled.Pressable`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.glass.background};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.glass.border};
`;

export const ButtonIcon: FC<ButtonIconProps> = ({
  onPress,
  children,
  accessibilityLabel,
}) => (
  <Pressable
    onPress={onPress}
    accessibilityLabel={accessibilityLabel}
    accessibilityRole="button"
    hitSlop={8}>
    {children}
  </Pressable>
);
