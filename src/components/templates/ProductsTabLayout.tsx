import { BlurTargetView } from 'expo-blur';
import { useFocusEffect } from 'expo-router';
import { type FC, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import styled from 'styled-components/native';

import { BackgroundGradient } from '@/components/atoms/BackgroundGradient';
import { SearchInput } from '@/components/atoms/SearchInput';
import { Text } from '@/components/atoms/Text';
import { ProductFormSheet } from '@/components/organisms/ProductFormSheet';
import { ProductList } from '@/components/organisms/ProductList';
import { useProductStore } from '@/store/product.store';
import type { Product } from '@/types/product';
import { Screen, ScreenHeaderBar } from '@/styles/global';

const Header = styled(ScreenHeaderBar)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const AddButton = styled.Pressable`
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme }) => theme.colors.accentMuted};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.glass.border};
`;

export const ProductsTabLayout: FC = () => {
  const { t } = useTranslation();
  const blurTargetRef = useRef<View>(null);
  const hydrate = useProductStore((s) => s.hydrate);
  const isLoading = useProductStore((s) => s.isLoading);
  const query = useProductStore((s) => s.query);
  const setQuery = useProductStore((s) => s.setQuery);
  const remove = useProductStore((s) => s.remove);
  const filteredProducts = useProductStore((s) => {
    const trimmed = s.query.trim().toLowerCase();
    if (!trimmed) return s.products;
    return s.products.filter(
      (p) =>
        p.name.toLowerCase().includes(trimmed) ||
        (p.ean?.includes(trimmed) ?? false),
    );
  });

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadProducts = useCallback(async () => {
    await hydrate();
  }, [hydrate]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  useFocusEffect(
    useCallback(() => {
      void loadProducts();
    }, [loadProducts]),
  );

  const openAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const openEdit = useCallback((product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <Screen>
      <StatusBar style="light" />
      <BlurTargetView ref={blurTargetRef} style={{ flex: 1 }}>
        <BackgroundGradient />
        <Header>
          <Text $variant="subtitle">{t('products.title')}</Text>
          <AddButton onPress={openAdd} accessibilityLabel={t('common.add')}>
            <Text $variant="caption" $color="accent">
              {t('products.addButton')}
            </Text>
          </AddButton>
        </Header>
        <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
          <SearchInput value={query} onChangeText={setQuery} />
        </View>
        <ProductList
          products={filteredProducts}
          blurTarget={blurTargetRef}
          onEdit={openEdit}
          onDelete={(id) => void remove(id)}
          refreshing={isLoading}
          onRefresh={() => void loadProducts()}
        />
      </BlurTargetView>
      <ProductFormSheet
        visible={isModalOpen}
        product={editingProduct}
        onClose={closeModal}
      />
    </Screen>
  );
};
