import { useThemeColor } from 'heroui-native';
import { type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { FaIcon } from '@/components/atoms/FaIcon';
import { MealTimePickerSheet } from '@/components/organisms/MealTimePickerSheet';
import { AppPressable } from '@/components/ui/AppPressable';
import { usePreferencesStore } from '@/store/preferences.store';
import {
  CONFIGURABLE_MEAL_TYPES,
  type ConfigurableMealType,
  type MealTypeSchedule,
  type MealTypeTimeRange,
} from '@/types/mealTypeSchedule';
import { formatTimeOfDay, getMealTypeLabelKey } from '@/utils/mealType';

type EditingBoundary = 'start' | 'end';

type EditingField = {
  mealType: ConfigurableMealType;
  boundary: EditingBoundary;
};

const getBoundaryTime = (range: MealTypeTimeRange, boundary: EditingBoundary) =>
  boundary === 'start'
    ? { hours: range.startHours, minutes: range.startMinutes }
    : { hours: range.endHours, minutes: range.endMinutes };

export const MealTypeScheduleSettings: FC = () => {
  const { t } = useTranslation();
  const mutedColor = useThemeColor('muted');
  const schedule = usePreferencesStore((s) => s.mealTypeSchedule);
  const setMealTypeSchedule = usePreferencesStore((s) => s.setMealTypeSchedule);
  const [editingField, setEditingField] = useState<EditingField | null>(null);

  const editingTime = editingField
    ? getBoundaryTime(schedule[editingField.mealType], editingField.boundary)
    : { hours: 0, minutes: 0 };

  const updateBoundary = (hours: number, minutes: number) => {
    if (!editingField) return;
    const current = schedule[editingField.mealType];
    const nextRange: MealTypeTimeRange =
      editingField.boundary === 'start'
        ? { ...current, startHours: hours, startMinutes: minutes }
        : { ...current, endHours: hours, endMinutes: minutes };
    const nextSchedule: MealTypeSchedule = {
      ...schedule,
      [editingField.mealType]: nextRange,
    };
    void setMealTypeSchedule(nextSchedule);
  };

  return (
    <View className="gap-3">
      <Text className="text-muted text-sm">{t('settings.mealTypeScheduleDescription')}</Text>
      {CONFIGURABLE_MEAL_TYPES.map((mealType) => {
        const range = schedule[mealType];
        return (
          <View key={mealType} className="gap-2">
            <Text className="text-foreground text-sm font-medium">
              {t(getMealTypeLabelKey(mealType))}
            </Text>
            <View className="flex-row items-center gap-2">
              <AppPressable
                className="min-h-11 flex-1 flex-row items-center justify-between gap-2 rounded-2xl border border-border bg-surface px-3"
                onPress={() => setEditingField({ mealType, boundary: 'start' })}
                accessibilityLabel={t('settings.mealTypeScheduleStart', {
                  meal: t(getMealTypeLabelKey(mealType)),
                })}>
                <Text className="text-foreground text-base tabular-nums">
                  {formatTimeOfDay(range.startHours, range.startMinutes)}
                </Text>
                <FaIcon name="chevron-right" size={14} color={mutedColor} />
              </AppPressable>
              <Text className="text-muted text-sm">—</Text>
              <AppPressable
                className="min-h-11 flex-1 flex-row items-center justify-between gap-2 rounded-2xl border border-border bg-surface px-3"
                onPress={() => setEditingField({ mealType, boundary: 'end' })}
                accessibilityLabel={t('settings.mealTypeScheduleEnd', {
                  meal: t(getMealTypeLabelKey(mealType)),
                })}>
                <Text className="text-foreground text-base tabular-nums">
                  {formatTimeOfDay(range.endHours, range.endMinutes)}
                </Text>
                <FaIcon name="chevron-right" size={14} color={mutedColor} />
              </AppPressable>
            </View>
          </View>
        );
      })}
      <Text className="text-muted text-sm">{t('settings.mealTypeScheduleCollationHint')}</Text>
      <MealTimePickerSheet
        isOpen={editingField !== null}
        hours={editingTime.hours}
        minutes={editingTime.minutes}
        onClose={() => setEditingField(null)}
        onTimeChange={updateBoundary}
      />
    </View>
  );
};
