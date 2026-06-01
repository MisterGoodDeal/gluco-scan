import { type FC, type RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, RefreshControl, View } from 'react-native';
import { useTheme } from 'styled-components/native';
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
  refreshing?: boolean;
  onRefresh?: () => void;
};

const ListContainer = styled.View`
  flex: 1;
  padding: 0 ${({ theme }) => theme.spacing.md}px;
`;

const EmptyContainer = styled.View`
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl}px;
  min-height: ${hp('30%')}px;
`;

const Separator = styled.View`
  height: ${hp('1.5%')}px;
`;

export const ProductList: FC<ProductListProps> = ({
  products,
  blurTarget,
  onEdit,
  onDelete,
  refreshing = false,
  onRefresh,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const refreshControl =
    onRefresh != null ? (
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        tintColor={theme.colors.accent}
        colors={[theme.colors.accent]}
        progressBackgroundColor={theme.colors.background}
      />
    ) : undefined;

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
        contentContainerStyle={
          products.length === 0 ? { flexGrow: 1 } : { paddingBottom: hp('4%') }
        }
        refreshControl={refreshControl}
        ListEmptyComponent={
          <EmptyContainer>
            <GlassPanel blurTarget={blurTarget}>
              <Text $variant="body" $color="textSecondary" style={{ textAlign: 'center' }}>
                {t('products.emptyList')}
              </Text>
            </GlassPanel>
          </EmptyContainer>
        }
      />
    </ListContainer>
  );
};
