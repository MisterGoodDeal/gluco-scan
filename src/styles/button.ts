import { css } from 'styled-components/native';

import { INPUT_HEIGHT } from '@/styles/input';

const buttonBaseStyles = css`
  height: ${INPUT_HEIGHT}px;
  padding: 0 ${({ theme }) => theme.spacing.lg}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.glass.border};
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const actionButtonStyles = css<{ $primary?: boolean }>`
  ${buttonBaseStyles}
  background-color: ${({ theme, $primary }) =>
    $primary ? theme.colors.accent : theme.colors.glass.background};
`;

export const primaryButtonStyles = css`
  ${buttonBaseStyles}
  background-color: ${({ theme }) => theme.colors.accent};
`;

export const mutedButtonStyles = css`
  ${buttonBaseStyles}
  padding: 0 ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.accentMuted};
`;
