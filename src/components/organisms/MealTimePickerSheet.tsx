import { BottomSheet } from 'heroui-native';
import { type FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MealTimeWheelPicker } from '@/components/organisms/MealTimeWheelPicker';
import { AppButton } from '@/components/ui/AppButton';
import { getNowParts } from '@/utils/date';

type MealTimePickerSheetProps = {
  isOpen: boolean;
  hours: number;
  minutes: number;
  onClose: () => void;
  onTimeChange: (hours: number, minutes: number) => void;
};

export const MealTimePickerSheet: FC<MealTimePickerSheetProps> = ({
  isOpen,
  hours,
  minutes,
  onClose,
  onTimeChange,
}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [draftHours, setDraftHours] = useState(hours);
  const [draftMinutes, setDraftMinutes] = useState(minutes);

  useEffect(() => {
    if (!isOpen) return;
    setDraftHours(hours);
    setDraftMinutes(minutes);
  }, [hours, isOpen, minutes]);

  const handleConfirm = () => {
    onTimeChange(draftHours, draftMinutes);
    onClose();
  };

  const handleSetCurrentTime = () => {
    const now = getNowParts();
    setDraftHours(now.hours);
    setDraftMinutes(now.minutes);
  };

  return (
    <BottomSheet isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <BottomSheet.Portal>
        <BottomSheet.Overlay />
        <BottomSheet.Content
          snapPoints={['44%']}
          enableOverDrag={false}
          enableDynamicSizing={false}
          contentContainerClassName="h-full">
          <View
            className="flex-1 px-4"
            style={{ paddingBottom: insets.bottom + 16 }}>
            <BottomSheet.Title className="text-foreground text-lg font-semibold mb-4 text-center">
              {t('meals.time')}
            </BottomSheet.Title>
            <MealTimeWheelPicker
              hours={draftHours}
              minutes={draftMinutes}
              onTimeChange={(nextHours, nextMinutes) => {
                setDraftHours(nextHours);
                setDraftMinutes(nextMinutes);
              }}
            />
            <View className="mt-4 flex-row gap-2">
              <View className="flex-1">
                <AppButton variant="secondary" onPress={handleSetCurrentTime}>
                  {t('meals.setCurrentTime')}
                </AppButton>
              </View>
              <View className="flex-1">
                <AppButton variant="primary" onPress={handleConfirm}>
                  {t('common.confirm')}
                </AppButton>
              </View>
            </View>
          </View>
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
};
