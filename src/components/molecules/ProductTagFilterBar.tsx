import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';

import { TagChip } from '@/components/molecules/tag-chip/TagChip';
import { AppChip } from '@/components/ui/AppChip';
import { PRODUCT_TAG_FILTERS } from '@/constants/product-tag-filters';
import type { ProductTag } from '@/types/productTag';

type ProductTagFilterBarProps = {
  value: ProductTag[];
  onToggle: (tag: ProductTag) => void;
  onClear: () => void;
};

export const ProductTagFilterBar: FC<ProductTagFilterBarProps> = ({
  value,
  onToggle,
  onClear,
}) => {
  const { t } = useTranslation();
  const showAll = value.length === 0;

  return (
    <ScrollView className="grow-0 mt-2" horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row gap-1 py-1">
        <AppChip
          size="sm"
          variant={showAll ? 'soft' : 'tertiary'}
          color={showAll ? 'accent' : 'default'}
          label={t('products.filterAll')}
          onPress={onClear}
          accessibilityRole="button"
          accessibilityState={{ selected: showAll }}
        />
        {PRODUCT_TAG_FILTERS.map((filter) => (
          <TagChip
            key={filter}
            tag={filter}
            variant="expanded"
            selected={value.includes(filter)}
            onPress={() => onToggle(filter)}
          />
        ))}
      </View>
    </ScrollView>
  );
};
