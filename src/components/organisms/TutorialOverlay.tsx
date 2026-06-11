import { type FC, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Modal, Platform, View, type LayoutRectangle } from 'react-native';

import { TutorialStepCard } from '@/components/molecules/TutorialStepCard';
import { useTutorialCardBottomInset } from '@/hooks/useTutorialCardBottomInset';
import { useTutorialCardTopInset } from '@/hooks/useTutorialCardTopInset';
import { TUTORIAL_STEPS } from '@/config/tutorialSteps';
import { useTutorialStore } from '@/store/tutorial.store';
import { TutorialStatus } from '@/types/tutorial';
import { measureTutorialAnchorsWithRetry } from '@/utils/tutorialAnchors';
import { navigateToTutorialStep } from '@/utils/tutorialNavigation';

const DIM_COLOR = 'rgba(0,0,0,0.45)';

const SpotlightHole = ({
  rect,
  dimOnly = false,
}: {
  rect: LayoutRectangle | null;
  dimOnly?: boolean;
}) => {
  if (!rect || dimOnly) {
    return <View style={{ flex: 1, backgroundColor: DIM_COLOR }} />;
  }

  const { x, y, width, height } = rect;
  const pad = 6;

  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: Math.max(0, y - pad), backgroundColor: DIM_COLOR }} />
      <View style={{ flexDirection: 'row', height: height + pad * 2 }}>
        <View style={{ width: Math.max(0, x - pad), backgroundColor: DIM_COLOR }} />
        <View style={{ width: width + pad * 2, height: height + pad * 2 }} />
        <View style={{ flex: 1, backgroundColor: DIM_COLOR }} />
      </View>
      <View style={{ flex: 1, backgroundColor: DIM_COLOR }} />
    </View>
  );
};

export const TutorialOverlay: FC = () => {
  const { t } = useTranslation();
  const cardBottom = useTutorialCardBottomInset(true);
  const cardTop = useTutorialCardTopInset();
  const status = useTutorialStore((s) => s.status);
  const currentStep = useTutorialStore((s) => s.currentStep);
  const nextStep = useTutorialStore((s) => s.nextStep);
  const previousStep = useTutorialStore((s) => s.previousStep);
  const completeTutorial = useTutorialStore((s) => s.completeTutorial);
  const cancelTutorial = useTutorialStore((s) => s.cancelTutorial);
  const setMealCreateValidated = useTutorialStore((s) => s.setMealCreateValidated);

  const step = TUTORIAL_STEPS[currentStep];
  const [spotlight, setSpotlight] = useState<LayoutRectangle | null>(null);

  const isMealCreateStep = step?.id === 'meal-create';
  const isProductFormStep = step?.id === 'product-form';

  useEffect(() => {
    if (status !== TutorialStatus.RUNNING || !step) return;

    navigateToTutorialStep(currentStep);

    if (step.id === 'meal-create') {
      setMealCreateValidated(false);
      return;
    }

    if (step.id === 'product-form') {
      return;
    }

    setSpotlight(null);
    let cancelled = false;

    void measureTutorialAnchorsWithRetry(step.anchorIds).then((rect) => {
      if (!cancelled) setSpotlight(rect);
    });

    return () => {
      cancelled = true;
    };
  }, [status, currentStep, step, setMealCreateValidated]);

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

  if (status !== TutorialStatus.RUNNING || !step || isMealCreateStep) {
    return null;
  }

  const cardStyle = {
    position: 'absolute' as const,
    left: 16,
    right: 16,
    ...(step.cardPlacement === 'top' ? { top: cardTop } : { bottom: cardBottom }),
  };

  const stepCard = (
    <TutorialStepCard
      stepIndex={currentStep}
      onQuit={handleQuit}
      onPrevious={previousStep}
      onNext={handleNext}
      style={cardStyle}
    />
  );

  const modalProps = {
    visible: true as const,
    transparent: true as const,
    animationType: 'fade' as const,
    statusBarTranslucent: true,
    presentationStyle:
      Platform.OS === 'ios' ? ('overFullScreen' as const) : undefined,
  };

  if (isProductFormStep) {
    return (
      <Modal {...modalProps}>
        <View style={{ flex: 1 }} pointerEvents="box-none">
          {stepCard}
        </View>
      </Modal>
    );
  }

  return (
    <Modal {...modalProps}>
      <View style={{ flex: 1 }}>
        <SpotlightHole rect={spotlight} dimOnly={step.anchorIds.length === 0} />
        {stepCard}
      </View>
    </Modal>
  );
};
