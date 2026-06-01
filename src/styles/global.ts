import styled from 'styled-components/native';

import { topScreenSpace } from '@/utils/screen';

export const Screen = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const ScreenHeaderBar = styled.View`
  padding-top: ${topScreenSpace}px;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

export const Row = styled.View`
  flex-direction: row;
  align-items: center;
`;
