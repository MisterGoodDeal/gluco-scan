import { BlurTargetView } from 'expo-blur';
import { router, useFocusEffect } from 'expo-router';
import { useThemeColor } from 'heroui-native';
import { type FC, useCallback, useMemo, useRef, useState } from 'react';
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
  const hasAnyMeals = useMemo(
    () => Object.values(mealsByDate).some((meals) => meals.length > 0),
    [mealsByDate],
  );

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
        <TutorialAnchor id="tutorial-meals-pager">
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
          />
        </TutorialAnchor>
        <BlurScreenHeader blurTarget={blurTargetRef} onLayoutHeight={onHeaderLayout}>
          <TutorialAnchor id="tutorial-meals-summary">
          <View className="flex-row items-center justify-between">
            <Text className="text-foreground text-lg font-bold">{t('meals.title')}</Text>
            <View className="flex-row items-center gap-1">
              {!isToday ? (
                <ButtonIcon
                  onPress={handleGoToToday}
                  accessibilityLabel={t('meals.goToTodayA11y')}>
                  <FaIcon name="arrow-rotate-left" size={20} color={accentColor} />
                </ButtonIcon>
              ) : null}
              <ButtonIcon
                onPress={() => setDatePickerOpen(true)}
                accessibilityLabel={t('meals.openDatePickerA11y')}>
                <FaIcon name="calendar" size={20} color={accentColor} />
              </ButtonIcon>
              <ButtonIcon
                onPress={() => {
                  useMealStore.getState().resetDraft();
                  router.push('/meal/create');
                }}
                accessibilityLabel={t('meals.addMeal')}>
                <FaIcon name="plus" size={22} color={accentColor} />
              </ButtonIcon>
            </View>
          </View>
          </TutorialAnchor>
        </BlurScreenHeader>
        {hasAnyMeals ? (
          <View
            pointerEvents="box-none"
            className="absolute left-0 right-0 flex-row items-center px-4"
            style={{ bottom: tabBarInset }}>
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
        ) : null}
      </BlurTargetView>
      <MealDatePickerSheet
        isOpen={datePickerOpen}
        selectedDate={selectedDate}
        onClose={() => setDatePickerOpen(false)}
        onSelectDate={(dateKey) => {
          void navigateToDate(dateKey);
        }}
      />
      <MealDetailSheet meal={detailMeal} onClose={() => setDetailMeal(null)} />
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
