import { BlurTargetView } from 'expo-blur';
import { useFocusEffect } from 'expo-router';
import { type FC, useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import styled from 'styled-components/native';

import { BackgroundGradient } from '@/components/atoms/BackgroundGradient';
import { SearchInput } from '@/components/atoms/SearchInput';
import { Text } from '@/components/atoms/Text';
import { ProductFormModal } from '@/components/organisms/ProductFormModal';
import { ProductList } from '@/components/organisms/ProductList';
import { useProductStore } from '@/store/product.store';
import type { Product } from '@/types/product';
import { Screen } from '@/styles/global';

const Header = styled.View`
  padding: ${({ theme }) => theme.spacing.md}px;
  padding-top: ${({ theme }) => theme.spacing.lg}px;
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
  const setQuery = useProductStore((s) => s.setQuery);
  const query = useProductStore((s) => s.query);
  const getFiltered = useProductStore((s) => s.getFiltered);
  const remove = useProductStore((s) => s.remove);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useFocusEffect(
    useCallback(() => {
      void hydrate();
    }, [hydrate]),
  );

  const openAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

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
          products={getFiltered()}
          blurTarget={blurTargetRef}
          onEdit={openEdit}
          onDelete={(id) => void remove(id)}
        />
      </BlurTargetView>
      <ProductFormModal
        visible={isModalOpen}
        product={editingProduct}
        onClose={closeModal}
      />
    </Screen>
  );
};
