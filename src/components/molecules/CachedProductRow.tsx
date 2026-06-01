import { SymbolView } from 'expo-symbols';
import { memo, type FC, type RefObject } from 'react';
import { View } from 'react-native';
import styled, { useTheme } from 'styled-components/native';

import { ButtonIcon } from '@/components/atoms/ButtonIcon';
import { GlassPanel } from '@/components/atoms/GlassPanel';
import { Text } from '@/components/atoms/Text';
import type { Product } from '@/types/product';
import { formatDecimal } from '@/utils/format';

type CachedProductRowProps = {
  product: Product;
  blurTarget?: RefObject<View | null>;
  onAddToMeal: (product: Product) => void;
  onDelete: (ean: string) => void;
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

export const CachedProductRow: FC<CachedProductRowProps> = memo(
  ({ product, blurTarget, onAddToMeal, onDelete }) => {
    const theme = useTheme();

    return (
      <GlassPanel blurTarget={blurTarget}>
        <Row>
          <Info>
            <Text $variant="subtitle">{product.name}</Text>
            <Text $variant="caption" $color="textSecondary">
              EAN {product.ean}
            </Text>
            <Text $variant="caption" $color="accent">
              {formatDecimal(product.carbsPer100g)} g / 100g
            </Text>
          </Info>
          <Actions>
            <ButtonIcon
              onPress={() => onAddToMeal(product)}
              accessibilityLabel="Ajouter au repas">
              <SymbolView
                name={{ ios: 'fork.knife', android: 'dining' }}
                size={20}
                tintColor={theme.colors.accent}
              />
            </ButtonIcon>
            <ButtonIcon onPress={() => onDelete(product.ean)} accessibilityLabel="Supprimer">
              <ActionLabel $color="error">×</ActionLabel>
            </ButtonIcon>
          </Actions>
        </Row>
      </GlassPanel>
    );
  },
);

CachedProductRow.displayName = 'CachedProductRow';
