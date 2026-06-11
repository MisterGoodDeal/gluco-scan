import { Dialog, useThemeColor } from 'heroui-native';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';

import { FaIcon } from '@/components/atoms/FaIcon';
import { TagIcon } from '@/components/atoms/TagIcon';
import { AppPressable } from '@/components/ui/AppPressable';
import { ALL_PRODUCT_TAGS, type ProductTag } from '@/types/productTag';
import { getTagMetadata } from '@/utils/tags/getTagMetadata';

type TagPickerSheetProps = {
  visible: boolean;
  value: ProductTag[];
  onChange: (tags: ProductTag[]) => void;
  onClose: () => void;
};

export const TagPickerSheet: FC<TagPickerSheetProps> = ({
  visible,
  value,
  onChange,
  onClose,
}) => {
  const { t } = useTranslation();
  const accentColor = useThemeColor('accent');

  const toggleTag = (tag: ProductTag) => {
    if (value.includes(tag)) {
      onChange(value.filter((entry) => entry !== tag));
      return;
    }
    onChange([...value, tag]);
  };

  return (
    <Dialog isOpen={visible} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Close />
          <Dialog.Title className="mb-2">{t('products.tagsSection')}</Dialog.Title>
          <ScrollView className="max-h-[360px]" showsVerticalScrollIndicator={false}>
            {ALL_PRODUCT_TAGS.map((tag, index) => {
              const metadata = getTagMetadata(tag);
              const selected = value.includes(tag);
              const label = t(metadata.translationKey);

              return (
                <AppPressable
                  key={tag}
                  className={`flex-row items-center gap-2 py-2 ${
                    index === ALL_PRODUCT_TAGS.length - 1 ? '' : 'border-b border-separator'
                  }`}
                  onPress={() => toggleTag(tag)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: selected }}
                  accessibilityLabel={label}>
                  <TagIcon tag={tag} size={20} />
                  <View className="flex-1">
                    <Text className="text-foreground text-base">{label}</Text>
                  </View>
                  {selected ? (
                    <View pointerEvents="none">
                      <FaIcon name="check" size={18} color={accentColor} />
                    </View>
                  ) : null}
                </AppPressable>
              );
            })}
          </ScrollView>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};
