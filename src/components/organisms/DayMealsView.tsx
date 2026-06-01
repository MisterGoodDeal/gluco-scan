import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, useWindowDimensions } from 'react-native';
import styled from 'styled-components/native';

import { GlassPanel } from '@/components/atoms/GlassPanel';
import { Text } from '@/components/atoms/Text';
import type { Meal } from '@/types/meal';
import { MEAL_TYPES, MealType } from '@/types/mealType';
import { formatDateLabel } from '@/utils/date';
import { formatDecimal } from '@/utils/format';
import { getCurrentLocale } from '@/i18n';
import { getMealTypeLabelKey } from '@/utils/mealType';

type DayMealsViewProps = {
  dateKey: string;
  meals: Meal[];
  dayTotalCarbs: number;
  onMealPress: (meal: Meal) => void;
};

const Page = styled.View<{ $width: number }>`
  width: ${({ $width }) => $width}px;
  padding: ${({ theme }) => theme.spacing.md}px;
`;

const MealRow = styled(Pressable)`
  padding: ${({ theme }) => theme.spacing.sm}px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.glass.border};
`;

export const DayMealsView: FC<DayMealsViewProps> = ({
  dateKey,
  meals,
  dayTotalCarbs,
  onMealPress,
}) => {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const locale = getCurrentLocale();

  const mealsByType = (type: MealType) => meals.filter((m) => m.type === type);

  return (
    <Page $width={width}>
      <Text $variant="subtitle" style={{ marginBottom: 16, textTransform: 'capitalize' }}>
        {formatDateLabel(dateKey, locale)}
      </Text>

      <GlassPanel>
        {MEAL_TYPES.map((type) => {
          const typeMeals = mealsByType(type);
          if (typeMeals.length === 0) {
            return (
              <MealRow key={type} disabled>
                <Text $variant="body">{t(getMealTypeLabelKey(type))}</Text>
                <Text $variant="caption" $color="textSecondary">
                  —
                </Text>
              </MealRow>
            );
          }
          return typeMeals.map((meal) => (
            <MealRow key={meal.id} onPress={() => onMealPress(meal)}>
              <Text $variant="body">{t(getMealTypeLabelKey(type))}</Text>
              <Text $variant="caption" $color="accent">
                {t('meals.mealCarbs', { value: formatDecimal(meal.totalCarbs) })}
              </Text>
            </MealRow>
          ));
        })}
      </GlassPanel>

      <Text $variant="title" $color="accent" style={{ marginTop: 24, textAlign: 'center' }}>
        {t('meals.dayTotal', { value: formatDecimal(dayTotalCarbs) })}
      </Text>
    </Page>
  );
};
