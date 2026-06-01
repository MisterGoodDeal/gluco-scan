import { BlurView } from 'expo-blur';
import { type FC, type ReactNode, type RefObject } from 'react';
import { type View } from 'react-native';
import styled, { useTheme } from 'styled-components/native';

import { topScreenSpace } from '@/utils/screen';

type BlurScreenHeaderProps = {
  blurTarget?: RefObject<View | null>;
  children: ReactNode;
  onLayoutHeight?: (height: number) => void;
};

const Wrapper = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
`;

const Content = styled.View`
  padding-top: ${topScreenSpace}px;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

export const estimateBlurHeaderHeight = (extraRows = 0): number => {
  const rowHeight = 44;
  return topScreenSpace + 8 + rowHeight * (1 + extraRows);
};

export const BlurScreenHeader: FC<BlurScreenHeaderProps> = ({
  blurTarget,
  children,
  onLayoutHeight,
}) => {
  const theme = useTheme();

  return (
    <Wrapper
      onLayout={(event) => {
        onLayoutHeight?.(event.nativeEvent.layout.height);
      }}>
      <BlurView
        blurTarget={blurTarget}
        intensity={theme.blur.intensity}
        tint={theme.blur.tint}
        blurMethod={theme.blur.androidMethod}
        style={{
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.glass.border,
          overflow: 'hidden',
        }}>
        <Content>{children}</Content>
      </BlurView>
    </Wrapper>
  );
};
