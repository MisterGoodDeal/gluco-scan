import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  type BottomSheetModal as BottomSheetModalType,
} from '@gorhom/bottom-sheet';
import { type ComponentProps, type FC, useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled, { useTheme } from 'styled-components/native';

import { Text } from '@/components/atoms/Text';
import { getBottomSheetProps, getBottomSheetScrollPadding } from '@/components/navigation/bottomSheet';
import type { EnrichedMealRecord } from '@/features/statistics/types/enrichedMeal';
import { useBottomSheetModalVisibility } from '@/hooks/useBottomSheetModalVisibility';
import { formatDateLabel } from '@/utils/date';
import { formatDecimal } from '@/utils/format';
import { getCurrentLocale } from '@/i18n';
import { getMealTypeLabelKey } from '@/utils/mealType';

type HeatmapDayDetailSheetProps = {
  date: string | null;
  carbs: number;
  meals: EnrichedMealRecord[];
  onClose: () => void;
};

const Row = styled.View`
  padding: ${({ theme }) => theme.spacing.sm}px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.glass.border};
`;

export const HeatmapDayDetailSheet: FC<HeatmapDayDetailSheetProps> = ({
  date,
  carbs,
  meals,
  onClose,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const locale = getCurrentLocale();
  const sheetRef = useRef<BottomSheetModalType>(null);
  const isOpen = date !== null;
  const { markDismissed } = useBottomSheetModalVisibility(sheetRef, isOpen);
  const snapPoints = useMemo(() => ['45%', '85%'], []);

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

  const dayMeals = date ? meals.filter((meal) => meal.date === date) : [];

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose
      onDismiss={handleDismiss}
      backdropComponent={renderBackdrop}
      {...getBottomSheetProps(theme)}>
      {date ? (
        <BottomSheetScrollView
          contentContainerStyle={{
            padding: theme.spacing.lg,
            ...getBottomSheetScrollPadding(insets.bottom, theme.spacing.lg),
          }}>
          <Text $variant="subtitle">{formatDateLabel(date, locale)}</Text>
          <Text $variant="caption" $color="textSecondary" style={{ marginBottom: theme.spacing.md }}>
            {t('statistics.heatmap.dayTotal', { value: formatDecimal(carbs) })}
          </Text>
          {dayMeals.length === 0 ? (
            <Text $variant="body" $color="textSecondary">
              {t('statistics.empty.description')}
            </Text>
          ) : (
            dayMeals.map((meal) => (
              <Row key={meal.id}>
                <Text $variant="body">{t(getMealTypeLabelKey(meal.type))}</Text>
                <Text $variant="caption" $color="textSecondary">
                  {meal.items.map((item) => item.productName).join(', ')}
                </Text>
                <Text $variant="caption" $color="accent">
                  {formatDecimal(meal.totalCarbs)} g
                </Text>
              </Row>
            ))
          )}
        </BottomSheetScrollView>
      ) : null}
    </BottomSheetModal>
  );
};
