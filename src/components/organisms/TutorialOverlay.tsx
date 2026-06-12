import { type FC, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  StyleSheet,
  useWindowDimensions,
  View,
  type LayoutRectangle,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TutorialCollapsibleShell } from '@/components/molecules/TutorialCollapsibleShell';
import { TutorialStepCard } from '@/components/molecules/TutorialStepCard';
import { TutorialSpotlightDim } from '@/components/molecules/TutorialSpotlightDim';
import { TutorialAnchor } from '@/components/atoms/TutorialAnchor';
import { TUTORIAL_STEP_CARD_ANCHOR_ID } from '@/constants/tutorial';
import { useTutorialCardBottomInset } from '@/hooks/useTutorialCardBottomInset';
import { useTutorialCardTopInset } from '@/hooks/useTutorialCardTopInset';
import { TUTORIAL_STEPS } from '@/config/tutorialSteps';
import { useTutorialStore } from '@/store/tutorial.store';
import { TutorialStatus } from '@/types/tutorial';
import {
  measureTutorialAnchorsWithRetry,
  measureTutorialSpotlightTargets,
} from '@/utils/tutorialAnchors';
import { navigateToTutorialStep } from '@/utils/tutorialNavigation';
import { buildMealDetailSheetSpotlightHole } from '@/utils/mealDetailSheetSpotlight';
import { buildMealsDateSheetSpotlightHole } from '@/utils/mealsDatePickerSpotlight';
import type { TutorialSpotlightHole } from '@/utils/tutorialSpotlightPath';

const TUTORIAL_CARD_RESERVE = 220;

const dimStyle: ViewStyle = { backgroundColor: 'rgba(0,0,0,0.65)' };

