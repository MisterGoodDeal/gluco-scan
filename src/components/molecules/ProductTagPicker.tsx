import { type FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { PickerField } from '@/components/atoms/PickerField';
import { TagChipList } from '@/components/molecules/tag-chip/TagChipList';
import { TagPickerSheet } from '@/components/organisms/TagPickerSheet';
import type { ProductTag } from '@/types/productTag';
import { getTagMetadata } from '@/utils/tags/getTagMetadata';
import { sortProductTags } from '@/utils/tags/sortProductTags';

type ProductTagPickerProps = {
  value: ProductTag[];
  onChange: (tags: ProductTag[]) => void;
};

export const ProductTagPicker: FC<ProductTagPickerProps> = ({ value, onChange }) => {
  const { t } = useTranslation();
  const [sheetVisible, setSheetVisible] = useState(false);

  const fieldLabel = useMemo(() => {
    if (value.length === 0) return t('products.tagsPlaceholder');
    return sortProductTags(value)
      .map((tag) => t(getTagMetadata(tag).translationKey))
      .join(', ');
  }, [t, value]);

  return (
    <>
      <View className="gap-1">
        <PickerField
          value={fieldLabel}
          onPress={() => setSheetVisible(true)}
          accessibilityLabel={t('products.tagsSection')}
        />
        {value.length > 0 ? <TagChipList tags={value} variant="compact" /> : null}
      </View>
      <TagPickerSheet
        visible={sheetVisible}
        value={value}
        onChange={onChange}
        onClose={() => setSheetVisible(false)}
      />
    </>
  );
};
