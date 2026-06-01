import { memo, type FC, type RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import styled from 'styled-components/native';

import { ButtonIcon } from '@/components/atoms/ButtonIcon';
import { GlassPanel } from '@/components/atoms/GlassPanel';
import { Text } from '@/components/atoms/Text';
import { CarbInputGroup } from '@/components/molecules/CarbInputGroup';
import { getItemCarbs } from '@/hooks/useCarbCalculator';
import type { ScannedItem } from '@/types/scannedItem';
import { formatDecimal } from '@/utils/format';

type ScannedProductRowProps = {
  item: ScannedItem;
  blurTarget?: RefObject<View | null>;
  onGramsChange: (id: string, grams: number) => void;
  onRemove: (id: string) => void;
};

const Header = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const ProductInfo = styled.View`
  flex: 1;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const DeleteLabel = styled(Text)`
  font-size: 18px;
  line-height: 20px;
`;

export const ScannedProductRow: FC<ScannedProductRowProps> = memo(
  ({ item, blurTarget, onGramsChange, onRemove }) => {
    const { t } = useTranslation();
    const itemCarbs = getItemCarbs(item);

    return (
      <GlassPanel blurTarget={blurTarget}>
        <Header>
          <ProductInfo>
            <Text $variant="subtitle">{item.product.name}</Text>
            <Text $variant="caption" $color="textSecondary">
              {t('common.carbsPer100g', { value: formatDecimal(item.product.carbsPer100g) })}
            </Text>
          </ProductInfo>
          <ButtonIcon
            onPress={() => onRemove(item.id)}
            accessibilityLabel={t('scanner.removeProductA11y')}>
            <DeleteLabel $color="error">×</DeleteLabel>
          </ButtonIcon>
        </Header>
        <CarbInputGroup
          grams={item.grams}
          carbs={itemCarbs}
          onGramsChange={(grams) => onGramsChange(item.id, grams)}
        />
      </GlassPanel>
    );
  },
);

ScannedProductRow.displayName = 'ScannedProductRow';
