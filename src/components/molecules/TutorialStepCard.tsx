import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { FaIcon } from '@/components/atoms/FaIcon';
import { ButtonIcon } from '@/components/atoms/ButtonIcon';
import { AppButton } from '@/components/ui/AppButton';
import { TUTORIAL_STEPS } from '@/config/tutorialSteps';
import { useTutorialStore } from '@/store/tutorial.store';

type TutorialStepCardProps = {
  stepIndex: number;
  onQuit: () => void;
  onPrevious: () => void;
  onNext: () => void;
  style?: ViewStyle;
  collapsible?: boolean;
  onMinimize?: () => void;
};

export const TutorialStepCard: FC<TutorialStepCardProps> = ({
  stepIndex,
  onQuit,
  onPrevious,
  onNext,
  style,
  collapsible = false,
  onMinimize,
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
      style={[styles.card, style]}>
      <View className="flex-row items-start justify-between gap-2">
        <Text className="text-foreground text-lg font-semibold flex-1">{t(step.titleKey)}</Text>
        {collapsible ? (
          <ButtonIcon
            onPress={() => onMinimize?.()}
            accessibilityLabel={t('tutorial.collapse.minimizeA11y')}
            size="sm">
            <FaIcon name="chevron-down" size={14} />
          </ButtonIcon>
        ) : null}
      </View>
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

const styles = StyleSheet.create({
  card: {
    overflow: 'visible',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.28,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
      default: {},
    }),
  },
});
