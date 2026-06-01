import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { Picker } from '@react-native-picker/picker';
import { type ComponentProps, type FC, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import styled, { useTheme } from 'styled-components/native';

import { Text } from '@/components/atoms/Text';
import { getCurrentLocale } from '@/i18n';
import type { AppTheme } from '@/styles/theme';
import type { MealDraftMeta } from '@/store/meal.store';
import { MEAL_TYPES, MealType } from '@/types/mealType';
import { addDays, formatDateLabel, toDateKey } from '@/utils/date';
import { getMealTypeLabelKey } from '@/utils/mealType';
import { getBottomSheetBlurProps } from '@/components/navigation/BottomSheetBlurBackground';
import { getPickerColors, getPickerItemStyle, getPickerStyle } from '@/utils/picker';

export type MealMetaPickerField = 'mealType' | 'date' | 'time';

type MealMetaPickerSheetProps = {
  field: MealMetaPickerField | null;
  draftMeta: MealDraftMeta;
  onChange: (meta: Partial<MealDraftMeta>) => void;
  onClose: () => void;
};

const DATE_OPTIONS = Array.from({ length: 14 }, (_, i) => addDays(toDateKey(new Date()), i - 7));

const SheetHeader = styled.View`
  padding: ${({ theme }) => theme.spacing.md}px ${({ theme }) => theme.spacing.lg}px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.glass.border};
`;

const PickerWrap = styled.View`
  overflow: hidden;
`;

const pickerProps = (theme: AppTheme) => {
  const colors = getPickerColors(theme);
  return {
    style: getPickerStyle(theme),
    itemStyle: getPickerItemStyle(theme),
    dropdownIconColor: colors.text,
    itemColor: colors.text,
  };
};

export const MealMetaPickerSheet: FC<MealMetaPickerSheetProps> = ({
  field,
  draftMeta,
  onChange,
  onClose,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const locale = getCurrentLocale();
  const snapPoints = useMemo(() => ['42%'], []);
  const { style, itemStyle, dropdownIconColor, itemColor } = pickerProps(theme);

  const renderBackdrop = useCallback(
    (props: ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
    ),
    [],
  );

  const title = useMemo(() => {
    if (field === 'mealType') return t('meals.mealType');
    if (field === 'date') return t('meals.date');
    if (field === 'time') return t('meals.time');
    return '';
  }, [field, t]);

  if (!field) return null;

  return (
    <BottomSheet
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={onClose}
      backdropComponent={renderBackdrop}
      {...getBottomSheetBlurProps(theme)}>
      <BottomSheetView style={{ flex: 1 }}>
        <SheetHeader>
          <Text $variant="subtitle">{title}</Text>
        </SheetHeader>
        <PickerWrap>
          {field === 'mealType' && (
            <Picker
              selectedValue={draftMeta.type}
              onValueChange={(v) => onChange({ type: v as MealType })}
              style={style}
              itemStyle={itemStyle}
              dropdownIconColor={dropdownIconColor}>
              {MEAL_TYPES.map((type) => (
                <Picker.Item
                  key={type}
                  label={t(getMealTypeLabelKey(type))}
                  value={type}
                  color={itemColor}
                />
              ))}
            </Picker>
          )}
          {field === 'date' && (
            <Picker
              selectedValue={draftMeta.dateKey}
              onValueChange={(v) => onChange({ dateKey: String(v) })}
              style={style}
              itemStyle={itemStyle}
              dropdownIconColor={dropdownIconColor}>
              {DATE_OPTIONS.map((d) => (
                <Picker.Item
                  key={d}
                  label={formatDateLabel(d, locale)}
                  value={d}
                  color={itemColor}
                />
              ))}
            </Picker>
          )}
          {field === 'time' && (
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1 }}>
              <Picker
                selectedValue={draftMeta.hours}
                onValueChange={(v) => onChange({ hours: Number(v) })}
                style={style}
                itemStyle={itemStyle}
                dropdownIconColor={dropdownIconColor}>
                {Array.from({ length: 24 }, (_, h) => (
                  <Picker.Item
                    key={h}
                    label={String(h).padStart(2, '0')}
                    value={h}
                    color={itemColor}
                  />
                ))}
              </Picker>
              </View>
              <View style={{ flex: 1 }}>
              <Picker
                selectedValue={draftMeta.minutes}
                onValueChange={(v) => onChange({ minutes: Number(v) })}
                style={style}
                itemStyle={itemStyle}
                dropdownIconColor={dropdownIconColor}>
                {Array.from({ length: 60 }, (_, m) => (
                  <Picker.Item
                    key={m}
                    label={String(m).padStart(2, '0')}
                    value={m}
                    color={itemColor}
                  />
                ))}
              </Picker>
              </View>
            </View>
          )}
        </PickerWrap>
      </BottomSheetView>
    </BottomSheet>
  );
};
