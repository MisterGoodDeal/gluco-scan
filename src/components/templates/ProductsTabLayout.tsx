import { BlurTargetView } from 'expo-blur';
import { useFocusEffect } from 'expo-router';
import { useThemeColor } from 'heroui-native';
import { type FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { FaIcon } from '@/components/atoms/FaIcon';
import { TutorialAnchor } from '@/components/atoms/TutorialAnchor';
import { BackgroundGradient } from '@/components/atoms/BackgroundGradient';
import { ButtonIcon } from '@/components/atoms/ButtonIcon';
import { SearchInput } from '@/components/atoms/SearchInput';
import { TabBarHeightReporter } from '@/components/navigation/TabBarHeightReporter';
import { BlurScreenHeader } from '@/components/organisms/BlurScreenHeader';
import { ProductFormSheet } from '@/components/organisms/ProductFormSheet';
import { ProductList } from '@/components/organisms/ProductList';
import { ProductTagFilterBar } from '@/components/molecules/ProductTagFilterBar';
import { AppButton } from '@/components/ui/AppButton';
import { useBlurHeaderInset } from '@/hooks/useBlurHeaderInset';
import { useProductStore } from '@/store/product.store';
import { useTutorialStore } from '@/store/tutorial.store';
import { TutorialStatus } from '@/types/tutorial';
import { productRepository } from '@/repositories/product.repository';
import type { Product } from '@/types/product';
import { productMatchesQuery } from '@/utils/productSearch';
import { productMatchesTagFilters } from '@/utils/productTagFilter';
import { consumePendingAddProduct } from '@/features/widgets/deepLink/pendingAction';

export const ProductsTabLayout: FC = () => {
  const { t } = useTranslation();
  const [accentColor, mutedColor] = useThemeColor(['accent', 'muted']);
  const blurTargetRef = useRef<View>(null);
  const { headerHeight, onHeaderLayout } = useBlurHeaderInset(1);
  const hydrate = useProductStore((s) => s.hydrate);
  const isLoading = useProductStore((s) => s.isLoading);
  const query = useProductStore((s) => s.query);
  const products = useProductStore((s) => s.products);
  const tagFilters = useProductStore((s) => s.tagFilters);
  const setQuery = useProductStore((s) => s.setQuery);
  const setTagFilters = useProductStore((s) => s.setTagFilters);
  const compactList = useProductStore((s) => s.compactList);
  const toggleCompactList = useProductStore((s) => s.toggleCompactList);
  const filteredProducts = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesQuery = !trimmed || productMatchesQuery(product, trimmed);
      const matchesTag = productMatchesTagFilters(product, tagFilters);
      return matchesQuery && matchesTag;
    });
  }, [products, query, tagFilters]);

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
      if (consumePendingAddProduct()) {
        setEditingProduct(null);
        setIsModalOpen(true);
      }
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
    <View className="flex-1 bg-background">
      <TabBarHeightReporter />
      <BlurTargetView ref={blurTargetRef} style={{ flex: 1 }}>
        <BackgroundGradient />
        <TutorialAnchor id="tutorial-products-list" style={{ flex: 1 }}>
          <ProductList
            products={filteredProducts}
            compact={compactList}
            contentInsetTop={headerHeight + 8}
            onEdit={openEdit}
            refreshing={isLoading}
            onRefresh={() => void loadProducts()}
          />
        </TutorialAnchor>
        <BlurScreenHeader blurTarget={blurTargetRef} onLayoutHeight={onHeaderLayout}>
          <View className="flex-row items-center justify-between">
            <Text className="text-foreground text-lg font-bold">{t('products.title')}</Text>
            <TutorialAnchor id="tutorial-products-add">
            <AppButton
              size="sm"
              variant="tertiary"
              onPress={openAdd}
              accessibilityLabel={t('common.add')}>
              {t('products.addButton')}
            </AppButton>
            </TutorialAnchor>
          </View>
          <View className="mt-2 flex-row items-center gap-1 min-h-12 rounded-2xl border border-field-border bg-field px-2 overflow-hidden">
            <FaIcon name="magnifying-glass" size={18} color={mutedColor} />
            <TutorialAnchor id="tutorial-products-search" style={{ flex: 1, minWidth: 0 }}>
              <SearchInput value={query} onChangeText={setQuery} flex variant="plain" />
            </TutorialAnchor>
            <View className="h-5 w-px bg-separator" />
            <ProductTagFilterBar
              value={tagFilters}
              onChange={setTagFilters}
              embedded
            />
            <View className="h-5 w-px bg-separator" />
            <ButtonIcon
              variant="ghost"
              size="sm"
              onPress={toggleCompactList}
              accessibilityLabel={
                compactList ? t('products.compactListOnA11y') : t('products.compactListOffA11y')
              }
              accessibilityState={{ selected: compactList }}>
              <FaIcon
                name={compactList ? 'grip-lines' : 'list'}
                size={18}
                color={compactList ? accentColor : mutedColor}
              />
            </ButtonIcon>
          </View>
        </BlurScreenHeader>
      </BlurTargetView>
      <ProductFormSheet
        visible={isModalOpen}
        product={editingProduct}
        onClose={closeModal}
      />
    </View>
  );
};
