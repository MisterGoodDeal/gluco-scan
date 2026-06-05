import { type FC } from 'react';
import { ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

import { TagChip } from '@/components/molecules/tag-chip/TagChip';
import { Text } from '@/components/atoms/Text';
import {
  PRODUCT_TAG_FILTERS,
  type ProductTagFilter,
} from '@/constants/product-tag-filters';

type ProductTagFilterBarProps = {
  value: ProductTagFilter;
  onChange: (filter: ProductTagFilter) => void;
};

const Bar = styled(ScrollView)`
  flex-grow: 0;
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

export const ProductTagFilterBar: FC<ProductTagFilterBarProps> = ({ value, onChange }) => {
  const { t } = useTranslation();

  return (
    <Bar horizontal showsHorizontalScrollIndicator={false}>
      <Row>
        <AllChip
          $selected={value === 'all'}
          onPress={() => onChange('all')}
          accessibilityRole="button"
          accessibilityState={{ selected: value === 'all' }}>
          <Text
            $variant="caption"
            $color={value === 'all' ? 'accent' : 'textSecondary'}
            style={{ fontWeight: value === 'all' ? '600' : '500' }}>
            {t('products.filterAll')}
          </Text>
        </AllChip>
        {PRODUCT_TAG_FILTERS.filter((filter) => filter !== 'all').map((filter) => (
          <TagChip
            key={filter}
            tag={filter}
            variant="expanded"
            selected={value === filter}
            onPress={() => onChange(filter)}
          />
        ))}
      </Row>
    </Bar>
  );
};
