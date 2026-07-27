import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import { BottomSheet } from 'heroui-native';
import { type FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProductImage } from '@/components/atoms/ProductImage';
import { MealItemConversionLine } from '@/components/molecules/MealItemConversionLine';
import { AppButton } from '@/components/ui/AppButton';
import { MEAL_DETAIL_SNAP_RATIO } from '@/constants/mealDetailSheet';
import type { Meal } from '@/types/meal';
import { formatTimeLabel } from '@/utils/date';
import { formatDecimal } from '@/utils/format';
import { getCurrentLocale } from '@/i18n';
import { getMealTypeLabelKey } from '@/utils/mealType';
import { productRepository } from '@/repositories/product.repository';
import { MealStatisticsSection } from '@/features/statistics/components/MealStatisticsSection';
import type { Product } from '@/types/product';

type MealDetailSheetProps = {
  meal: Meal | null;
  onClose: () => void;
  closeBlocked?: boolean;
};

export const MealDetailSheet: FC<MealDetailSheetProps> = ({
  meal,
  onClose,
  closeBlocked = false,
}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const locale = getCurrentLocale();
  const [productsById, setProductsById] = useState<Record<string, Product>>({});

  useEffect(() => {
    if (!meal) {
      setProductsById({});
      return;
    }
    void (async () => {
      const entries = await Promise.all(
        meal.items.map(async (item) => {
          const product = await productRepository.getById(item.productId);
          return [item.productId, product] as const;
        }),
      );
      const next: Record<string, Product> = {};
      for (const [productId, product] of entries) {
        if (product) next[productId] = product;
      }
      setProductsById(next);
    })();
  }, [meal]);

  return (
    <BottomSheet
      isOpen={meal !== null}
      onOpenChange={(open) => {
        if (!open && closeBlocked) return;
        if (!open) onClose();
      }}>
      <BottomSheet.Portal>
        <BottomSheet.Overlay />
        <BottomSheet.Content
          snapPoints={[`${MEAL_DETAIL_SNAP_RATIO * 100}%`, '92%']}
          enableOverDrag={false}
          enableDynamicSizing={false}
          contentContainerClassName="h-full">
          {meal ? (
            <BottomSheetScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                padding: 24,
                paddingBottom: insets.bottom + 24,
              }}>
              <View className="flex-row items-start justify-between gap-3 pb-4 border-b border-separator">
                <View className="flex-1 gap-1">
                  <Text className="text-foreground text-lg font-semibold">
                    {t(getMealTypeLabelKey(meal.type))}
                  </Text>
                  <Text className="text-muted text-sm">
                    {formatTimeLabel(meal.createdAt, locale)}
                  </Text>
                </View>
                <AppButton
                  size="sm"
                  variant="tertiary"
                  className="shrink-0"
                  onPress={() => {
                    onClose();
                    router.push(`/meal/edit?mealId=${meal.id}`);
                  }}
                  accessibilityLabel={t('meals.editMealA11y')}>
                  {t('meals.editTitle')}
                </AppButton>
              </View>
              <Text className="text-muted text-sm mt-2 mb-2">
                {t('meals.itemCount', { count: meal.items.length })}
              </Text>
              {meal.sourceCompositionName ? (
                <View className="mb-3 self-start rounded-full border border-accent/30 bg-accent/10 px-3 py-1">
                  <Text className="text-accent text-xs font-medium">
                    {t('meals.fromComposition', { name: meal.sourceCompositionName })}
                  </Text>
                </View>
              ) : null}
              {meal.items.map((item, index) => (
                <View
                  key={item.id}
                  className={`flex-row gap-2 py-2 ${
                    index === meal.items.length - 1 ? '' : 'border-b border-separator'
                  }`}>
                  <View className="flex-1 gap-1">
                    <MealItemConversionLine
                      item={item}
                      product={
                        productsById[item.productId] ?? { tags: [], customCookingFactor: null }
                      }
                    />
                  </View>
                  {item.imageUrl ? <ProductImage uri={item.imageUrl} size={64} /> : null}
                </View>
              ))}
              <Text className="text-accent text-2xl font-bold mt-4">
                {t('meals.mealTotal')}: {formatDecimal(meal.totalCarbs)} g
              </Text>
              <MealStatisticsSection meal={meal} productsById={productsById} />
            </BottomSheetScrollView>
          ) : null}
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
};
