import { BottomSheet } from 'heroui-native';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MealCalendarPicker } from '@/components/organisms/MealCalendarPicker';
import { MEALS_DATE_PICKER_SNAP_RATIO } from '@/constants/mealsDatePicker';

type MealDatePickerSheetProps = {
  isOpen: boolean;
  selectedDate: string;
  onClose: () => void;
  onSelectDate: (dateKey: string) => void;
};

export const MealDatePickerSheet: FC<MealDatePickerSheetProps> = ({
  isOpen,
  selectedDate,
  onClose,
  onSelectDate,
}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const snapPoint = `${MEALS_DATE_PICKER_SNAP_RATIO * 100}%`;

  return (
    <BottomSheet isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <BottomSheet.Portal>
        <BottomSheet.Overlay />
        <BottomSheet.Content
          snapPoints={[snapPoint]}
          enableOverDrag={false}
          enableDynamicSizing={false}
          contentContainerClassName="h-full">
          <View
            className="flex-1 px-4"
            style={{ paddingBottom: insets.bottom + 16 }}>
            <BottomSheet.Title className="text-foreground text-lg font-semibold mb-1">
              {t('meals.pickDateTitle')}
            </BottomSheet.Title>
            <Text className="text-muted text-sm mb-3">{t('meals.pickDateHint')}</Text>
            <MealCalendarPicker
              selectedDate={selectedDate}
              onSelectDate={(dateKey) => {
                onSelectDate(dateKey);
                onClose();
              }}
            />
          </View>
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
};
