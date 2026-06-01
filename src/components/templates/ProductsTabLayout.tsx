import { BlurTargetView } from 'expo-blur';
import { SymbolView } from 'expo-symbols';
import { useFocusEffect } from 'expo-router';
import { type FC, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import styled, { useTheme } from 'styled-components/native';

import { BackgroundGradient } from '@/components/atoms/BackgroundGradient';
import { ButtonIcon } from '@/components/atoms/ButtonIcon';
import { SearchInput } from '@/components/atoms/SearchInput';
import { Text } from '@/components/atoms/Text';
import { BlurScreenHeader } from '@/components/organisms/BlurScreenHeader';
import { ProductFormSheet } from '@/components/organisms/ProductFormSheet';
import { ProductList } from '@/components/organisms/ProductList';
import { useBlurHeaderInset } from '@/hooks/useBlurHeaderInset';
import { useProductStore } from '@/store/product.store';
import type { Product } from '@/types/product';
import { productMatchesQuery } from '@/utils/productSearch';
import { Screen } from '@/styles/global';

const TitleRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const SearchRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

const SearchField = styled.View`
  flex: 1;
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
  const theme = useTheme();
  const blurTargetRef = useRef<View>(null);
  const { headerHeight, onHeaderLayout } = useBlurHeaderInset(1);
  const hydrate = useProductStore((s) => s.hydrate);
  const isLoading = useProductStore((s) => s.isLoading);
  const query = useProductStore((s) => s.query);
  const setQuery = useProductStore((s) => s.setQuery);
  const compactList = useProductStore((s) => s.compactList);
  const toggleCompactList = useProductStore((s) => s.toggleCompactList);
  const remove = useProductStore((s) => s.remove);
  const filteredProducts = useProductStore((s) => {
    const trimmed = s.query.trim().toLowerCase();
    if (!trimmed) return s.products;
    return s.products.filter((p) => productMatchesQuery(p, trimmed));
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
      <BlurTargetView ref={blurTargetRef} style={{ flex: 1 }}>
        <BackgroundGradient />
        <ProductList
          products={filteredProducts}
          compact={compactList}
          blurTarget={blurTargetRef}
          contentInsetTop={headerHeight}
          onEdit={openEdit}
          onDelete={(id) => void remove(id)}
          refreshing={isLoading}
          onRefresh={() => void loadProducts()}
        />
        <BlurScreenHeader blurTarget={blurTargetRef} onLayoutHeight={onHeaderLayout}>
          <TitleRow>
            <Text $variant="subtitle">{t('products.title')}</Text>
            <AddButton onPress={openAdd} accessibilityLabel={t('common.add')}>
              <Text $variant="caption" $color="accent">
                {t('products.addButton')}
              </Text>
            </AddButton>
          </TitleRow>
          <SearchRow>
            <SearchField>
              <SearchInput value={query} onChangeText={setQuery} flex />
            </SearchField>
            <ButtonIcon
              onPress={toggleCompactList}
              accessibilityLabel={
                compactList ? t('products.compactListOnA11y') : t('products.compactListOffA11y')
              }
              accessibilityState={{ selected: compactList }}>
              <SymbolView
                name={{
                  ios: compactList ? 'rectangle.expand.vertical' : 'rectangle.compress.vertical',
                  android: compactList ? 'view_agenda' : 'view_compact',
                }}
                size={20}
                tintColor={compactList ? theme.colors.accent : theme.colors.textSecondary}
              />
            </ButtonIcon>
          </SearchRow>
        </BlurScreenHeader>
      </BlurTargetView>
      <ProductFormSheet
        visible={isModalOpen}
        product={editingProduct}
        onClose={closeModal}
      />
    </Screen>
  );
};
