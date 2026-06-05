import { css } from 'styled-components/native';

import { INPUT_HEIGHT } from '@/styles/input';

const buttonBorderStyles = css`
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.glass.border};
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const actionButtonStyles = css<{ $primary?: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.lg}px;
  ${buttonBorderStyles}
  background-color: ${({ theme, $primary }) =>
    $primary ? theme.colors.accent : theme.colors.glass.background};
`;

export const primaryButtonStyles = css`
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.lg}px;
  ${buttonBorderStyles}
  background-color: ${({ theme }) => theme.colors.accent};
`;

export const mutedButtonStyles = css`
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
  ${buttonBorderStyles}
  background-color: ${({ theme }) => theme.colors.accentMuted};
`;

const inlineButtonBaseStyles = css`
  height: ${INPUT_HEIGHT}px;
  padding: 0 ${({ theme }) => theme.spacing.md}px;
  ${buttonBorderStyles}
`;

export const inlineActionButtonStyles = css<{ $primary?: boolean }>`
  ${inlineButtonBaseStyles}
  background-color: ${({ theme, $primary }) =>
    $primary ? theme.colors.accent : theme.colors.glass.background};
`;

export const inlinePrimaryButtonStyles = css`
  ${inlineButtonBaseStyles}
  background-color: ${({ theme }) => theme.colors.accent};
`;

export const inlineMutedButtonStyles = css`
  ${inlineButtonBaseStyles}
  background-color: ${({ theme }) => theme.colors.accentMuted};
`;
