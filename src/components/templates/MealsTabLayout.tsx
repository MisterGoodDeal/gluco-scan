import { BlurTargetView } from 'expo-blur';
import { SymbolView } from 'expo-symbols';
import { router, useFocusEffect } from 'expo-router';
import { type FC, useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import styled, { useTheme } from 'styled-components/native';

import { TutorialAnchor } from '@/components/atoms/TutorialAnchor';
import { BackgroundGradient } from '@/components/atoms/BackgroundGradient';
import { ButtonIcon } from '@/components/atoms/ButtonIcon';
import { Text } from '@/components/atoms/Text';
import { TabBarHeightReporter } from '@/components/navigation/TabBarHeightReporter';
import { BlurScreenHeader } from '@/components/organisms/BlurScreenHeader';
import { MealDetailSheet } from '@/components/organisms/MealDetailSheet';
import { MealsDayPager } from '@/components/organisms/MealsDayPager';
import { useBlurHeaderInset } from '@/hooks/useBlurHeaderInset';
import { useMealStore } from '@/store/meal.store';
import { mealRepository } from '@/repositories/meal.repository';
import type { Meal } from '@/types/meal';
import { addDays, toDateKey } from '@/utils/date';
import { Screen } from '@/styles/global';

const TitleRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const HeaderActions = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

export const MealsTabLayout: FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const blurTargetRef = useRef<View>(null);
  const { headerHeight, onHeaderLayout } = useBlurHeaderInset(0);
  const todayKey = toDateKey(new Date());
  const selectedDate = useMealStore((s) => s.selectedDate);
  const setSelectedDate = useMealStore((s) => s.setSelectedDate);
  const hydrateDay = useMealStore((s) => s.hydrateDay);
  const selectedMeal = useMealStore((s) => s.selectedMeal);
  const setSelectedMeal = useMealStore((s) => s.setSelectedMeal);

  const [mealsByDate, setMealsByDate] = useState<Record<string, Meal[]>>({});
  const [totalsByDate, setTotalsByDate] = useState<Record<string, number>>({});
  const [scrollToDateKey, setScrollToDateKey] = useState<string | null>(null);

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

  const handleMealDelete = useCallback(
    async (mealId: string) => {
      await mealRepository.delete(mealId);
      if (selectedMeal?.id === mealId) {
        setSelectedMeal(null);
      }
      refreshMeals();
    },
    [refreshMeals, selectedMeal?.id, setSelectedMeal],
  );

  return (
    <Screen>
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
            onMealPress={setSelectedMeal}
            onMealDelete={(id) => void handleMealDelete(id)}
            scrollToDateKey={scrollToDateKey}
            onScrollToDateDone={() => setScrollToDateKey(null)}
          />
        </TutorialAnchor>
        <BlurScreenHeader blurTarget={blurTargetRef} onLayoutHeight={onHeaderLayout}>
          <TutorialAnchor id="tutorial-meals-summary">
          <TitleRow>
            <Text $variant="subtitle">{t('meals.title')}</Text>
            <HeaderActions>
              <ButtonIcon
                onPress={handleGoToToday}
                accessibilityLabel={t('meals.goToTodayA11y')}>
                <SymbolView
                  name={{ ios: 'calendar', android: 'calendar_today' }}
                  size={20}
                  tintColor={
                    selectedDate === todayKey ? theme.colors.accent : theme.colors.textSecondary
                  }
                />
              </ButtonIcon>
              <ButtonIcon
                onPress={() => {
                  useMealStore.getState().resetDraft();
                  router.push('/meal/create');
                }}
                accessibilityLabel={t('meals.addMeal')}>
                <SymbolView
                  name={{ ios: 'plus', android: 'add' }}
                  size={22}
                  tintColor={theme.colors.accent}
                />
              </ButtonIcon>
            </HeaderActions>
          </TitleRow>
          </TutorialAnchor>
        </BlurScreenHeader>
      </BlurTargetView>
      {selectedMeal && (
        <MealDetailSheet meal={selectedMeal} onClose={() => setSelectedMeal(null)} />
      )}
    </Screen>
  );
};
