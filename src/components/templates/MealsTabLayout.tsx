import { BlurTargetView } from 'expo-blur';
import { router, useFocusEffect } from 'expo-router';
import { useThemeColor } from 'heroui-native';
import { type FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { FaIcon } from '@/components/atoms/FaIcon';
import { TutorialAnchor } from '@/components/atoms/TutorialAnchor';
import { BackgroundGradient } from '@/components/atoms/BackgroundGradient';
import { ButtonIcon } from '@/components/atoms/ButtonIcon';
import { TabBarHeightReporter } from '@/components/navigation/TabBarHeightReporter';
import { BlurScreenHeader } from '@/components/organisms/BlurScreenHeader';
import { MealDatePickerSheet } from '@/components/organisms/MealDatePickerSheet';
import { MealDetailSheet } from '@/components/organisms/MealDetailSheet';
import { MealsDayScrollIndicator } from '@/components/molecules/MealsDayScrollIndicator';
import { MealsDayPager } from '@/components/organisms/MealsDayPager';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useAppToast } from '@/components/ui/useAppToast';
import { useBlurHeaderInset } from '@/hooks/useBlurHeaderInset';
import { useTabBarBottomInset } from '@/hooks/useTabBarBottomInset';
import { useMealStore } from '@/store/meal.store';
import {
  TUTORIAL_MEALS_ADD_ANCHOR_ID,
  TUTORIAL_MEALS_DAY_NAV_ANCHOR_ID,
} from '@/constants/tutorial';
import { TUTORIAL_STEPS } from '@/config/tutorialSteps';
import { useTutorialStore } from '@/store/tutorial.store';
import { TutorialStatus, type TutorialStepId } from '@/types/tutorial';
import { mealRepository } from '@/repositories/meal.repository';
import type { Meal } from '@/types/meal';
import { addDays, toDateKey } from '@/utils/date';

