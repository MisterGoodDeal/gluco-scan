import { Select } from 'heroui-native';
import { type FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { TagIcon } from '@/components/atoms/TagIcon';
import { TagChipList } from '@/components/molecules/tag-chip/TagChipList';
import { AppSelect } from '@/components/ui/AppSelect';
import { ALL_PRODUCT_TAGS, type ProductTag } from '@/types/productTag';
import { getTagMetadata } from '@/utils/tags/getTagMetadata';
import { sortProductTags } from '@/utils/tags/sortProductTags';

type ProductTagPickerProps = {
  value: ProductTag[];
  onChange: (tags: ProductTag[]) => void;
};

export const ProductTagPicker: FC<ProductTagPickerProps> = ({ value, onChange }) => {
  const { t } = useTranslation();

  const options = useMemo(
    () =>
      ALL_PRODUCT_TAGS.map((tag) => ({
        value: tag,
        label: t(getTagMetadata(tag).translationKey),
      })),
    [t],
  );

  const selected = useMemo(
    () =>
      sortProductTags(value).map((tag) => ({
        value: tag,
        label: t(getTagMetadata(tag).translationKey),
      })),
    [t, value],
  );

  return (
    <View className="gap-1">
      <AppSelect
        selectionMode="multiple"
        value={selected}
        onValueChange={(next) => onChange(next.map((option) => option.value as ProductTag))}
        options={options}
        placeholder={t('products.tagsPlaceholder')}
        listLabel={t('products.tagsSection')}
        scrollable
        renderItem={(option, isSelected) => (
          <>
            <View className="flex-row items-center gap-2 flex-1">
              <TagIcon tag={option.value as ProductTag} size={20} />
              <Select.ItemLabel />
            </View>
            {isSelected ? <Select.ItemIndicator /> : null}
          </>
        )}
      />
      {value.length > 0 ? <TagChipList tags={value} variant="compact" /> : null}
    </View>
  );
};
