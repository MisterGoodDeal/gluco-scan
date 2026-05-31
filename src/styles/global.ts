import styled from 'styled-components/native';

export const Screen = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Row = styled.View`
  flex-direction: row;
  align-items: center;
`;
