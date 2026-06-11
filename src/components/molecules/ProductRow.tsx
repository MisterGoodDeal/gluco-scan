import { Card, useThemeColor } from 'heroui-native';
import { memo, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { FaIcon } from '@/components/atoms/FaIcon';
import { ProductImage } from '@/components/atoms/ProductImage';
import { TagChipList } from '@/components/molecules/tag-chip/TagChipList';
import { AppButton } from '@/components/ui/AppButton';
import { AppPressable } from '@/components/ui/AppPressable';
import { resolveProductImageUri } from '@/services/productImage.service';
import type { Product } from '@/types/product';
import { formatDecimal } from '@/utils/format';

type ProductRowProps = {
  product: Product;
  compact?: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
};

type RowActionsProps = {
  iconSize: number;
  onEdit: () => void;
  onDelete: () => void;
};

const RowActions: FC<RowActionsProps> = ({ iconSize, onEdit, onDelete }) => {
  const { t } = useTranslation();
  const [mutedColor, dangerColor] = useThemeColor(['muted', 'danger']);

  return (
    <View className="flex-row items-center gap-1">
      <AppButton
        isIconOnly
        size="sm"
        variant="ghost"
        onPress={onEdit}
        accessibilityLabel={t('products.editA11y')}>
        <FaIcon name="pen" size={iconSize} color={mutedColor} />
      </AppButton>
      <AppButton
        isIconOnly
        size="sm"
        variant="ghost"
        onPress={onDelete}
        accessibilityLabel={t('products.deleteA11y')}>
        <FaIcon name="xmark" size={iconSize} color={dangerColor} />
      </AppButton>
    </View>
  );
};

export const ProductRow: FC<ProductRowProps> = memo(
  ({ product, compact = false, onEdit, onDelete }) => {
    const { t } = useTranslation();
    const carbsLabel = t('common.carbsPer100g', { value: formatDecimal(product.carbsPer100g) });

    if (compact) {
      return (
        <Card className="px-3 py-2">
          <View className="flex-row items-center gap-2">
            <AppPressable
              className="flex-1 min-w-0"
              onPress={() => onEdit(product)}
              accessibilityRole="button"
              accessibilityLabel={t('products.editA11y')}>
              <View className="flex-row items-center gap-1 min-w-0">
                <Text className="text-foreground text-base shrink" numberOfLines={1}>
                  {product.name}
                </Text>
                <TagChipList tags={product.tags} variant="compact" />
                <Text className="text-muted text-xs" numberOfLines={1}>
                  {carbsLabel}
                </Text>
              </View>
            </AppPressable>
            <RowActions
              iconSize={16}
              onEdit={() => onEdit(product)}
              onDelete={() => onDelete(product.id)}
            />
          </View>
        </Card>
      );
    }

    const showImage = resolveProductImageUri(product.imageUrl) != null;

    return (
      <Card className="p-4">
        <View className="flex-row items-center gap-2">
          {showImage && <ProductImage uri={product.imageUrl} />}
          <AppPressable
            className="flex-1"
            onPress={() => onEdit(product)}
            accessibilityRole="button"
            accessibilityLabel={t('products.editA11y')}>
            <View className="gap-1">
              <Text className="text-foreground text-base font-semibold">{product.name}</Text>
              <TagChipList tags={product.tags} variant="compact" />
              <Text className="text-muted text-xs">{carbsLabel}</Text>
              {product.eans.length > 0 && (
                <Text className="text-muted text-xs">
                  {product.eans.length === 1
                    ? t('common.ean', { ean: product.eans[0] })
                    : t('products.eanCount', { count: product.eans.length })}
                </Text>
              )}
              <Text className="text-muted text-xs">
                {t('common.usageCount', { count: product.usageCount ?? 0 })}
              </Text>
            </View>
          </AppPressable>
          <RowActions
            iconSize={18}
            onEdit={() => onEdit(product)}
            onDelete={() => onDelete(product.id)}
          />
        </View>
      </Card>
    );
  },
);

ProductRow.displayName = 'ProductRow';
