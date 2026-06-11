import { BlurTargetView } from 'expo-blur';
import { router, useFocusEffect } from 'expo-router';
import { useThemeColor } from 'heroui-native';
import { type FC, useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { FaIcon } from '@/components/atoms/FaIcon';
import { TutorialAnchor } from '@/components/atoms/TutorialAnchor';
import { BackgroundGradient } from '@/components/atoms/BackgroundGradient';
import { ButtonIcon } from '@/components/atoms/ButtonIcon';
import { TabBarHeightReporter } from '@/components/navigation/TabBarHeightReporter';
import { BlurScreenHeader } from '@/components/organisms/BlurScreenHeader';
import { MealDetailSheet } from '@/components/organisms/MealDetailSheet';
import { MealsDayPager } from '@/components/organisms/MealsDayPager';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useAppToast } from '@/components/ui/useAppToast';
import { useBlurHeaderInset } from '@/hooks/useBlurHeaderInset';
import { useMealStore } from '@/store/meal.store';
import { mealRepository } from '@/repositories/meal.repository';
import type { Meal } from '@/types/meal';
import { addDays, toDateKey } from '@/utils/date';

export const MealsTabLayout: FC = () => {
  const { t } = useTranslation();
  const toast = useAppToast();
  const [accentColor, mutedColor] = useThemeColor(['accent', 'muted']);
  const blurTargetRef = useRef<View>(null);
  const { headerHeight, onHeaderLayout } = useBlurHeaderInset(0);
  const todayKey = toDateKey(new Date());
  const selectedDate = useMealStore((s) => s.selectedDate);
  const setSelectedDate = useMealStore((s) => s.setSelectedDate);
  const hydrateDay = useMealStore((s) => s.hydrateDay);

  const [mealsByDate, setMealsByDate] = useState<Record<string, Meal[]>>({});
  const [totalsByDate, setTotalsByDate] = useState<Record<string, number>>({});
  const [scrollToDateKey, setScrollToDateKey] = useState<string | null>(null);
  const [detailMeal, setDetailMeal] = useState<Meal | null>(null);
  const [mealIdToDelete, setMealIdToDelete] = useState<string | null>(null);

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
    void loadWindow(selectedDate);
  }, [hydrateDay, loadWindow, selectedDate]);

  useFocusEffect(
    useCallback(() => {
      refreshMeals();
    }, [refreshMeals]),
  );

  const handleDateChange = (dateKey: string) => {
    setSelectedDate(dateKey);
    void loadWindow(dateKey);
  };

  const handleGoToToday = useCallback(() => {
    setSelectedDate(todayKey);
    void loadWindow(todayKey);
    setScrollToDateKey(todayKey);
  }, [loadWindow, setSelectedDate, todayKey]);

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
            centerDate={selectedDate}
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
            <Text className="text-foreground text-lg font-semibold">{t('meals.title')}</Text>
            <View className="flex-row items-center gap-2">
              <ButtonIcon
                onPress={handleGoToToday}
                accessibilityLabel={t('meals.goToTodayA11y')}>
                <FaIcon
                  name="calendar"
                  size={20}
                  color={selectedDate === todayKey ? accentColor : mutedColor}
                />
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
      </BlurTargetView>
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