const SpotlightHole = ({
  rect,
  dimOnly = false,
  bottomReserve = 0,
  topReserve = 0,
}: {
  rect: LayoutRectangle | null;
  dimOnly?: boolean;
  bottomReserve?: number;
  topReserve?: number;
}) => {
  const bottomClearance = (
    <View style={{ height: bottomReserve }} pointerEvents="none" />
  );

  if (!rect || dimOnly) {
    return (
      <View style={styles.spotlightRoot} pointerEvents="box-none">
        {topReserve > 0 ? (
          <View style={{ height: topReserve }} pointerEvents="none" />
        ) : null}
        <View style={[styles.flexFill, dimStyle]} pointerEvents="auto" />
        {bottomReserve > 0 ? bottomClearance : null}
      </View>
    );
  }

  const { x, y, width, height } = rect;
  const pad = 6;

  return (
    <View style={styles.spotlightRoot} pointerEvents="box-none">
      {topReserve > 0 ? (
        <View style={{ height: topReserve }} pointerEvents="none" />
      ) : null}
      <View style={[styles.topDim, { height: Math.max(0, y - pad) }, dimStyle]} pointerEvents="auto" />
      <View style={{ flexDirection: 'row', height: height + pad * 2 }} pointerEvents="box-none">
        <View
          style={[{ width: Math.max(0, x - pad), height: height + pad * 2 }, dimStyle]}
          pointerEvents="auto"
        />
        <View
          style={{ width: width + pad * 2, height: height + pad * 2 }}
          pointerEvents="none"
        />
        <View style={[styles.flexFill, dimStyle]} pointerEvents="auto" />
      </View>
      <View style={styles.flexFill} pointerEvents="box-none">
        <View style={[styles.flexFill, dimStyle]} pointerEvents="auto" />
        {bottomReserve > 0 ? bottomClearance : null}
      </View>
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
  const overlayMeasureTick = useTutorialStore((s) => s.overlayMeasureTick);
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const step = TUTORIAL_STEPS[currentStep];
  const [spotlight, setSpotlight] = useState<LayoutRectangle | null>(null);
  const [roundedHoles, setRoundedHoles] = useState<TutorialSpotlightHole[]>([]);
  const [layoutTick, setLayoutTick] = useState(0);
  const [cardCollapsed, setCardCollapsed] = useState(false);

  const isMealCreateStep = step?.id === 'meal-create';
  const isProductFormStep = step?.id === 'product-form';
  const cardAtBottom = step?.cardPlacement !== 'top';
  const spotlightTargets = step?.spotlightTargets;
  const usesRoundedSpotlight = (spotlightTargets?.length ?? 0) > 0;
  const needsCardAnchor =
    spotlightTargets?.some((target) => target.anchorId === TUTORIAL_STEP_CARD_ANCHOR_ID) ??
    false;
  const showSpotlight =
    step?.showSpotlight !== false &&
    (usesRoundedSpotlight || (step?.anchorIds.length ?? 0) > 0);

  const bumpLayout = useCallback(() => {
    setLayoutTick((tick) => tick + 1);
  }, []);

  const handleCardCollapsedChange = useCallback((collapsed: boolean) => {
    setCardCollapsed(collapsed);
  }, []);

  useEffect(() => {
    setCardCollapsed(false);
  }, [currentStep]);

  useEffect(() => {
    if (status !== TutorialStatus.RUNNING || !step) return;

    navigateToTutorialStep(currentStep);

    if (step.id === 'meal-create') {
      setMealCreateValidated(false);
    }
  }, [status, currentStep, step, setMealCreateValidated]);

  useEffect(() => {
    if (status !== TutorialStatus.RUNNING || !step) return;

    if (step.id === 'meal-create' || step.id === 'product-form' || !showSpotlight) {
      return;
    }

    if (usesRoundedSpotlight && spotlightTargets) {
      setRoundedHoles([]);
      let cancelled = false;
      const initialDelayMs =
        step.id === 'products-add' || step.id === 'meals-add'
          ? 500
          : step.id === 'meals-calendar' || step.id === 'meals-detail'
            ? 650
            : step.id === 'meals-day-nav' ||
                step.id === 'meals-today' ||
                step.id === 'meals-saved'
              ? 450
              : 200;

      const measureAttempts =
        step.id === 'meals-calendar' || step.id === 'meals-detail' ? 14 : 10;

      const withSheetHoles = (holes: TutorialSpotlightHole[]) => {
        if (step.id === 'meals-calendar') {
          return [buildMealsDateSheetSpotlightHole(screenWidth, screenHeight), ...holes];
        }
        if (step.id === 'meals-detail') {
          return [buildMealDetailSheetSpotlightHole(screenWidth, screenHeight), ...holes];
        }
        return holes;
      };

      void measureTutorialSpotlightTargets(
        spotlightTargets,
        measureAttempts,
        initialDelayMs,
        (holes) => {
          if (!cancelled) setRoundedHoles(withSheetHoles(holes));
        },
      ).then((holes) => {
        if (!cancelled) setRoundedHoles(withSheetHoles(holes));
      });

      return () => {
        cancelled = true;
      };
    }

    setSpotlight(null);
    let cancelled = false;

    void measureTutorialAnchorsWithRetry(step.anchorIds, 4).then((rect) => {
      if (!cancelled) setSpotlight(rect);
    });

    return () => {
      cancelled = true;
    };
  }, [
    status,
    currentStep,
    step,
    showSpotlight,
    usesRoundedSpotlight,
    spotlightTargets,
    layoutTick,
    overlayMeasureTick,
    screenWidth,
    screenHeight,
  ]);

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

  if (status !== TutorialStatus.RUNNING || !step || isMealCreateStep || isProductFormStep) {
    return null;
  }

  const cardPositionStyle: ViewStyle = cardAtBottom
    ? { bottom: cardBottom }
    : { top: cardTop };

  const bottomReserve = cardAtBottom ? cardBottom + TUTORIAL_CARD_RESERVE : 0;
  const topReserve = cardAtBottom ? 0 : cardTop + TUTORIAL_CARD_RESERVE;

  const stepCard = (
    <TutorialStepCard
      stepIndex={currentStep}
      onQuit={handleQuit}
      onPrevious={previousStep}
      onNext={handleNext}
      collapsible={step.cardCollapsible}
      onMinimize={() => handleCardCollapsedChange(true)}
    />
  );

  const cardLayer = (
    <TutorialCollapsibleShell
      collapsible={Boolean(step.cardCollapsible)}
      collapsed={cardCollapsed}
      onCollapsedChange={handleCardCollapsedChange}
      fabBottom={cardBottom}
      fullScreen
      cardContainerStyle={[styles.cardLayer, cardPositionStyle]}>
      {needsCardAnchor ? (
        <TutorialAnchor
          id={TUTORIAL_STEP_CARD_ANCHOR_ID}
          onAnchorLayout={bumpLayout}>
          {stepCard}
        </TutorialAnchor>
      ) : (
        stepCard
      )}
    </TutorialCollapsibleShell>
  );

  if (!showSpotlight) {
    return (
      <View style={styles.overlayRoot} pointerEvents="box-none">
        {cardLayer}
      </View>
    );
  }

  if (usesRoundedSpotlight) {
    return (
      <View style={styles.overlayRoot} pointerEvents="box-none">
        <View style={[StyleSheet.absoluteFill, styles.dimLayer]} pointerEvents="box-none">
          <TutorialSpotlightDim holes={roundedHoles} fadeKey={currentStep} />
        </View>
        {cardLayer}
      </View>
    );
  }

  return (
    <View style={styles.overlayRoot} pointerEvents="box-none">
      <View style={[StyleSheet.absoluteFill, styles.dimLayer]} pointerEvents="box-none">
        <SpotlightHole
          rect={spotlight}
          dimOnly={step.anchorIds.length === 0}
          bottomReserve={bottomReserve}
          topReserve={topReserve}
        />
      </View>
      {cardLayer}
    </View>
  );
};

const styles = StyleSheet.create({
  overlayRoot: {
    flex: 1,
  },
  dimLayer: {
    zIndex: 1,
  },
  cardLayer: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 2,
    elevation: 2,
  },
  spotlightRoot: {
    flex: 1,
  },
  flexFill: {
    flex: 1,
  },
  topDim: {
    width: '100%',
  },
});
