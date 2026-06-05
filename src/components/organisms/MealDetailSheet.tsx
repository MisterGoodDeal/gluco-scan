import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  type BottomSheetModal as BottomSheetModalType,
} from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import { type ComponentProps, type FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled, { useTheme } from 'styled-components/native';

import { ProductImage } from '@/components/atoms/ProductImage';
import { Text } from '@/components/atoms/Text';
import { MealItemConversionLine } from '@/components/molecules/MealItemConversionLine';
import { getBottomSheetProps, getBottomSheetScrollPadding } from '@/components/navigation/bottomSheet';
import { useBottomSheetModalVisibility } from '@/hooks/useBottomSheetModalVisibility';
import type { Meal } from '@/types/meal';
import { formatTimeLabel } from '@/utils/date';
import { formatDecimal } from '@/utils/format';
import { getCurrentLocale } from '@/i18n';
import { listRowDivider } from '@/styles/listRow';
import { mutedButtonStyles } from '@/styles/button';
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
  ${mutedButtonStyles}
`;

export const MealDetailSheet: FC<MealDetailSheetProps> = ({ meal, onClose }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const sheetRef = useRef<BottomSheetModalType>(null);
  const isOpen = meal !== null;
  const { markDismissed } = useBottomSheetModalVisibility(sheetRef, isOpen);
  const snapPoints = useMemo(() => ['50%', '92%'], []);
  const locale = getCurrentLocale();
  const [productsById, setProductsById] = useState<Record<string, Product>>({});

  const renderBackdrop = useCallback(
    (props: ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
    ),
    [],
  );

  const handleDismiss = useCallback(() => {
    markDismissed();
    onClose();
  }, [markDismissed, onClose]);

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
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose
      onDismiss={handleDismiss}
      backdropComponent={renderBackdrop}
      {...getBottomSheetProps(theme)}>
      {meal ? (
        <BottomSheetScrollView
          contentContainerStyle={{
            padding: theme.spacing.lg,
            ...getBottomSheetScrollPadding(insets.bottom, theme.spacing.lg),
          }}>
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
      ) : null}
    </BottomSheetModal>
  );
};
