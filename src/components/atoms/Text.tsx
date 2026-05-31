import styled, { css } from 'styled-components/native';

type TextVariant = 'title' | 'subtitle' | 'body' | 'caption' | 'mono';

type StyledTextProps = {
  $variant?: TextVariant;
  $color?: 'text' | 'textSecondary' | 'accent' | 'error' | 'success';
};

const variantStyles = {
  title: css`
    font-size: ${({ theme }) => theme.typography.title.fontSize}px;
    font-weight: ${({ theme }) => theme.typography.title.fontWeight};
  `,
  subtitle: css`
    font-size: ${({ theme }) => theme.typography.subtitle.fontSize}px;
    font-weight: ${({ theme }) => theme.typography.subtitle.fontWeight};
  `,
  body: css`
    font-size: ${({ theme }) => theme.typography.body.fontSize}px;
    font-weight: ${({ theme }) => theme.typography.body.fontWeight};
  `,
  caption: css`
    font-size: ${({ theme }) => theme.typography.caption.fontSize}px;
    font-weight: ${({ theme }) => theme.typography.caption.fontWeight};
  `,
  mono: css`
    font-size: ${({ theme }) => theme.typography.mono.fontSize}px;
    font-weight: ${({ theme }) => theme.typography.mono.fontWeight};
    font-family: ${({ theme }) => theme.typography.mono.fontFamily};
  `,
};

export const Text = styled.Text<StyledTextProps>`
  color: ${({ theme, $color = 'text' }) => theme.colors[$color]};
  ${({ $variant = 'body' }) => variantStyles[$variant]}
`;
