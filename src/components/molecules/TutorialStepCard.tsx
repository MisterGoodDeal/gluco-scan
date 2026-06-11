import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View, type ViewStyle } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { TUTORIAL_STEPS } from '@/config/tutorialSteps';
import { useTutorialStore } from '@/store/tutorial.store';

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
  const mealCreateValidated = useTutorialStore((s) => s.mealCreateValidated);

  const step = TUTORIAL_STEPS[stepIndex];
  if (!step) return null;

  const isLast = stepIndex >= TUTORIAL_STEPS.length - 1;
  const canGoNext =
    !step.requiresAction || step.id !== 'meal-create' || mealCreateValidated;

  return (
    <View
      className="rounded-3xl bg-overlay border border-border p-4 gap-2"
      style={style}>
      <Text className="text-foreground text-lg font-semibold">{t(step.titleKey)}</Text>
      <Text className="text-muted text-base">{t(step.messageKey)}</Text>
      {step.requiresAction && step.id === 'meal-create' && !mealCreateValidated ? (
        <Text className="text-accent text-sm">{t('tutorial.steps.mealCreate.hint')}</Text>
      ) : null}
      <View className="flex-row justify-between items-center mt-1">
        <AppButton size="sm" variant="tertiary" onPress={onQuit}>
          {t('tutorial.quit.button')}
        </AppButton>
        <View className="flex-row items-center gap-2">
          {stepIndex > 0 ? (
            <AppButton size="sm" variant="tertiary" onPress={onPrevious}>
              {t('common.previous')}
            </AppButton>
          ) : null}
          <AppButton size="sm" variant="primary" onPress={onNext} isDisabled={!canGoNext}>
            {isLast ? t('tutorial.finish') : t('common.next')}
          </AppButton>
        </View>
      </View>
    </View>
  );
};
