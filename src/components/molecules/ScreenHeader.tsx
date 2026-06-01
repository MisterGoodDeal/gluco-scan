import { type FC, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

import { Text } from '@/components/atoms/Text';
import { ScreenHeaderBar } from '@/styles/global';

type ScreenHeaderProps = {
  title: string;
  onBack?: () => void;
  rightAction?: ReactNode;
};

const Header = styled(ScreenHeaderBar)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
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
  const { t } = useTranslation();

  return (
    <Header>
      <Side>
        {onBack && (
          <BackButton onPress={onBack} accessibilityLabel={t('common.backA11y')}>
            <Text $variant="body" $color="accent">
              {t('common.back')}
            </Text>
          </BackButton>
        )}
      </Side>
      <Text $variant="subtitle">{title}</Text>
      <RightSide>{rightAction}</RightSide>
    </Header>
  );
};
