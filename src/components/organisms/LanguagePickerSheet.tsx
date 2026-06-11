import { Picker } from '@react-native-picker/picker';
import { BottomSheet, useThemeColor } from 'heroui-native';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, View } from 'react-native';

import { getLanguageLabelKey, type SupportedLocale, supportedLocales } from '@/i18n';

type LanguagePickerSheetProps = {
  visible: boolean;
  locale: SupportedLocale;
  onSelect: (locale: SupportedLocale) => void;
  onClose: () => void;
};

export const LanguagePickerSheet: FC<LanguagePickerSheetProps> = ({
  visible,
  locale,
  onSelect,
  onClose,
}) => {
  const { t } = useTranslation();
  const foregroundColor = useThemeColor('foreground');

  return (
    <BottomSheet isOpen={visible} onOpenChange={(open) => !open && onClose()}>
      <BottomSheet.Portal>
        <BottomSheet.Overlay />
        <BottomSheet.Content>
          <View className="px-2 pb-4">
            <BottomSheet.Title>{t('settings.language')}</BottomSheet.Title>
            <View className="overflow-hidden mt-2">
              <Picker
                selectedValue={locale}
                onValueChange={(value) => onSelect(value as SupportedLocale)}
                style={{ color: foregroundColor, backgroundColor: 'transparent' }}
                itemStyle={
                  Platform.OS === 'ios' ? { color: foregroundColor, fontSize: 18 } : undefined
                }
                dropdownIconColor={foregroundColor}>
                {supportedLocales.map((code) => (
                  <Picker.Item
                    key={code}
                    label={t(getLanguageLabelKey(code))}
                    value={code}
                    color={foregroundColor}
                  />
                ))}
              </Picker>
            </View>
          </View>
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
};
