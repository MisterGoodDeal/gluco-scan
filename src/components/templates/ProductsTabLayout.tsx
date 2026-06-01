import { BlurTargetView } from 'expo-blur';
import { SymbolView } from 'expo-symbols';
import { useFocusEffect } from 'expo-router';
import { type FC, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import styled, { useTheme } from 'styled-components/native';

import { TutorialAnchor } from '@/components/atoms/TutorialAnchor';
import { BackgroundGradient } from '@/components/atoms/BackgroundGradient';
import { ButtonIcon } from '@/components/atoms/ButtonIcon';
import { SearchInput } from '@/components/atoms/SearchInput';
import { Text } from '@/components/atoms/Text';
import { TabBarHeightReporter } from '@/components/navigation/TabBarHeightReporter';
import { BlurScreenHeader } from '@/components/organisms/BlurScreenHeader';
import { ProductFormSheet } from '@/components/organisms/ProductFormSheet';
import { ProductList } from '@/components/organisms/ProductList';
import { useBlurHeaderInset } from '@/hooks/useBlurHeaderInset';
import { useProductStore } from '@/store/product.store';
import { useTutorialStore } from '@/store/tutorial.store';
import { TutorialStatus } from '@/types/tutorial';
import { productRepository } from '@/repositories/product.repository';
import { TUTORIAL_FEATURED_PRODUCT_ID } from '@/constants/tutorial';
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

  const tutorialStatus = useTutorialStore((s) => s.status);
  const openProductId = useTutorialStore((s) => s.openProductId);
  const tutorialStep = useTutorialStore((s) => s.currentStep);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (tutorialStatus !== TutorialStatus.RUNNING) return;
    if (tutorialStep !== 1 || !openProductId) return;
    void productRepository.getById(openProductId).then((product) => {
      if (product) {
        setEditingProduct(product);
        setIsModalOpen(true);
      }
    });
  }, [tutorialStatus, openProductId, tutorialStep]);

  useEffect(() => {
    if (tutorialStatus === TutorialStatus.RUNNING && tutorialStep !== 1 && isModalOpen) {
      setIsModalOpen(false);
      setEditingProduct(null);
    }
  }, [tutorialStatus, tutorialStep, isModalOpen]);

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
      <TabBarHeightReporter />
      <BlurTargetView ref={blurTargetRef} style={{ flex: 1 }}>
        <BackgroundGradient />
        <TutorialAnchor id="tutorial-products-list" style={{ flex: 1 }}>
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
        </TutorialAnchor>
        <BlurScreenHeader blurTarget={blurTargetRef} onLayoutHeight={onHeaderLayout}>
          <TitleRow>
            <Text $variant="subtitle">{t('products.title')}</Text>
            <TutorialAnchor id="tutorial-products-add">
            <AddButton onPress={openAdd} accessibilityLabel={t('common.add')}>
              <Text $variant="caption" $color="accent">
                {t('products.addButton')}
              </Text>
            </AddButton>
            </TutorialAnchor>
          </TitleRow>
          <SearchRow>
            <TutorialAnchor id="tutorial-products-search">
            <SearchField>
              <SearchInput value={query} onChangeText={setQuery} flex />
            </SearchField>
            </TutorialAnchor>
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
