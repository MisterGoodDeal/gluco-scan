import { type FC, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

import { TutorialStepCard } from '@/components/molecules/TutorialStepCard';
import { useTutorialCardBottomInset } from '@/hooks/useTutorialCardBottomInset';
import { TUTORIAL_STEPS } from '@/config/tutorialSteps';
import { useTutorialStore } from '@/store/tutorial.store';
import { TutorialStatus } from '@/types/tutorial';
import type { TutorialStepId } from '@/types/tutorial';

type TutorialInlineBannerProps = {
  stepId: TutorialStepId;
  includeTabBarInset?: boolean;
  extraBottom?: number;
  /** Au-dessus des contrôles de l'écran (ex. barre Suivant), sans chevauchement. */
  stacked?: boolean;
};

export const TutorialInlineBanner: FC<TutorialInlineBannerProps> = ({
  stepId,
  includeTabBarInset = false,
  extraBottom = 0,
  stacked = false,
}) => {
  const { t } = useTranslation();
  const cardBottom = useTutorialCardBottomInset(includeTabBarInset) + extraBottom;
  const status = useTutorialStore((s) => s.status);
  const currentStep = useTutorialStore((s) => s.currentStep);
  const nextStep = useTutorialStore((s) => s.nextStep);
  const previousStep = useTutorialStore((s) => s.previousStep);
  const completeTutorial = useTutorialStore((s) => s.completeTutorial);
  const cancelTutorial = useTutorialStore((s) => s.cancelTutorial);

  const stepIndex = TUTORIAL_STEPS.findIndex((s) => s.id === stepId);

  const handleQuit = useCallback(() => {
    Alert.alert(t('tutorial.quit.title'), t('tutorial.quit.message'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('tutorial.quit.confirm'),
        style: 'destructive',
        onPress: () => void cancelTutorial(),
      },
    ]);
  }, [t, cancelTutorial]);

  const handleNext = useCallback(() => {
    if (currentStep >= TUTORIAL_STEPS.length - 1) {
      void completeTutorial();
      return;
    }
    nextStep();
  }, [currentStep, completeTutorial, nextStep]);

  if (
    status !== TutorialStatus.RUNNING ||
    stepIndex < 0 ||
    currentStep !== stepIndex
  ) {
    return null;
  }

  return (
    <TutorialStepCard
      stepIndex={currentStep}
      onQuit={handleQuit}
      onPrevious={previousStep}
      onNext={handleNext}
      style={{
        marginHorizontal: 16,
        marginBottom: stacked ? 8 : cardBottom,
        marginTop: stacked ? 8 : 0,
      }}
    />
  );
};

export const getTutorialInlineStepIndex = (stepId: TutorialStepId): number =>
  TUTORIAL_STEPS.findIndex((s) => s.id === stepId);

export const isTutorialInlineStep = (stepId: TutorialStepId): boolean =>
  stepId === 'meal-create';
