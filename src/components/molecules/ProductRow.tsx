import { SymbolView } from 'expo-symbols';
import { memo, type FC, type RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import styled, { useTheme } from 'styled-components/native';

import { ButtonIcon } from '@/components/atoms/ButtonIcon';
import { GlassPanel } from '@/components/atoms/GlassPanel';
import { ProductImage } from '@/components/atoms/ProductImage';
import { resolveProductImageUri } from '@/services/productImage.service';
import { Text } from '@/components/atoms/Text';
import type { Product } from '@/types/product';
import { formatDecimal } from '@/utils/format';

type ProductRowProps = {
  product: Product;
  compact?: boolean;
  blurTarget?: RefObject<View | null>;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
};

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const Info = styled(Pressable)`
  flex: 1;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const CompactInfo = styled(Pressable)`
  flex: 1;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  min-width: 0;
`;

const Actions = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const ActionLabel = styled(Text)`
  font-size: 18px;
  line-height: 20px;
`;

export const ProductRow: FC<ProductRowProps> = memo(
  ({ product, compact = false, blurTarget, onEdit, onDelete }) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const carbsLabel = t('common.carbsPer100g', { value: formatDecimal(product.carbsPer100g) });

    if (compact) {
      return (
        <GlassPanel
          blurTarget={blurTarget}
          padding={theme.spacing.sm}
          borderRadius={theme.radius.sm}>
          <Row>
            <CompactInfo
              onPress={() => onEdit(product)}
              accessibilityRole="button"
              accessibilityLabel={t('products.editA11y')}>
              <Text $variant="body" numberOfLines={1} style={{ flexShrink: 1 }}>
                {product.name}
              </Text>
              <Text $variant="caption" $color="textSecondary" numberOfLines={1}>
                {carbsLabel}
              </Text>
            </CompactInfo>
            <Actions>
              <ButtonIcon
                onPress={() => onEdit(product)}
                accessibilityLabel={t('products.editA11y')}>
                <View pointerEvents="none">
                  <SymbolView
                    name={{ ios: 'pencil', android: 'edit' }}
                    size={16}
                    tintColor={theme.colors.textSecondary}
                  />
                </View>
              </ButtonIcon>
              <ButtonIcon
                onPress={() => onDelete(product.id)}
                accessibilityLabel={t('products.deleteA11y')}>
                <ActionLabel $color="error">×</ActionLabel>
              </ButtonIcon>
            </Actions>
          </Row>
        </GlassPanel>
      );
    }

    const showImage = resolveProductImageUri(product.imageUrl) != null;

    return (
      <GlassPanel blurTarget={blurTarget}>
        <Row>
          {showImage && <ProductImage uri={product.imageUrl} />}
          <Info
            onPress={() => onEdit(product)}
            accessibilityRole="button"
            accessibilityLabel={t('products.editA11y')}>
            <Text $variant="subtitle">{product.name}</Text>
            <Text $variant="caption" $color="textSecondary">
              {carbsLabel}
            </Text>
            {product.eans.length > 0 && (
              <Text $variant="caption" $color="textSecondary">
                {product.eans.length === 1
                  ? t('common.ean', { ean: product.eans[0] })
                  : t('products.eanCount', { count: product.eans.length })}
              </Text>
            )}
            <Text $variant="caption" $color="textSecondary">
              {t('common.usageCount', { count: product.usageCount ?? 0 })}
            </Text>
          </Info>
          <Actions>
            <ButtonIcon
              onPress={() => onEdit(product)}
              accessibilityLabel={t('products.editA11y')}>
              <View pointerEvents="none">
                <SymbolView
                  name={{ ios: 'pencil', android: 'edit' }}
                  size={18}
                  tintColor={theme.colors.textSecondary}
                />
              </View>
            </ButtonIcon>
            <ButtonIcon
              onPress={() => onDelete(product.id)}
              accessibilityLabel={t('products.deleteA11y')}>
              <ActionLabel $color="error">×</ActionLabel>
            </ButtonIcon>
          </Actions>
        </Row>
      </GlassPanel>
    );
  },
);

ProductRow.displayName = 'ProductRow';
