import { Select, useThemeColor } from 'heroui-native';
import { type FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { FaIcon } from '@/components/atoms/FaIcon';
import { TagIcon } from '@/components/atoms/TagIcon';
import { AppButton } from '@/components/ui/AppButton';
import {
  APP_SELECT_DIALOG_ICON_BUTTON_CLASS,
  AppSelect,
} from '@/components/ui/AppSelect';
import { PRODUCT_TAG_FILTERS } from '@/constants/product-tag-filters';
import type { ProductTag } from '@/types/productTag';
import { getTagMetadata } from '@/utils/tags/getTagMetadata';
import { sortProductTags } from '@/utils/tags/sortProductTags';

type ProductTagFilterBarProps = {
  value: ProductTag[];
  onChange: (tags: ProductTag[]) => void;
  embedded?: boolean;
};

export const ProductTagFilterBar: FC<ProductTagFilterBarProps> = ({
  value,
  onChange,
  embedded = false,
}) => {
  const { t } = useTranslation();
  const [accentColor, mutedColor] = useThemeColor(['accent', 'muted']);

  const options = useMemo(
    () =>
      PRODUCT_TAG_FILTERS.map((tag) => ({
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

  const filterA11y =
    value.length > 0
      ? t('products.filterActiveA11y', { count: value.length })
      : t('products.filterLabel');

  const clearFilters = () => onChange([]);

  return (
    <AppSelect
      selectionMode="multiple"
      value={selected}
      onValueChange={(next) =>
        onChange(next.map((option) => option.value as ProductTag))
      }
      options={options}
      placeholder={t('products.filterPlaceholder')}
      listLabel={t('products.filterLabel')}
      scrollable
      trigger={
        <AppButton
          isIconOnly
          size={embedded ? 'sm' : undefined}
          variant={embedded ? 'ghost' : 'tertiary'}
          haptic={false}
          accessibilityLabel={filterA11y}
          accessibilityState={{ selected: value.length > 0 }}>
          <FaIcon
            name="tag"
            size={embedded ? 18 : 20}
            color={value.length > 0 ? accentColor : mutedColor}
          />
        </AppButton>
      }
      additionalButton={
        value.length > 0 ? (
          <AppButton
            isIconOnly
            variant="tertiary"
            size="sm"
            className={APP_SELECT_DIALOG_ICON_BUTTON_CLASS}
            onPress={clearFilters}
            accessibilityLabel={t('products.filterResetA11y')}>
            <FaIcon name="arrows-rotate" size={18} color={mutedColor} />
          </AppButton>
        ) : undefined
      }
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
  );
};
