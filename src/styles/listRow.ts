import { css } from 'styled-components/native';

export const listRowDivider = css<{ $isLast?: boolean }>`
  border-bottom-width: ${({ $isLast }) => ($isLast ? 0 : 1)}px;
  border-bottom-color: ${({ theme, $isLast }) =>
    $isLast ? 'transparent' : theme.colors.glass.border};
`;
