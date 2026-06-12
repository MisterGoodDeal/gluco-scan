import { Accordion, AccordionLayoutTransition, Card } from 'heroui-native';
import { type FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View, useWindowDimensions } from 'react-native';
import Animated from 'react-native-reanimated';

import { MealItemThumbnails } from '@/components/molecules/MealItemThumbnails';
import { AppButton } from '@/components/ui/AppButton';
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
    <Animated.ScrollView
      style={{ width, flex: 1 }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        padding: 16,
        paddingTop: 16 + headerInset,
        paddingBottom: tabBarInset,
      }}>
      <Text className="text-foreground text-lg font-bold capitalize mb-4">
        {formatDateLabel(dateKey, locale)}
      </Text>

      {hasMeals ? (
        <Accordion selectionMode="multiple" variant="surface">
          {sortedMeals.map((meal) => (
            <Accordion.Item key={meal.id} value={meal.id}>
              <Accordion.Trigger>
                <View className="flex-1 gap-0.5">
                  <Text className="text-foreground text-base font-medium">
                    {t(getMealTypeLabelKey(meal.type))} ·{' '}
                    {formatTimeLabel(meal.createdAt, locale)}
                  </Text>
                  <Text className="text-accent text-sm font-medium">
                    {t('meals.mealCarbs', { value: formatDecimal(meal.totalCarbs) })}
                  </Text>
                </View>
                <Accordion.Indicator />
              </Accordion.Trigger>
              <Accordion.Content>
                <View className="gap-3">
                  <Text className="text-muted text-sm">
                    {t('meals.itemCount', { count: meal.items.length })}
                  </Text>
                  <MealItemThumbnails items={meal.items} size={28} />
                  <View className="flex-row gap-2">
                    <AppButton
                      size="sm"
                      variant="tertiary"
                      className="flex-1"
                      onPress={() => onMealPress(meal)}
                      accessibilityLabel={t('meals.viewDetailsA11y')}>
                      {t('meals.viewDetails')}
                    </AppButton>
                    <AppButton
                      size="sm"
                      variant="danger-soft"
                      className="flex-1"
                      onPress={() => onMealDelete(meal.id)}
                      accessibilityLabel={t('meals.deleteA11y')}>
                      {t('common.delete')}
                    </AppButton>
                  </View>
                </View>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion>
      ) : (
        <Card>
          <Card.Body className="items-center px-4 py-6">
            <Text className="text-muted text-base text-center">
              {isToday ? t('meals.emptyToday') : t('meals.emptyDay')}
            </Text>
          </Card.Body>
        </Card>
      )}

      {hasMeals && (
        <Animated.View layout={AccordionLayoutTransition}>
          <Text className="text-accent text-2xl font-bold text-center mt-6">
            {t('meals.dayTotal', { value: formatDecimal(dayTotalCarbs) })}
          </Text>
        </Animated.View>
      )}
    </Animated.ScrollView>
  );
};
