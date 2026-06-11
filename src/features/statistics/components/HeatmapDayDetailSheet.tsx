import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { BottomSheet } from 'heroui-native';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { EnrichedMealRecord } from '@/features/statistics/types/enrichedMeal';
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

export const HeatmapDayDetailSheet: FC<HeatmapDayDetailSheetProps> = ({
  date,
  carbs,
  meals,
  onClose,
}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const locale = getCurrentLocale();

  const dayMeals = date ? meals.filter((meal) => meal.date === date) : [];

  return (
    <BottomSheet isOpen={date !== null} onOpenChange={(open) => !open && onClose()}>
      <BottomSheet.Portal>
        <BottomSheet.Overlay />
        <BottomSheet.Content
          snapPoints={['45%', '85%']}
          enableOverDrag={false}
          enableDynamicSizing={false}
          contentContainerClassName="h-full">
          {date ? (
            <BottomSheetScrollView
              contentContainerStyle={{
                padding: 24,
                paddingBottom: insets.bottom + 24,
              }}>
              <BottomSheet.Title>{formatDateLabel(date, locale)}</BottomSheet.Title>
              <Text className="text-muted text-sm mb-4">
                {t('statistics.heatmap.dayTotal', { value: formatDecimal(carbs) })}
              </Text>
              {dayMeals.length === 0 ? (
                <Text className="text-muted text-base">
                  {t('statistics.empty.description')}
                </Text>
              ) : (
                dayMeals.map((meal, index) => (
                  <View
                    key={meal.id}
                    className={`py-2 ${
                      index === dayMeals.length - 1 ? '' : 'border-b border-separator'
                    }`}>
                    <Text className="text-foreground text-base">
                      {t(getMealTypeLabelKey(meal.type))}
                    </Text>
                    <Text className="text-muted text-sm">
                      {meal.items.map((item) => item.productName).join(', ')}
                    </Text>
                    <Text className="text-accent text-sm">
                      {formatDecimal(meal.totalCarbs)} g
                    </Text>
                  </View>
                ))
              )}
            </BottomSheetScrollView>
          ) : null}
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
};
