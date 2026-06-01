import { SymbolView } from 'expo-symbols';
import { memo, type FC, type RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import styled, { useTheme } from 'styled-components/native';

import { ButtonIcon } from '@/components/atoms/ButtonIcon';
import { GlassPanel } from '@/components/atoms/GlassPanel';
import { Text } from '@/components/atoms/Text';
import type { Product } from '@/types/product';
import { formatDecimal } from '@/utils/format';

type ProductRowProps = {
  product: Product;
  blurTarget?: RefObject<View | null>;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
};

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const Info = styled.View`
  flex: 1;
  gap: ${({ theme }) => theme.spacing.xs}px;
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
  ({ product, blurTarget, onEdit, onDelete }) => {
    const { t } = useTranslation();
    const theme = useTheme();

    return (
      <GlassPanel blurTarget={blurTarget}>
        <Row>
          <Info>
            <Text $variant="subtitle">{product.name}</Text>
            <Text $variant="caption" $color="textSecondary">
              {t('common.carbsPer100g', { value: formatDecimal(product.carbsPer100g) })}
            </Text>
            <Text $variant="caption" $color="textSecondary">
              {t('common.usageCount', { count: product.usageCount ?? 0 })}
            </Text>
          </Info>
          <Actions>
            <ButtonIcon
              onPress={() => onEdit(product)}
              accessibilityLabel={t('products.editA11y')}>
              <SymbolView
                name={{ ios: 'pencil', android: 'edit' }}
                size={18}
                tintColor={theme.colors.textSecondary}
              />
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