export const MealsTabLayout: FC = () => {
  const { t } = useTranslation();
  const toast = useAppToast();
  const accentColor = useThemeColor('accent');
  const tabBarInset = useTabBarBottomInset();
  const blurTargetRef = useRef<View>(null);
  const PAGER_HALF_WINDOW = 15;
  const { headerHeight, onHeaderLayout } = useBlurHeaderInset(0);
  const todayKey = toDateKey(new Date());
  const selectedDate = useMealStore((s) => s.selectedDate);
  const setSelectedDate = useMealStore((s) => s.setSelectedDate);
  const hydrateDay = useMealStore((s) => s.hydrateDay);

  const [pagerCenter, setPagerCenter] = useState(selectedDate);
  const [mealsByDate, setMealsByDate] = useState<Record<string, Meal[]>>({});
  const [totalsByDate, setTotalsByDate] = useState<Record<string, number>>({});
  const [scrollToDateKey, setScrollToDateKey] = useState<string | null>(null);
  const [detailMeal, setDetailMeal] = useState<Meal | null>(null);
  const [mealIdToDelete, setMealIdToDelete] = useState<string | null>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const isToday = selectedDate === todayKey;
  const tutorialStatus = useTutorialStore((s) => s.status);
  const tutorialCurrentStep = useTutorialStore((s) => s.currentStep);
  const tutorialStepId = TUTORIAL_STEPS[tutorialCurrentStep]?.id ?? 'products';
  const tutorialSavedMealId = useTutorialStore((s) => s.tutorialSavedMealId);
  const handledTutorialStepRef = useRef<TutorialStepId | null>(null);
  const mealsDetailLoadAttemptedRef = useRef(false);
  const mealsDetailRemeasuredRef = useRef(false);
  const bumpOverlayMeasure = useTutorialStore((s) => s.bumpOverlayMeasure);
  const tutorialNextStep = useTutorialStore((s) => s.nextStep);
  const hasAnyMeals = useMemo(
    () => Object.values(mealsByDate).some((meals) => meals.length > 0),
    [mealsByDate],
  );
  const showDayNav =
    hasAnyMeals ||
    (tutorialStatus === TutorialStatus.RUNNING &&
      (tutorialStepId === 'meals-day-nav' || tutorialStepId === 'meals-today'));

  const isInPagerWindow = useCallback(
    (dateKey: string) => {
      const start = addDays(pagerCenter, -PAGER_HALF_WINDOW);
      const end = addDays(pagerCenter, PAGER_HALF_WINDOW);
      return dateKey >= start && dateKey <= end;
    },
    [pagerCenter],
  );

  const loadWindow = useCallback(async (center: string) => {
    const half = 15;
    const mealsMap: Record<string, Meal[]> = {};
    const totalsMap: Record<string, number> = {};
    for (let i = -half; i <= half; i++) {
      const key = addDays(center, i);
      mealsMap[key] = await mealRepository.getByDate(key);
      totalsMap[key] = await mealRepository.getDayTotalCarbs(key);
    }
    setMealsByDate(mealsMap);
    setTotalsByDate(totalsMap);
  }, []);

  const refreshMeals = useCallback(() => {
    void hydrateDay(selectedDate);
    void loadWindow(pagerCenter);
  }, [hydrateDay, loadWindow, pagerCenter, selectedDate]);

  useFocusEffect(
    useCallback(() => {
      refreshMeals();
    }, [refreshMeals]),
  );

  const handleDateChange = useCallback(
    (dateKey: string) => {
      setSelectedDate(dateKey);
    },
    [setSelectedDate],
  );

  const navigateToDate = useCallback(
    async (dateKey: string) => {
      setPagerCenter(dateKey);
      setSelectedDate(dateKey);
      await loadWindow(dateKey);
      setScrollToDateKey(dateKey);
    },
    [loadWindow, setSelectedDate],
  );

  const handleGoToToday = useCallback(() => {
    void navigateToDate(todayKey);
  }, [navigateToDate, todayKey]);

  const shiftDate = useCallback(
    (delta: number) => {
      const nextKey = addDays(selectedDate, delta);
      if (isInPagerWindow(nextKey)) {
        setSelectedDate(nextKey);
        setScrollToDateKey(nextKey);
        return;
      }
      void navigateToDate(nextKey);
    },
    [isInPagerWindow, navigateToDate, selectedDate, setSelectedDate],
  );

  useEffect(() => {
    if (tutorialStatus !== TutorialStatus.RUNNING) {
      handledTutorialStepRef.current = null;
      mealsDetailLoadAttemptedRef.current = false;
      mealsDetailRemeasuredRef.current = false;
      return;
    }

    if (handledTutorialStepRef.current === tutorialStepId) return;
    handledTutorialStepRef.current = tutorialStepId;

    if (tutorialStepId === 'meals-day-nav') {
      void navigateToDate(todayKey);
      setDatePickerOpen(false);
      return;
    }
    if (tutorialStepId === 'meals-today') {
      void navigateToDate(addDays(todayKey, -1)).then(() => {
        bumpOverlayMeasure();
      });
      setDatePickerOpen(false);
      return;
    }
    if (tutorialStepId === 'meals-calendar') {
      setDatePickerOpen(true);
      const remeasure = () => bumpOverlayMeasure();
      requestAnimationFrame(remeasure);
      setTimeout(remeasure, 400);
      setTimeout(remeasure, 700);
      return;
    }
    if (tutorialStepId === 'meals-saved') {
      mealsDetailLoadAttemptedRef.current = false;
      mealsDetailRemeasuredRef.current = false;
      setDatePickerOpen(false);
      setDetailMeal(null);
      void navigateToDate(todayKey).then(() => {
        refreshMeals();
        const remeasure = () => bumpOverlayMeasure();
        requestAnimationFrame(remeasure);
        setTimeout(remeasure, 400);
        setTimeout(remeasure, 700);
      });
      return;
    }
    if (tutorialStepId === 'meals-detail') {
      mealsDetailLoadAttemptedRef.current = false;
      mealsDetailRemeasuredRef.current = false;
      setDatePickerOpen(false);
      void navigateToDate(todayKey).then(() => {
        refreshMeals();
      });
      return;
    }

    mealsDetailLoadAttemptedRef.current = false;
    mealsDetailRemeasuredRef.current = false;
    setDatePickerOpen(false);
    setDetailMeal(null);
  }, [bumpOverlayMeasure, navigateToDate, refreshMeals, todayKey, tutorialStatus, tutorialStepId]);

  useEffect(() => {
    if (tutorialStatus !== TutorialStatus.RUNNING) {
      mealsDetailLoadAttemptedRef.current = false;
      mealsDetailRemeasuredRef.current = false;
      return;
    }
    if (tutorialStepId !== 'meals-detail' || !tutorialSavedMealId) return;

    const meal =
      mealsByDate[selectedDate]?.find((item) => item.id === tutorialSavedMealId) ??
      Object.values(mealsByDate)
        .flat()
        .find((item) => item.id === tutorialSavedMealId);

    if (!meal) {
      if (!mealsDetailLoadAttemptedRef.current) {
        mealsDetailLoadAttemptedRef.current = true;
        refreshMeals();
      }
      return;
    }

    setDetailMeal((current) => (current?.id === meal.id ? current : meal));

    if (!mealsDetailRemeasuredRef.current) {
      mealsDetailRemeasuredRef.current = true;
      const remeasure = () => bumpOverlayMeasure();
      requestAnimationFrame(remeasure);
      setTimeout(remeasure, 400);
      setTimeout(remeasure, 700);
    }
  }, [
    bumpOverlayMeasure,
    mealsByDate,
    refreshMeals,
    selectedDate,
    tutorialSavedMealId,
    tutorialStatus,
    tutorialStepId,
  ]);

  const handleMealDeleteConfirmed = useCallback(async () => {
    if (!mealIdToDelete) return;
    try {
      await mealRepository.delete(mealIdToDelete);
      toast.success(t('meals.deleteSuccess'));
      refreshMeals();
    } catch {
      toast.error(t('meals.deleteError'));
    } finally {
      setMealIdToDelete(null);
    }
  }, [mealIdToDelete, refreshMeals, t, toast]);

  return (
    <View className="flex-1 bg-background">
      <TabBarHeightReporter />
      <BlurTargetView ref={blurTargetRef} style={{ flex: 1 }}>
        <BackgroundGradient />
        <MealsDayPager
            centerDate={pagerCenter}
            mealsByDate={mealsByDate}
            totalsByDate={totalsByDate}
            headerInset={headerHeight}
            onDateChange={handleDateChange}
            onMealPress={(meal) => setDetailMeal(meal)}
            onMealDelete={(id) => setMealIdToDelete(id)}
            scrollToDateKey={scrollToDateKey}
            onScrollToDateDone={() => setScrollToDateKey(null)}
            expandedMealId={
              tutorialStatus === TutorialStatus.RUNNING &&
              tutorialStepId === 'meals-saved'
                ? tutorialSavedMealId
                : null
            }
            onExpandedMealLayout={bumpOverlayMeasure}
          />
        <BlurScreenHeader blurTarget={blurTargetRef} onLayoutHeight={onHeaderLayout}>
          <View className="flex-row items-center justify-between">
            <Text className="text-foreground text-lg font-bold">{t('meals.title')}</Text>
            <View className="flex-row items-center gap-1">
              {!isToday ? (
                <TutorialAnchor
                  id="tutorial-meals-go-today"
                  onAnchorLayout={bumpOverlayMeasure}>
                  <ButtonIcon
                    onPress={handleGoToToday}
                    accessibilityLabel={t('meals.goToTodayA11y')}>
                    <FaIcon name="arrow-rotate-left" size={20} color={accentColor} />
                  </ButtonIcon>
                </TutorialAnchor>
              ) : null}
              <ButtonIcon
                onPress={() => setDatePickerOpen(true)}
                accessibilityLabel={t('meals.openDatePickerA11y')}>
                <FaIcon name="calendar" size={20} color={accentColor} />
              </ButtonIcon>
              <TutorialAnchor
                id={TUTORIAL_MEALS_ADD_ANCHOR_ID}
                onAnchorLayout={bumpOverlayMeasure}>
                <ButtonIcon
                  onPress={() => {
                    useMealStore.getState().resetDraft();
                    if (
                      tutorialStatus === TutorialStatus.RUNNING &&
                      tutorialStepId === 'meals-add'
                    ) {
                      tutorialNextStep();
                      return;
                    }
                    router.push('/meal/create');
                  }}
                  accessibilityLabel={t('meals.addMeal')}>
                  <FaIcon name="plus" size={22} color={accentColor} />
                </ButtonIcon>
              </TutorialAnchor>
            </View>
          </View>
        </BlurScreenHeader>
        {showDayNav ? (
          <TutorialAnchor
            id={TUTORIAL_MEALS_DAY_NAV_ANCHOR_ID}
            style={{ position: 'absolute', left: 0, right: 0, bottom: tabBarInset }}
            onAnchorLayout={bumpOverlayMeasure}>
            <View pointerEvents="box-none" className="flex-row items-center px-4 py-2">
              <ButtonIcon
                size="sm"
                onPress={() => shiftDate(-1)}
                accessibilityLabel={t('meals.previousDayA11y')}>
                <FaIcon name="chevron-left" size={16} color={accentColor} />
              </ButtonIcon>
              <View className="flex-1 items-center justify-center">
                <MealsDayScrollIndicator
                  selectedDate={selectedDate}
                  pagerCenter={pagerCenter}
                  mealsByDate={mealsByDate}
                  windowHalf={PAGER_HALF_WINDOW}
                />
              </View>
              <ButtonIcon
                size="sm"
                onPress={() => shiftDate(1)}
                accessibilityLabel={t('meals.nextDayA11y')}>
                <FaIcon name="chevron-right" size={16} color={accentColor} />
              </ButtonIcon>
            </View>
          </TutorialAnchor>
        ) : null}
      </BlurTargetView>
      <MealDatePickerSheet
        isOpen={datePickerOpen}
        selectedDate={selectedDate}
        onClose={() => {
          if (
            tutorialStatus === TutorialStatus.RUNNING &&
            tutorialStepId === 'meals-calendar'
          ) {
            return;
          }
          setDatePickerOpen(false);
        }}
        onSelectDate={(dateKey) => {
          void navigateToDate(dateKey);
        }}
      />
      <MealDetailSheet
        meal={detailMeal}
        onClose={() => setDetailMeal(null)}
        closeBlocked={
          tutorialStatus === TutorialStatus.RUNNING && tutorialStepId === 'meals-detail'
        }
      />
      <ConfirmDialog
        isOpen={mealIdToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setMealIdToDelete(null);
        }}
        title={t('meals.deleteConfirmTitle')}
        description={t('meals.deleteConfirmMessage')}
        confirmLabel={t('common.delete')}
        destructive
        onConfirm={() => void handleMealDeleteConfirmed()}
      />
    </View>
  );
};
