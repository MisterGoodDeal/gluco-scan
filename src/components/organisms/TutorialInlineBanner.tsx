import { type FC, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TutorialCollapsibleShell } from '@/components/molecules/TutorialCollapsibleShell';
import { TutorialStepCard } from '@/components/molecules/TutorialStepCard';
import { useTutorialCardBottomInset } from '@/hooks/useTutorialCardBottomInset';
import { useTutorialCardTopInset } from '@/hooks/useTutorialCardTopInset';
import { TUTORIAL_STEPS } from '@/config/tutorialSteps';
import { useTutorialStore } from '@/store/tutorial.store';
import { TutorialStatus } from '@/types/tutorial';
import type { TutorialStepId } from '@/types/tutorial';

type TutorialInlineBannerProps = {
  stepId: TutorialStepId;
  includeTabBarInset?: boolean;
  extraBottom?: number;
  stacked?: boolean;
  compactTop?: boolean;
  sheetBottom?: boolean;
  anchored?: boolean;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  cardBottom?: number;
  fabBottom?: number;
};

export const TutorialInlineBanner: FC<TutorialInlineBannerProps> = ({
  stepId,
  includeTabBarInset = false,
  extraBottom = 0,
  stacked = false,
  compactTop = false,
  sheetBottom = false,
  anchored = false,
  collapsed: collapsedProp,
  onCollapsedChange,
  cardBottom,
  fabBottom,
}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const cardBottomInset = useTutorialCardBottomInset(includeTabBarInset) + extraBottom;
  const cardTop = useTutorialCardTopInset();
  const bottomMargin = sheetBottom ? insets.bottom + 12 : stacked ? 8 : cardBottomInset;
  const status = useTutorialStore((s) => s.status);
  const currentStep = useTutorialStore((s) => s.currentStep);
  const nextStep = useTutorialStore((s) => s.nextStep);
  const previousStep = useTutorialStore((s) => s.previousStep);
  const completeTutorial = useTutorialStore((s) => s.completeTutorial);
  const cancelTutorial = useTutorialStore((s) => s.cancelTutorial);
  const [localCollapsed, setLocalCollapsed] = useState(false);

  const stepIndex = TUTORIAL_STEPS.findIndex((s) => s.id === stepId);
  const isControlled = collapsedProp !== undefined && onCollapsedChange !== undefined;
  const collapsed = isControlled ? collapsedProp : localCollapsed;
  const setCollapsed = isControlled ? onCollapsedChange : setLocalCollapsed;

  useEffect(() => {
    setLocalCollapsed(false);
  }, [currentStep, stepId]);

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

  const stepConfig = TUTORIAL_STEPS[stepIndex];
  const isCollapsible = Boolean(stepConfig?.cardCollapsible);
  const resolvedFabBottom = fabBottom ?? insets.bottom + 16;

  const cardStyle =
    anchored && cardBottom !== undefined
      ? { marginHorizontal: 16 }
      : anchored
        ? { marginHorizontal: 16 }
        : stepConfig?.cardPlacement === 'top'
          ? { marginHorizontal: 16, marginTop: compactTop ? 12 : cardTop }
          : {
              marginHorizontal: 16,
              marginBottom: bottomMargin,
              marginTop: stacked ? 8 : 0,
            };

  const cardContainerStyle =
    anchored && cardBottom !== undefined
      ? {
          position: 'absolute' as const,
          left: 0,
          right: 0,
          bottom: cardBottom,
          paddingBottom: 12,
        }
      : sheetBottom
        ? {
            position: 'absolute' as const,
            left: 0,
            right: 0,
            bottom: 0,
          }
        : undefined;

  return (
    <TutorialCollapsibleShell
      collapsible={isCollapsible}
      collapsed={collapsed}
      onCollapsedChange={setCollapsed}
      fabBottom={resolvedFabBottom}
      fullScreen={Boolean(cardContainerStyle)}
      cardContainerStyle={cardContainerStyle}>
      <TutorialStepCard
        stepIndex={currentStep}
        onQuit={handleQuit}
        onPrevious={previousStep}
        onNext={handleNext}
        collapsible={isCollapsible}
        onMinimize={() => setCollapsed(true)}
        style={cardStyle}
      />
    </TutorialCollapsibleShell>
  );
};

export const getTutorialInlineStepIndex = (stepId: TutorialStepId): number =>
  TUTORIAL_STEPS.findIndex((s) => s.id === stepId);

export const isTutorialInlineStep = (stepId: TutorialStepId): boolean =>
  stepId === 'meal-create' || stepId === 'product-form';
