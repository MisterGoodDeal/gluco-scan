import { type FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, useWindowDimensions } from 'react-native';
import styled, { useTheme } from 'styled-components/native';

import { ButtonIcon } from '@/components/atoms/ButtonIcon';
import { GlassPanel } from '@/components/atoms/GlassPanel';
import { Text } from '@/components/atoms/Text';
import { MealItemThumbnails } from '@/components/molecules/MealItemThumbnails';
import { useTabBarBottomInset } from '@/hooks/useTabBarBottomInset';
import { getCurrentLocale } from '@/i18n';
import type { Meal } from '@/types/meal';
import { formatDateLabel, formatTimeLabel } from '@/utils/date';
import { formatDecimal } from '@/utils/format';
import { getMealTypeLabelKey } from '@/utils/mealType';

type DayMealsViewProps = {
  dateKey: string;
  isToday: boolean;
  meals: Meal[];
  dayTotalCarbs: number;
  onMealPress: (meal: Meal) => void;
  onMealDelete: (mealId: string) => void;
  headerInset?: number;
};

const Page = styled(ScrollView)<{ $width: number }>`
  width: ${({ $width }) => $width}px;
  flex: 1;
`;

const MealRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding: ${({ theme }) => theme.spacing.sm}px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.glass.border};
`;

const MealContent = styled.View`
  flex: 1;
  min-width: 0;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const MealInfo = styled.Pressable`
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const DeleteLabel = styled(Text)`
  font-size: 18px;
  line-height: 20px;
`;

const EmptyState = styled.View`
  padding: ${({ theme }) => theme.spacing.lg}px ${({ theme }) => theme.spacing.md}px;
  align-items: center;
`;

export const DayMealsView: FC<DayMealsViewProps> = ({
  dateKey,
  isToday,
  meals,
  dayTotalCarbs,
  onMealPress,
  onMealDelete,
  headerInset = 0,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const locale = getCurrentLocale();
  const tabBarInset = useTabBarBottomInset();

  const sortedMeals = useMemo(
    () =>
      [...meals].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      ),
    [meals],
  );

  const hasMeals = sortedMeals.length > 0;

  return (
    <Page
      $width={width}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        padding: theme.spacing.md,
        paddingTop: theme.spacing.md + headerInset,
        paddingBottom: tabBarInset,
      }}>
      <Text $variant="subtitle" style={{ marginBottom: 16, textTransform: 'capitalize' }}>
        {formatDateLabel(dateKey, locale)}
      </Text>

      {hasMeals ? (
        <GlassPanel>
          {sortedMeals.map((meal) => (
            <MealRow key={meal.id}>
              <MealContent>
                <MealInfo onPress={() => onMealPress(meal)}>
                  <Text $variant="body">
                    {t(getMealTypeLabelKey(meal.type))} ·{' '}
                    {formatTimeLabel(meal.createdAt, locale)}
                  </Text>
                  <Text $variant="caption" $color="accent">
                    {t('meals.mealCarbs', { value: formatDecimal(meal.totalCarbs) })}
                  </Text>
                  <MealItemThumbnails items={meal.items} size={28} />
                </MealInfo>
              </MealContent>
              <ButtonIcon
                onPress={() => onMealDelete(meal.id)}
                accessibilityLabel={t('meals.deleteA11y')}>
                <DeleteLabel $color="error">×</DeleteLabel>
              </ButtonIcon>
            </MealRow>
          ))}
        </GlassPanel>
      ) : (
        <GlassPanel>
          <EmptyState>
            <Text $variant="body" $color="textSecondary" style={{ textAlign: 'center' }}>
              {isToday ? t('meals.emptyToday') : t('meals.emptyDay')}
            </Text>
          </EmptyState>
        </GlassPanel>
      )}

      {hasMeals && (
        <Text $variant="title" $color="accent" style={{ marginTop: 24, textAlign: 'center' }}>
          {t('meals.dayTotal', { value: formatDecimal(dayTotalCarbs) })}
        </Text>
      )}
    </Page>
  );
};
