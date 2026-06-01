import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { type ViewStyle } from 'react-native';
import styled, { useTheme } from 'styled-components/native';

import { Text } from '@/components/atoms/Text';
import { TUTORIAL_STEPS } from '@/config/tutorialSteps';
import { useTutorialStore } from '@/store/tutorial.store';

const Card = styled.View`
  border-radius: ${({ theme }) => theme.radius.md}px;
  background-color: ${({ theme }) => theme.colors.sheet.background};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.glass.border};
  padding: ${({ theme }) => theme.spacing.md}px;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const ActionsRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const ActionsEnd = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const ActionButton = styled.Pressable<{ $primary?: boolean; $disabled?: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme, $primary, $disabled }) => {
    if ($disabled && $primary) return theme.colors.glass.background;
    return $primary ? theme.colors.accent : theme.colors.glass.background;
  }};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.glass.border};
  opacity: ${({ $disabled }) => ($disabled ? 0.55 : 1)};
`;

type TutorialStepCardProps = {
  stepIndex: number;
  onQuit: () => void;
  onPrevious: () => void;
  onNext: () => void;
  style?: ViewStyle;
};

export const TutorialStepCard: FC<TutorialStepCardProps> = ({
  stepIndex,
  onQuit,
  onPrevious,
  onNext,
  style,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const mealCreateValidated = useTutorialStore((s) => s.mealCreateValidated);

  const step = TUTORIAL_STEPS[stepIndex];
  if (!step) return null;

  const isLast = stepIndex >= TUTORIAL_STEPS.length - 1;
  const canGoNext =
    !step.requiresAction || step.id !== 'meal-create' || mealCreateValidated;

  return (
    <Card style={style}>
      <Text $variant="subtitle">{t(step.titleKey)}</Text>
      <Text $variant="body" $color="textSecondary">
        {t(step.messageKey)}
      </Text>
      {step.requiresAction && step.id === 'meal-create' && !mealCreateValidated ? (
        <Text $variant="caption" $color="accent">
          {t('tutorial.steps.mealCreate.hint')}
        </Text>
      ) : null}
      <ActionsRow>
        <ActionButton onPress={onQuit}>
          <Text $variant="caption">{t('tutorial.quit.button')}</Text>
        </ActionButton>
        <ActionsEnd>
          {stepIndex > 0 ? (
            <ActionButton onPress={onPrevious}>
              <Text $variant="caption">{t('common.previous')}</Text>
            </ActionButton>
          ) : null}
          <ActionButton
            $primary
            $disabled={!canGoNext}
            onPress={onNext}
            disabled={!canGoNext}>
            <Text
              $variant="caption"
              $color={canGoNext ? undefined : 'textSecondary'}
              style={canGoNext ? { color: theme.colors.onAccent } : undefined}>
              {isLast ? t('tutorial.finish') : t('common.next')}
            </Text>
          </ActionButton>
        </ActionsEnd>
      </ActionsRow>
    </Card>
  );
};
