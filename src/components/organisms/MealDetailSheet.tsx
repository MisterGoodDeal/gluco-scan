import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import { type ComponentProps, type FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { useTheme } from 'styled-components/native';

import { ProductImage } from '@/components/atoms/ProductImage';
import { Text } from '@/components/atoms/Text';
import { MealItemConversionLine } from '@/components/molecules/MealItemConversionLine';
import type { Meal } from '@/types/meal';
import { formatTimeLabel } from '@/utils/date';
import { formatDecimal } from '@/utils/format';
import { getCurrentLocale } from '@/i18n';
import { listRowDivider } from '@/styles/listRow';
import { getBottomSheetProps } from '@/components/navigation/bottomSheet';
import { getMealTypeLabelKey } from '@/utils/mealType';
import { productRepository } from '@/repositories/product.repository';
import type { Product } from '@/types/product';

type MealDetailSheetProps = {
  meal: Meal | null;
  onClose: () => void;
};

const Row = styled.View<{ $isLast?: boolean }>`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding: ${({ theme }) => theme.spacing.sm}px 0;
  ${listRowDivider}
`;

const ItemInfo = styled.View`
  flex: 1;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const EditButton = styled.Pressable`
  align-self: flex-start;
  margin-top: ${({ theme }) => theme.spacing.md}px;
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.lg}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme }) => theme.colors.accentMuted};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.glass.border};
`;

export const MealDetailSheet: FC<MealDetailSheetProps> = ({ meal, onClose }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const snapPoints = useMemo(() => ['50%', '85%'], []);
  const locale = getCurrentLocale();
  const [productsById, setProductsById] = useState<Record<string, Product>>({});

  const renderBackdrop = useCallback(
    (props: ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
    ),
    [],
  );

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

  if (!meal) return null;

  return (
    <BottomSheet
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={onClose}
      backdropComponent={renderBackdrop}
      {...getBottomSheetProps(theme)}>
      <BottomSheetScrollView style={{ padding: theme.spacing.lg }}>
        <Text $variant="subtitle">{t(getMealTypeLabelKey(meal.type))}</Text>
        <Text $variant="caption" $color="textSecondary">
          {formatTimeLabel(meal.createdAt, locale)}
        </Text>
        <Text $variant="caption" $color="textSecondary" style={{ marginBottom: 8 }}>
          {t('meals.itemCount', { count: meal.items.length })}
        </Text>
        {meal.items.map((item, index) => (
          <Row key={item.id} $isLast={index === meal.items.length - 1}>
            <ItemInfo>
              <MealItemConversionLine
                item={item}
                product={productsById[item.productId] ?? { tags: [], customCookingFactor: null }}
              />
            </ItemInfo>
            {item.imageUrl ? <ProductImage uri={item.imageUrl} size={64} /> : null}
          </Row>
        ))}
        <Text $variant="title" $color="accent" style={{ marginTop: 16 }}>
          {t('meals.mealTotal')}: {formatDecimal(meal.totalCarbs)} g
        </Text>
        <EditButton
          onPress={() => {
            onClose();
            router.push(`/meal/edit?mealId=${meal.id}`);
          }}
          accessibilityRole="button"
          accessibilityLabel={t('meals.editMealA11y')}>
          <Text $variant="caption" $color="accent">
            {t('meals.editTitle')}
          </Text>
        </EditButton>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};
