import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { type ComponentProps, type FC, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { useTheme } from 'styled-components/native';

import { ProductImage } from '@/components/atoms/ProductImage';
import { Text } from '@/components/atoms/Text';
import type { Meal } from '@/types/meal';
import { formatTimeLabel } from '@/utils/date';
import { useMassDisplay } from '@/hooks/useMassDisplay';
import { formatDecimal } from '@/utils/format';
import { formatMealItemQuantity } from '@/utils/formatMealItemQuantity';
import { getCurrentLocale } from '@/i18n';
import { listRowDivider } from '@/styles/listRow';
import { getBottomSheetBlurProps } from '@/components/navigation/BottomSheetBlurBackground';
import { getMealTypeLabelKey } from '@/utils/mealType';

type MealDetailSheetProps = {
  meal: Meal | null;
  onClose: () => void;
};

const Row = styled.View<{ $isLast?: boolean }>`
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding: ${({ theme }) => theme.spacing.sm}px 0;
  ${listRowDivider}
`;

const ItemInfo = styled.View`
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

export const MealDetailSheet: FC<MealDetailSheetProps> = ({ meal, onClose }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const snapPoints = useMemo(() => ['50%', '85%'], []);
  const locale = getCurrentLocale();
  const { formatMassValue, massUnit } = useMassDisplay();

  const renderBackdrop = useCallback(
    (props: ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
    ),
    [],
  );

  if (!meal) return null;

  return (
    <BottomSheet
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={onClose}
      backdropComponent={renderBackdrop}
      {...getBottomSheetBlurProps(theme)}>
      <BottomSheetScrollView style={{ padding: theme.spacing.lg }}>
        <Text $variant="subtitle">{t(getMealTypeLabelKey(meal.type))}</Text>
        <Text $variant="caption" $color="textSecondary" style={{ marginBottom: 16 }}>
          {formatTimeLabel(meal.createdAt, locale)}
        </Text>
        {meal.items.map((item, index) => (
          <Row key={item.id} $isLast={index === meal.items.length - 1}>
            <ItemInfo>
              <Text $variant="body">{item.productName}</Text>
              <Text $variant="caption" $color="textSecondary">
                {formatMealItemQuantity(
                  item.quantity,
                  item.unitType,
                  item.unitLabel,
                  formatMassValue,
                  massUnit,
                )}{' '}
                — {formatDecimal(item.carbs ?? 0)} g
              </Text>
            </ItemInfo>
            {item.imageUrl ? <ProductImage uri={item.imageUrl} size={64} /> : null}
          </Row>
        ))}
        <Text $variant="title" $color="accent" style={{ marginTop: 16 }}>
          {t('meals.mealTotal')}: {formatDecimal(meal.totalCarbs)} g
        </Text>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};
