import { type FC, type RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, View } from 'react-native';
import styled from 'styled-components/native';

import { GlassPanel } from '@/components/atoms/GlassPanel';
import { Text } from '@/components/atoms/Text';
import { ProductRow } from '@/components/molecules/ProductRow';
import type { Product } from '@/types/product';
import { hp } from '@/utils/screen';

type ProductListProps = {
  products: Product[];
  blurTarget?: RefObject<View | null>;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
};

const ListContainer = styled.View`
  flex: 1;
  padding: 0 ${({ theme }) => theme.spacing.md}px;
`;

const EmptyContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl}px;
`;

const Separator = styled.View`
  height: ${hp('1.5%')}px;
`;

export const ProductList: FC<ProductListProps> = ({
  products,
  blurTarget,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();

  if (products.length === 0) {
    return (
      <ListContainer>
        <EmptyContainer>
          <GlassPanel blurTarget={blurTarget}>
            <Text $variant="body" $color="textSecondary" style={{ textAlign: 'center' }}>
              {t('products.emptyList')}
            </Text>
          </GlassPanel>
        </EmptyContainer>
      </ListContainer>
    );
  }

  return (
    <ListContainer>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductRow
            product={item}
            blurTarget={blurTarget}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
        ItemSeparatorComponent={Separator}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: hp('4%') }}
      />
    </ListContainer>
  );
};
