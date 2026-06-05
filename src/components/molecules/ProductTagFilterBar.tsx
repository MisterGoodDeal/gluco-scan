import { type FC } from 'react';
import { ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

import { TagChip } from '@/components/molecules/tag-chip/TagChip';
import { Text } from '@/components/atoms/Text';
import { PRODUCT_TAG_FILTERS } from '@/constants/product-tag-filters';
import type { ProductTag } from '@/types/productTag';

type ProductTagFilterBarProps = {
  value: ProductTag[];
  onToggle: (tag: ProductTag) => void;
  onClear: () => void;
};

const Bar = styled(ScrollView)`
  flex-grow: 0;
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

const Row = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.xs}px;
  padding-vertical: ${({ theme }) => theme.spacing.xs}px;
`;

const AllChip = styled.Pressable<{ $selected?: boolean }>`
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border-width: 1px;
  border-color: ${({ theme, $selected }) =>
    $selected ? theme.colors.accent : theme.colors.glass.border};
  background-color: ${({ theme, $selected }) =>
    $selected ? theme.colors.accentMuted : theme.colors.glass.background};
`;

export const ProductTagFilterBar: FC<ProductTagFilterBarProps> = ({
  value,
  onToggle,
  onClear,
}) => {
  const { t } = useTranslation();
  const showAll = value.length === 0;

  return (
    <Bar horizontal showsHorizontalScrollIndicator={false}>
      <Row>
        <AllChip
          $selected={showAll}
          onPress={onClear}
          accessibilityRole="button"
          accessibilityState={{ selected: showAll }}>
          <Text
            $variant="caption"
            $color={showAll ? 'accent' : 'textSecondary'}
            style={{ fontWeight: showAll ? '600' : '500' }}>
            {t('products.filterAll')}
          </Text>
        </AllChip>
        {PRODUCT_TAG_FILTERS.map((filter) => (
          <TagChip
            key={filter}
            tag={filter}
            variant="expanded"
            selected={value.includes(filter)}
            onPress={() => onToggle(filter)}
          />
        ))}
      </Row>
    </Bar>
  );
};
