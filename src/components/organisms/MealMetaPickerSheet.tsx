import { Picker } from '@react-native-picker/picker';
import { BottomSheet, useThemeColor } from 'heroui-native';
import { type FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, View, type TextStyle } from 'react-native';

import { getCurrentLocale } from '@/i18n';
import type { MealDraftMeta } from '@/store/meal.store';
import { MEAL_TYPES, MealType } from '@/types/mealType';
import { addDays, formatDateLabel, toDateKey } from '@/utils/date';
import { getMealTypeLabelKey } from '@/utils/mealType';

export type MealMetaPickerField = 'mealType' | 'date' | 'time';

type MealMetaPickerSheetProps = {
  field: MealMetaPickerField | null;
  draftMeta: MealDraftMeta;
  onChange: (meta: Partial<MealDraftMeta>) => void;
  onClose: () => void;
};

const DATE_OPTIONS = Array.from({ length: 14 }, (_, i) => addDays(toDateKey(new Date()), i - 7));

export const MealMetaPickerSheet: FC<MealMetaPickerSheetProps> = ({
  field,
  draftMeta,
  onChange,
  onClose,
}) => {
  const { t } = useTranslation();
  const foregroundColor = useThemeColor('foreground');
  const locale = getCurrentLocale();

  const pickerStyle: TextStyle = { color: foregroundColor, backgroundColor: 'transparent' };
  const itemStyle: TextStyle | undefined =
    Platform.OS === 'ios' ? { color: foregroundColor, fontSize: 18 } : undefined;

  const title = useMemo(() => {
    if (field === 'mealType') return t('meals.mealType');
    if (field === 'date') return t('meals.date');
    if (field === 'time') return t('meals.time');
    return '';
  }, [field, t]);

  return (
    <BottomSheet isOpen={field !== null} onOpenChange={(open) => !open && onClose()}>
      <BottomSheet.Portal>
        <BottomSheet.Overlay />
        <BottomSheet.Content>
          <View className="px-2 pb-4">
            <BottomSheet.Title>{title}</BottomSheet.Title>
            <View className="overflow-hidden mt-2">
              {field === 'mealType' && (
                <Picker
                  selectedValue={draftMeta.type}
                  onValueChange={(v) => onChange({ type: v as MealType })}
                  style={pickerStyle}
                  itemStyle={itemStyle}
                  dropdownIconColor={foregroundColor}>
                  {MEAL_TYPES.map((type) => (
                    <Picker.Item
                      key={type}
                      label={t(getMealTypeLabelKey(type))}
                      value={type}
                      color={foregroundColor}
                    />
                  ))}
                </Picker>
              )}
              {field === 'date' && (
                <Picker
                  selectedValue={draftMeta.dateKey}
                  onValueChange={(v) => onChange({ dateKey: String(v) })}
                  style={pickerStyle}
                  itemStyle={itemStyle}
                  dropdownIconColor={foregroundColor}>
                  {DATE_OPTIONS.map((d) => (
                    <Picker.Item
                      key={d}
                      label={formatDateLabel(d, locale)}
                      value={d}
                      color={foregroundColor}
                    />
                  ))}
                </Picker>
              )}
              {field === 'time' && (
                <View className="flex-row">
                  <View className="flex-1">
                    <Picker
                      selectedValue={draftMeta.hours}
                      onValueChange={(v) => onChange({ hours: Number(v) })}
                      style={pickerStyle}
                      itemStyle={itemStyle}
                      dropdownIconColor={foregroundColor}>
                      {Array.from({ length: 24 }, (_, h) => (
                        <Picker.Item
                          key={h}
                          label={String(h).padStart(2, '0')}
                          value={h}
                          color={foregroundColor}
                        />
                      ))}
                    </Picker>
                  </View>
                  <View className="flex-1">
                    <Picker
                      selectedValue={draftMeta.minutes}
                      onValueChange={(v) => onChange({ minutes: Number(v) })}
                      style={pickerStyle}
                      itemStyle={itemStyle}
                      dropdownIconColor={foregroundColor}>
                      {Array.from({ length: 60 }, (_, m) => (
                        <Picker.Item
                          key={m}
                          label={String(m).padStart(2, '0')}
                          value={m}
                          color={foregroundColor}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>
              )}
            </View>
          </View>
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
};
