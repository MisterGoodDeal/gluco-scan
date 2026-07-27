import { Card, useThemeColor } from 'heroui-native';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { FaIcon } from '@/components/atoms/FaIcon';
import { ProductImage } from '@/components/atoms/ProductImage';
import { ProductNameInlineTags } from '@/components/molecules/ProductNameInlineTags';
import { AppButton } from '@/components/ui/AppButton';
import { AppPressable } from '@/components/ui/AppPressable';
import { resolveProductImageUri } from '@/services/productImage.service';
import type { Product } from '@/types/product';
import { formatDecimal } from '@/utils/format';

type ProductRowProps = {
  product: Product;
  compact?: boolean;
  onEdit: (product: Product) => void;
};

type RowEditButtonProps = {
  iconSize: number;
  onEdit: () => void;
};

const RowEditButton: FC<RowEditButtonProps> = ({ iconSize, onEdit }) => {
  const { t } = useTranslation();
  const [mutedColor] = useThemeColor(['muted']);

  return (
    <AppButton
      isIconOnly
      size="sm"
      variant="ghost"
      onPress={onEdit}
      accessibilityLabel={t('products.editA11y')}>
      <FaIcon name="pen" size={iconSize} color={mutedColor} />
    </AppButton>
  );
};

export const ProductRow: FC<ProductRowProps> = ({ product, compact = false, onEdit }) => {
    const { t } = useTranslation();
    const carbsLabel = t('common.carbsPer100g', { value: formatDecimal(product.carbsPer100g) });
    const resolvedImageUri = resolveProductImageUri(product.imageUrl);

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
                <ProductNameInlineTags
                  name={product.name}
                  tags={product.tags}
                  lines={1}
                  className="text-foreground text-base shrink"
                />
                <Text className="text-muted text-xs" numberOfLines={1}>
                  {carbsLabel}
                </Text>
              </View>
            </AppPressable>
            <RowEditButton iconSize={16} onEdit={() => onEdit(product)} />
          </View>
        </Card>
      );
    }

    const showImage = resolvedImageUri != null;

    return (
      <Card className="p-4">
        <View className="flex-row items-center gap-2">
          {showImage && <ProductImage uri={product.imageUrl} />}
          <AppPressable
            className="flex-1 min-w-0"
            onPress={() => onEdit(product)}
            accessibilityRole="button"
            accessibilityLabel={t('products.editA11y')}>
            <View className="gap-1 min-w-0">
              <ProductNameInlineTags name={product.name} tags={product.tags} lines={2} />
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
          <RowEditButton iconSize={18} onEdit={() => onEdit(product)} />
        </View>
      </Card>
    );
  };
