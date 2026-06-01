import { type FC, type RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, RefreshControl, View } from 'react-native';
import { useTheme } from 'styled-components/native';
import styled from 'styled-components/native';

import { GlassPanel } from '@/components/atoms/GlassPanel';
import { Text } from '@/components/atoms/Text';
import { ProductRow } from '@/components/molecules/ProductRow';
import { useTabBarBottomInset } from '@/hooks/useTabBarBottomInset';
import type { Product } from '@/types/product';
import { hp } from '@/utils/screen';

type ProductListProps = {
  products: Product[];
  compact?: boolean;
  blurTarget?: RefObject<View | null>;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  refreshing?: boolean;
  onRefresh?: () => void;
  contentInsetTop?: number;
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

const Separator = styled.View<{ $compact?: boolean }>`
  height: ${({ theme, $compact }) => ($compact ? theme.spacing.xs : hp('1.5%'))}px;
`;

export const ProductList: FC<ProductListProps> = ({
  products,
  compact = false,
  blurTarget,
  onEdit,
  onDelete,
  refreshing = false,
  onRefresh,
  contentInsetTop = 0,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const tabBarInset = useTabBarBottomInset();

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
        extraData={compact}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductRow
            product={item}
            compact={compact}
            blurTarget={blurTarget}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
        ItemSeparatorComponent={() => <Separator $compact={compact} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          products.length === 0
            ? { flexGrow: 1, paddingTop: contentInsetTop }
            : { paddingTop: contentInsetTop, paddingBottom: tabBarInset }
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
