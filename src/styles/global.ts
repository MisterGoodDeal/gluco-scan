import styled from 'styled-components/native';

export const Screen = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Row = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const BackgroundLayer = styled.View`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: ${({ theme }) => theme.colors.backgroundGradient[0]};
`;

export const BackgroundLayerBottom = styled.View`
  position: absolute;
  top: 50%;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: ${({ theme }) => theme.colors.backgroundGradient[1]};
`;
