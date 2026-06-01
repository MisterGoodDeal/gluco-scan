import { type FC, type ReactNode } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import styled, { useTheme } from 'styled-components/native';

import { Text } from '@/components/atoms/Text';
import { useDatabase } from '@/hooks/useDatabase';

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background};
`;

type DatabaseGateProps = {
  children: ReactNode;
};

export const DatabaseGate: FC<DatabaseGateProps> = ({ children }) => {
  const { ready, error } = useDatabase();
  const { t } = useTranslation();
  const theme = useTheme();

  if (error) {
    return (
      <Container>
        <Text $variant="body" $color="error">
          {error.message}
        </Text>
      </Container>
    );
  }

  if (!ready) {
    return (
      <Container>
        <ActivityIndicator color={theme.colors.accent} size="large" />
        <Text $variant="caption" $color="textSecondary" style={{ marginTop: 16 }}>
          {t('common.loading')}
        </Text>
      </Container>
    );
  }

  return <View style={{ flex: 1 }}>{children}</View>;
};
