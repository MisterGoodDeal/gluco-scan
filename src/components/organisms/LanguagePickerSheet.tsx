import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { Picker } from '@react-native-picker/picker';
import { type ComponentProps, type FC, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { useTheme } from 'styled-components/native';

import { Text } from '@/components/atoms/Text';
import { getBottomSheetBlurProps } from '@/components/navigation/BottomSheetBlurBackground';
import { getLanguageLabelKey, type SupportedLocale, supportedLocales } from '@/i18n';
import type { AppTheme } from '@/styles/theme';
import { getPickerColors, getPickerItemStyle, getPickerStyle } from '@/utils/picker';

type LanguagePickerSheetProps = {
  visible: boolean;
  locale: SupportedLocale;
  onSelect: (locale: SupportedLocale) => void;
  onClose: () => void;
};

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

export const LanguagePickerSheet: FC<LanguagePickerSheetProps> = ({
  visible,
  locale,
  onSelect,
  onClose,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const snapPoints = useMemo(() => ['36%'], []);
  const { style, itemStyle, dropdownIconColor, itemColor } = pickerProps(theme);

  const renderBackdrop = useCallback(
    (props: ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
    ),
    [],
  );

  if (!visible) return null;

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
          <Text $variant="subtitle">{t('settings.language')}</Text>
        </SheetHeader>
        <PickerWrap>
          <Picker
            selectedValue={locale}
            onValueChange={(value) => onSelect(value as SupportedLocale)}
            style={style}
            itemStyle={itemStyle}
            dropdownIconColor={dropdownIconColor}>
            {supportedLocales.map((code) => (
              <Picker.Item
                key={code}
                label={t(getLanguageLabelKey(code))}
                value={code}
                color={itemColor}
              />
            ))}
          </Picker>
        </PickerWrap>
      </BottomSheetView>
    </BottomSheet>
  );
};
