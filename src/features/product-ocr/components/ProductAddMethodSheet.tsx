import { BottomSheet, useThemeColor } from 'heroui-native';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FaIcon } from '@/components/atoms/FaIcon';
import { AppButton } from '@/components/ui/AppButton';
import type { ProductAddMethod } from '@/features/product-ocr/types/ocrDraft';
import type { FaIconName } from '@/constants/fontAwesome';
import { triggerImpactLight } from '@/utils/haptics';

type ProductAddMethodSheetProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (method: ProductAddMethod) => void;
};

type MethodOption = {
  method: ProductAddMethod;
  icon: FaIconName;
  titleKey: 'products.addMethod.ean' | 'products.addMethod.ocr' | 'products.addMethod.off';
  descriptionKey:
    | 'products.addMethod.eanDescription'
    | 'products.addMethod.ocrDescription'
    | 'products.addMethod.offDescription';
};

const OPTIONS: MethodOption[] = [
  {
    method: 'ean',
    icon: 'barcode',
    titleKey: 'products.addMethod.ean',
    descriptionKey: 'products.addMethod.eanDescription',
  },
  {
    method: 'ocr',
    icon: 'file-lines',
    titleKey: 'products.addMethod.ocr',
    descriptionKey: 'products.addMethod.ocrDescription',
  },
  {
    method: 'off',
    icon: 'magnifying-glass',
    titleKey: 'products.addMethod.off',
    descriptionKey: 'products.addMethod.offDescription',
  },
];

export const ProductAddMethodSheet: FC<ProductAddMethodSheetProps> = ({
  visible,
  onClose,
  onSelect,
}) => {
  const { t } = useTranslation();
  const [accentColor, mutedColor] = useThemeColor(['accent', 'muted']);
  const insets = useSafeAreaInsets();

  return (
    <BottomSheet
      isOpen={visible}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}>
      <BottomSheet.Portal>
        <BottomSheet.Overlay />
        <BottomSheet.Content
          enableDynamicSizing
          enablePanDownToClose
          keyboardBehavior="interactive">
          <View className="px-4 pb-2" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
            <Text className="text-foreground text-lg font-semibold py-3">
              {t('products.addMethod.title')}
            </Text>

            <View className="gap-1">
              {OPTIONS.map((option) => (
                <Pressable
                  key={option.method}
                  accessibilityRole="button"
                  accessibilityLabel={t(option.titleKey)}
                  onPress={() => {
                    triggerImpactLight();
                    onSelect(option.method);
                  }}
                  className="flex-row items-center gap-3 rounded-2xl px-3 py-3 active:bg-default/40">
                  <View className="h-10 w-10 items-center justify-center rounded-xl bg-accent/15">
                    <FaIcon name={option.icon} size={18} color={accentColor} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-foreground text-base font-medium">
                      {t(option.titleKey)}
                    </Text>
                    <Text className="text-muted text-sm mt-0.5">
                      {t(option.descriptionKey)}
                    </Text>
                  </View>
                  <FaIcon name="chevron-right" size={14} color={mutedColor} />
                </Pressable>
              ))}
            </View>

            <AppButton variant="tertiary" className="mt-3 self-center" onPress={onClose}>
              {t('common.cancel')}
            </AppButton>
          </View>
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
};
