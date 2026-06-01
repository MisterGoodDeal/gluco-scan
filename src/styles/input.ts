import { css } from 'styled-components/native';

export const INPUT_HEIGHT = 40;

export const inputFieldStyles = css`
  height: ${INPUT_HEIGHT}px;
  padding: 0 ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.glass.border};
  background-color: ${({ theme }) => theme.colors.glass.background};
  color: ${({ theme }) => theme.colors.text};
`;
