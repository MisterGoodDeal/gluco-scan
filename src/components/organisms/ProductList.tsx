import { Card, useThemeColor } from 'heroui-native';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, RefreshControl, Text, View } from 'react-native';

import { ProductRow } from '@/components/molecules/ProductRow';
import { useTabBarBottomInset } from '@/hooks/useTabBarBottomInset';
import type { Product } from '@/types/product';
import { hp } from '@/utils/screen';

type ProductListProps = {
  products: Product[];
  compact?: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  refreshing?: boolean;
  onRefresh?: () => void;
  contentInsetTop?: number;
};

export const ProductList: FC<ProductListProps> = ({
  products,
  compact = false,
  onEdit,
  onDelete,
  refreshing = false,
  onRefresh,
  contentInsetTop = 0,
}) => {
  const { t } = useTranslation();
  const [accentColor, backgroundColor] = useThemeColor(['accent', 'background']);
  const tabBarInset = useTabBarBottomInset();

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
        data={products}
        extraData={compact}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductRow product={item} compact={compact} onEdit={onEdit} onDelete={onDelete} />
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
