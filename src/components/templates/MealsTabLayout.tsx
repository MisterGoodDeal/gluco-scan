import { BlurTargetView } from 'expo-blur';
import { router, useFocusEffect } from 'expo-router';
import { type FC, useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import styled from 'styled-components/native';

import { BackgroundGradient } from '@/components/atoms/BackgroundGradient';
import { Text } from '@/components/atoms/Text';
import { MealDetailSheet } from '@/components/organisms/MealDetailSheet';
import { MealsDayPager } from '@/components/organisms/MealsDayPager';
import { useMealStore } from '@/store/meal.store';
import { mealRepository } from '@/repositories/meal.repository';
import type { Meal } from '@/types/meal';
import { addDays } from '@/utils/date';
import { Screen, ScreenHeaderBar } from '@/styles/global';

const Header = styled(ScreenHeaderBar)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const AddButton = styled.Pressable`
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme }) => theme.colors.accentMuted};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.glass.border};
`;

export const MealsTabLayout: FC = () => {
  const { t } = useTranslation();
  const blurTargetRef = useRef<View>(null);
  const selectedDate = useMealStore((s) => s.selectedDate);
  const setSelectedDate = useMealStore((s) => s.setSelectedDate);
  const hydrateDay = useMealStore((s) => s.hydrateDay);
  const selectedMeal = useMealStore((s) => s.selectedMeal);
  const setSelectedMeal = useMealStore((s) => s.setSelectedMeal);

  const [mealsByDate, setMealsByDate] = useState<Record<string, Meal[]>>({});
  const [totalsByDate, setTotalsByDate] = useState<Record<string, number>>({});

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

  useFocusEffect(
    useCallback(() => {
      void hydrateDay(selectedDate);
      void loadWindow(selectedDate);
    }, [hydrateDay, loadWindow, selectedDate]),
  );

  const handleDateChange = (dateKey: string) => {
    setSelectedDate(dateKey);
    void loadWindow(dateKey);
  };

  return (
    <Screen>
      <StatusBar style="light" />
      <BlurTargetView ref={blurTargetRef} style={{ flex: 1 }}>
        <BackgroundGradient />
        <Header>
          <Text $variant="subtitle">{t('meals.title')}</Text>
          <AddButton
            onPress={() => {
              useMealStore.getState().resetDraft();
              router.push('/meal/create');
            }}>
            <Text $variant="caption" $color="accent">
              {t('meals.addMeal')}
            </Text>
          </AddButton>
        </Header>
        <MealsDayPager
          centerDate={selectedDate}
          mealsByDate={mealsByDate}
          totalsByDate={totalsByDate}
          onDateChange={handleDateChange}
          onMealPress={setSelectedMeal}
        />
      </BlurTargetView>
      {selectedMeal && (
        <MealDetailSheet meal={selectedMeal} onClose={() => setSelectedMeal(null)} />
      )}
    </Screen>
  );
};
