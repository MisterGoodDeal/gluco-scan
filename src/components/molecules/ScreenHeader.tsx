import { type FC, type ReactNode } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled, { useTheme } from 'styled-components/native';

import { Text } from '@/components/atoms/Text';

type ScreenHeaderProps = {
  title: string;
  onBack?: () => void;
  rightAction?: ReactNode;
};

const Header = styled.View<{ $paddingTop: number }>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-top: ${({ $paddingTop }) => $paddingTop}px;
  padding-right: ${({ theme }) => theme.spacing.md}px;
  padding-bottom: ${({ theme }) => theme.spacing.sm}px;
  padding-left: ${({ theme }) => theme.spacing.md}px;
`;

const Side = styled.View`
  min-width: 72px;
`;

const BackButton = styled.Pressable`
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
`;

const RightSide = styled.View`
  min-width: 72px;
  align-items: flex-end;
`;

export const ScreenHeader: FC<ScreenHeaderProps> = ({ title, onBack, rightAction }) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const paddingTop = insets.top + theme.spacing.sm;

  return (
    <Header $paddingTop={paddingTop}>
      <Side>
        {onBack && (
          <BackButton onPress={onBack} accessibilityLabel="Retour">
            <Text $variant="body" $color="accent">
              ← Retour
            </Text>
          </BackButton>
        )}
      </Side>
      <Text $variant="subtitle">{title}</Text>
      <RightSide>{rightAction}</RightSide>
    </Header>
  );
};
