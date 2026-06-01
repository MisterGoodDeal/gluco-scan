import { type FC, type RefObject } from 'react';
import { FlatList, View } from 'react-native';
import styled from 'styled-components/native';

import { GlassPanel } from '@/components/atoms/GlassPanel';
import { Text } from '@/components/atoms/Text';
import { CachedProductRow } from '@/components/molecules/CachedProductRow';
import type { Product } from '@/types/product';
import { hp } from '@/utils/screen';

type ProductLibraryListProps = {
  products: Product[];
  blurTarget?: RefObject<View | null>;
  onEdit: (product: Product) => void;
  onAddToMeal: (product: Product) => void;
  onDelete: (ean: string) => void;
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

export const ProductLibraryList: FC<ProductLibraryListProps> = ({
  products,
  blurTarget,
  onEdit,
  onAddToMeal,
  onDelete,
}) => {
  if (products.length === 0) {
    return (
      <ListContainer>
        <EmptyContainer>
          <GlassPanel blurTarget={blurTarget}>
            <Text $variant="body" $color="textSecondary" style={{ textAlign: 'center' }}>
              Aucun produit en cache.{'\n'}Scannez ou ajoutez-en un manuellement.
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
        keyExtractor={(item) => item.ean}
        renderItem={({ item }) => (
          <CachedProductRow
            product={item}
            blurTarget={blurTarget}
            onEdit={onEdit}
            onAddToMeal={onAddToMeal}
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
