import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Modal, Pressable } from 'react-native';
import styled, { useTheme } from 'styled-components/native';

import { Text } from '@/components/atoms/Text';
import { useTutorialStore } from '@/store/tutorial.store';
import { actionButtonStyles } from '@/styles/button';
import { TutorialStatus } from '@/types/tutorial';

const Backdrop = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.55);
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const Card = styled.View`
  width: 100%;
  max-width: 360px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  background-color: ${({ theme }) => theme.colors.sheet.background};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.glass.border};
  padding: ${({ theme }) => theme.spacing.lg}px;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const Actions = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const ActionButton = styled(Pressable)<{ $primary?: boolean }>`
  ${actionButtonStyles}
`;

export const TutorialWelcomeModal: FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const visible = useTutorialStore((s) => s.welcomeVisible);
  const status = useTutorialStore((s) => s.status);
  const startTutorial = useTutorialStore((s) => s.startTutorial);
  const dismissWelcome = useTutorialStore((s) => s.dismissWelcome);

  const isStarting = status === TutorialStatus.STARTING;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Backdrop>
        <Card>
          <Text $variant="title">{t('tutorial.welcome.title')}</Text>
          <Text $variant="body" $color="textSecondary">
            {t('tutorial.welcome.message')}
          </Text>
          <Actions>
            <ActionButton onPress={dismissWelcome} disabled={isStarting}>
              <Text $variant="caption">{t('tutorial.welcome.skip')}</Text>
            </ActionButton>
            <ActionButton
              $primary
              onPress={() => void startTutorial()}
              disabled={isStarting}>
              {isStarting ? (
                <ActivityIndicator color={theme.colors.onAccent} size="small" />
              ) : (
                <Text $variant="caption" style={{ color: theme.colors.onAccent }}>
                  {t('tutorial.welcome.start')}
                </Text>
              )}
            </ActionButton>
          </Actions>
        </Card>
      </Backdrop>
    </Modal>
  );
};
