import { type FC, type ReactNode, useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { TagChipList } from '@/components/molecules/tag-chip/TagChipList';
import { loadEnrichedMeals } from '@/features/statistics/services/statisticsData.service';
import { selectMealDetailStats } from '@/features/statistics/selectors/mealDetail.selectors';
import type { EnrichedMealRecord } from '@/features/statistics/types/enrichedMeal';
import type { Meal } from '@/types/meal';
import type { Product } from '@/types/product';
import type { ProductTag } from '@/types/productTag';
import { formatDecimal } from '@/utils/format';

type MealStatisticsSectionProps = {
  meal: Meal;
  productsById: Record<string, Product>;
};

const StatRow: FC<{ children: ReactNode }> = ({ children }) => (
  <View className="py-1 border-b border-separator">{children}</View>
);

const toEnrichedMeal = (meal: Meal, productsById: Record<string, Product>): EnrichedMealRecord => ({
  id: meal.id,
  type: meal.type,
  date: meal.date,
  createdAt: meal.createdAt,
  totalCarbs: meal.totalCarbs,
  items: meal.items.map((item) => ({
    id: item.id,
    productId: item.productId,
    productName: item.productName ?? productsById[item.productId]?.name ?? '',
    productTags: productsById[item.productId]?.tags ?? ([] as ProductTag[]),
    quantity: item.quantity,
    unitType: item.unitType,
    unitId: item.unitId,
    quantityType: item.quantityType,
    rawEquivalentQuantity: item.rawEquivalentQuantity,
    carbs: item.carbs ?? 0,
  })),
});

export const MealStatisticsSection: FC<MealStatisticsSectionProps> = ({ meal, productsById }) => {
  const { t } = useTranslation();
  const [allMeals, setAllMeals] = useState<EnrichedMealRecord[]>([]);

  useEffect(() => {
    void loadEnrichedMeals().then(setAllMeals);
  }, [meal.id]);

  const stats = useMemo(() => {
    const enriched = toEnrichedMeal(meal, productsById);
    return selectMealDetailStats(allMeals, enriched);
  }, [allMeals, meal, productsById]);

  return (
    <View className="mt-6 gap-2">
      <Text className="text-foreground text-base font-medium">
        {t('statistics.mealDetail.title')}
      </Text>
      {stats.dayPercentage != null ? (
        <StatRow>
          <Text className="text-muted text-sm">{t('statistics.mealDetail.dayPercentage')}</Text>
          <Text className="text-foreground text-sm">{formatDecimal(stats.dayPercentage)}%</Text>
        </StatRow>
      ) : null}
      {stats.equivalentRawWeight != null ? (
        <StatRow>
          <Text className="text-muted text-sm">{t('statistics.mealDetail.equivalentRaw')}</Text>
          <Text className="text-foreground text-sm">
            {formatDecimal(stats.equivalentRawWeight)} {t('common.gramsUnit')}
          </Text>
        </StatRow>
      ) : null}
      {stats.equivalentCookedWeight != null ? (
        <StatRow>
          <Text className="text-muted text-sm">{t('statistics.mealDetail.equivalentCooked')}</Text>
          <Text className="text-foreground text-sm">
            {formatDecimal(stats.equivalentCookedWeight)} {t('common.gramsUnit')}
          </Text>
        </StatRow>
      ) : null}
      {stats.tags.length > 0 ? (
        <StatRow>
          <Text className="text-muted text-sm">{t('statistics.mealDetail.tags')}</Text>
          <TagChipList tags={stats.tags} variant="compact" />
        </StatRow>
      ) : null}
      {stats.mostCarbRichProduct ? (
        <StatRow>
          <Text className="text-muted text-sm">{t('statistics.mealDetail.mostCarbRich')}</Text>
          <Text className="text-foreground text-sm">
            {stats.mostCarbRichProduct.name} ({formatDecimal(stats.mostCarbRichProduct.carbs)} g)
          </Text>
        </StatRow>
      ) : null}
    </View>
  );
};
