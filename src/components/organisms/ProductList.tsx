import { Card, useThemeColor } from 'heroui-native';
import { type FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, RefreshControl, Text, View } from 'react-native';

import { ProductRow } from '@/components/molecules/ProductRow';
import { useTabBarBottomInset } from '@/hooks/useTabBarBottomInset';
import type { Product } from '@/types/product';
import { hp } from '@/utils/screen';

const PAGE_SIZE = 30;

type ProductListProps = {
  products: Product[];
  compact?: boolean;
  listRevision?: number;
  onEdit: (product: Product) => void;
  refreshing?: boolean;
  onRefresh?: () => void;
  contentInsetTop?: number;
};

export const ProductList: FC<ProductListProps> = ({
  products,
  compact = false,
  listRevision = 0,
  onEdit,
  refreshing = false,
  onRefresh,
  contentInsetTop = 0,
}) => {
  const { t } = useTranslation();
  const [accentColor, backgroundColor] = useThemeColor(['accent', 'background']);
  const tabBarInset = useTabBarBottomInset();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [products, listRevision]);

  const visibleProducts = useMemo(
    () => products.slice(0, visibleCount),
    [products, visibleCount],
  );

  const hasMore = visibleCount < products.length;

  const loadMore = useCallback(() => {
    if (!hasMore) return;
    setVisibleCount((count) => Math.min(count + PAGE_SIZE, products.length));
  }, [hasMore, products.length]);

  const refreshControl =
    onRefresh != null ? (
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        tintColor={accentColor}
        colors={[accentColor]}
        progressBackgroundColor={backgroundColor}
      />
    ) : undefined;

  return (
    <View className="flex-1 px-4">
      <FlatList
        key={listRevision}
        data={visibleProducts}
        extraData={`${compact}:${listRevision}:${visibleCount}`}
        keyExtractor={(item) => `${item.id}:${item.imageUrl ?? ''}`}
        renderItem={({ item }) => (
          <ProductRow product={item} compact={compact} onEdit={onEdit} />
        )}
        ItemSeparatorComponent={() => (
          <View style={{ height: compact ? 4 : hp('1.5%') }} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          products.length === 0
            ? { flexGrow: 1, paddingTop: contentInsetTop }
            : { paddingTop: contentInsetTop, paddingBottom: tabBarInset }
        }
        refreshControl={refreshControl}
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        initialNumToRender={PAGE_SIZE}
        ListEmptyComponent={
          <View
            className="grow items-center justify-center p-8"
            style={{ minHeight: hp('30%') }}>
            <Card className="p-4">
              <Text className="text-muted text-base text-center">
                {t('products.emptyList')}
              </Text>
            </Card>
          </View>
        }
      />
    </View>
  );
};
