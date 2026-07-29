import { BlurTargetView } from 'expo-blur';
import { useFocusEffect } from 'expo-router';
import { useThemeColor } from 'heroui-native';
import { type FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Text, View } from 'react-native';

import { FaIcon } from '@/components/atoms/FaIcon';
import { TutorialAnchor } from '@/components/atoms/TutorialAnchor';
import { BackgroundGradient } from '@/components/atoms/BackgroundGradient';
import { ButtonIcon } from '@/components/atoms/ButtonIcon';
import { SearchInput } from '@/components/atoms/SearchInput';
import { TabBarHeightReporter } from '@/components/navigation/TabBarHeightReporter';
import { BlurScreenHeader } from '@/components/organisms/BlurScreenHeader';
import { ProductFormSheet } from '@/components/organisms/ProductFormSheet';
import { ProductOffSearchSheet } from '@/components/organisms/ProductOffSearchSheet';
import { ProductList } from '@/components/organisms/ProductList';
import { ProductTagFilterBar } from '@/components/molecules/ProductTagFilterBar';
import { AppButton } from '@/components/ui/AppButton';
import { useAppToast } from '@/components/ui/useAppToast';
import { useBlurHeaderInset } from '@/hooks/useBlurHeaderInset';
import { persistOffProduct } from '@/hooks/useMealProductScan';
import { useProductStore } from '@/store/product.store';
import { useTutorialStore } from '@/store/tutorial.store';
import { TutorialStatus } from '@/types/tutorial';
import { productRepository } from '@/repositories/product.repository';
import type { Product } from '@/types/product';
import type { ProductTag } from '@/types/productTag';
import { productMatchesQuery } from '@/utils/productSearch';
import { productMatchesTagFilters } from '@/utils/productTagFilter';
import { TUTORIAL_PRODUCTS_ADD_ANCHOR_ID } from '@/constants/tutorial';
import { consumePendingAddProduct } from '@/features/widgets/deepLink/pendingAction';
import { ProductAddMethodSheet } from '@/features/product-ocr/components/ProductAddMethodSheet';
import {
  ProductEanScanSheet,
  type ProductEanScanResult,
} from '@/features/product-ocr/components/ProductEanScanSheet';
import { OcrLabelReviewSheet } from '@/features/product-ocr/components/OcrLabelReviewSheet';
import { useLabelOcr } from '@/features/product-ocr/hooks/useLabelOcr';
import type {
  ProductAddMethod,
  ProductFormDraft,
} from '@/features/product-ocr/types/ocrDraft';
import { getErrorMessage } from '@/services/errors';
import {
  fetchProductByEAN,
  type OffSearchHit,
} from '@/services/openFoodFacts.service';
import { isValidEan, normalizeEan } from '@/utils/ean';

export const ProductsTabLayout: FC = () => {
  const { t } = useTranslation();
  const toast = useAppToast();
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
  const tutorialStepId = useTutorialStore((s) => s.getCurrentStepId());

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formDraft, setFormDraft] = useState<ProductFormDraft | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAddMethodOpen, setIsAddMethodOpen] = useState(false);
  const [isEanScanOpen, setIsEanScanOpen] = useState(false);
  const [isOcrReviewOpen, setIsOcrReviewOpen] = useState(false);
  const [isOffSearchOpen, setIsOffSearchOpen] = useState(false);
  const [isOffSearchSelecting, setIsOffSearchSelecting] = useState(false);
  const [listRevision, setListRevision] = useState(0);

  const {
    imageUri: ocrImageUri,
    parsed: ocrParsed,
    isProcessing: ocrProcessing,
    error: ocrError,
    reset: resetOcr,
    captureFromSource,
  } = useLabelOcr();

  useEffect(() => {
    if (tutorialStatus !== TutorialStatus.RUNNING) return;
    if (tutorialStepId !== 'product-form' || !openProductId) return;
    void productRepository.getById(openProductId).then((product) => {
      if (product) {
        setEditingProduct(product);
        setFormDraft(null);
        setIsFormOpen(true);
      }
    });
  }, [tutorialStatus, openProductId, tutorialStepId]);

  useEffect(() => {
    if (
      tutorialStatus === TutorialStatus.RUNNING &&
      tutorialStepId !== 'product-form' &&
      isFormOpen
    ) {
      setIsFormOpen(false);
      setEditingProduct(null);
      setFormDraft(null);
    }
  }, [tutorialStatus, tutorialStepId, isFormOpen]);

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
        setFormDraft(null);
        setIsAddMethodOpen(true);
      }
    }, [loadProducts]),
  );

  const openAdd = () => {
    setEditingProduct(null);
    setFormDraft(null);
    setIsAddMethodOpen(true);
  };

  const openEdit = useCallback((product: Product) => {
    setEditingProduct(product);
    setFormDraft(null);
    setIsFormOpen(true);
  }, []);

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
    setFormDraft(null);
  };

  const openFormWithProduct = useCallback((product: Product) => {
    setEditingProduct(product);
    setFormDraft(null);
    setIsFormOpen(true);
  }, []);

  const openFormWithDraft = useCallback((draft: ProductFormDraft) => {
    setEditingProduct(null);
    setFormDraft(draft);
    setIsFormOpen(true);
  }, []);

  const closeOffSearch = () => {
    setIsOffSearchOpen(false);
  };

  const startOcrCapture = useCallback(() => {
    const run = (source: 'camera' | 'library') => {
      void (async () => {
        const result = await captureFromSource(source, {
          onStarted: () => setIsOcrReviewOpen(true),
        });
        if (result === 'ok') return;
        setIsOcrReviewOpen(false);
        if (result === 'denied') {
          toast.error(
            source === 'camera'
              ? t('products.ocr.permissionDenied')
              : t('products.photoPermissionDenied'),
          );
        }
      })();
    };

    Alert.alert(t('products.ocr.captureTitle'), undefined, [
      {
        text: t('products.photoFromCamera'),
        onPress: () => run('camera'),
      },
      {
        text: t('products.photoFromGallery'),
        onPress: () => run('library'),
      },
      { text: t('common.cancel'), style: 'cancel' },
    ]);
  }, [captureFromSource, t, toast]);

  const handleAddMethodSelect = useCallback(
    (method: ProductAddMethod) => {
      setIsAddMethodOpen(false);
      if (method === 'ean') {
        setIsEanScanOpen(true);
        return;
      }
      if (method === 'off') {
        setIsOffSearchOpen(true);
        return;
      }
      setTimeout(() => startOcrCapture(), 280);
    },
    [startOcrCapture],
  );

  const handleEanScanResolved = useCallback(
    async (result: ProductEanScanResult) => {
      setIsEanScanOpen(false);
      if (result.kind === 'existing' || result.kind === 'created') {
        if (result.kind === 'created') {
          await hydrate();
          setListRevision((revision) => revision + 1);
        }
        openFormWithProduct(result.product);
        return;
      }
      openFormWithDraft(result.draft);
    },
    [hydrate, openFormWithDraft, openFormWithProduct],
  );

  const handleOcrContinue = useCallback(
    (values: {
      name: string;
      carbsPer100g: number | null;
      tags?: ProductTag[];
    }) => {
      setIsOcrReviewOpen(false);
      openFormWithDraft({
        name: values.name || undefined,
        carbsPer100g: values.carbsPer100g ?? undefined,
        tags: values.tags,
        source: 'ocr',
      });
      resetOcr();
    },
    [openFormWithDraft, resetOcr],
  );

  const handleOcrRetake = useCallback(() => {
    resetOcr();
    setIsOcrReviewOpen(false);
    setTimeout(() => startOcrCapture(), 280);
  }, [resetOcr, startOcrCapture]);

  const handleOffSearchSelect = useCallback(
    async (hit: OffSearchHit) => {
      setIsOffSearchSelecting(true);
      try {
        const code = normalizeEan(hit.code);
        const eanValid = isValidEan(code);

        if (eanValid) {
          const existing = await productRepository.getByEan(code);
          if (existing) {
            setIsOffSearchOpen(false);
            openFormWithProduct(existing);
            return;
          }
        }

        if (hit.carbsPer100g == null) {
          setIsOffSearchOpen(false);
          openFormWithDraft({
            ean: eanValid ? code : hit.code,
            name: hit.name,
            imageUrl: hit.imageUrl,
            tags: hit.tags,
            source: 'off',
          });
          return;
        }

        let product: Product;
        if (eanValid) {
          try {
            const fromOff = await fetchProductByEAN(code);
            product = await persistOffProduct({ ...fromOff, ean: code });
          } catch {
            product = await persistOffProduct({
              ean: code,
              name: hit.name,
              carbsPer100g: hit.carbsPer100g,
              imageUrl: hit.imageUrl,
              tags: hit.tags,
            });
          }
        } else {
          product = await productRepository.create({
            name: hit.name,
            carbsPer100g: hit.carbsPer100g,
            imageUrl: hit.imageUrl ?? null,
            tags: hit.tags,
            eans: [],
          });
        }

        await hydrate();
        setIsOffSearchOpen(false);
        openFormWithProduct(product);
        setListRevision((revision) => revision + 1);
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        setIsOffSearchSelecting(false);
      }
    },
    [hydrate, openFormWithDraft, openFormWithProduct, toast],
  );

  return (
    <View className="flex-1 bg-background">
      <TabBarHeightReporter />
      <BlurTargetView ref={blurTargetRef} style={{ flex: 1 }}>
        <BackgroundGradient />
        <TutorialAnchor id="tutorial-products-list" style={{ flex: 1 }}>
          <ProductList
            products={filteredProducts}
            compact={compactList}
            listRevision={listRevision}
            contentInsetTop={headerHeight + 8}
            onEdit={openEdit}
            refreshing={isLoading}
            onRefresh={() => void loadProducts()}
          />
        </TutorialAnchor>
        <BlurScreenHeader blurTarget={blurTargetRef} onLayoutHeight={onHeaderLayout}>
          <View className="flex-row items-center justify-between">
            <Text className="text-foreground text-lg font-bold">{t('products.title')}</Text>
            <TutorialAnchor
              id={TUTORIAL_PRODUCTS_ADD_ANCHOR_ID}
              style={{ alignSelf: 'flex-end' }}>
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
            <SearchInput value={query} onChangeText={setQuery} flex variant="plain" />
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

      <ProductAddMethodSheet
        visible={isAddMethodOpen}
        onClose={() => setIsAddMethodOpen(false)}
        onSelect={handleAddMethodSelect}
      />

      <ProductEanScanSheet
        visible={isEanScanOpen}
        onClose={() => setIsEanScanOpen(false)}
        onResolved={(result) => void handleEanScanResolved(result)}
      />

      <OcrLabelReviewSheet
        visible={isOcrReviewOpen}
        imageUri={ocrImageUri}
        parsed={ocrParsed}
        isProcessing={ocrProcessing}
        error={ocrError}
        onClose={() => {
          setIsOcrReviewOpen(false);
          resetOcr();
        }}
        onRetake={handleOcrRetake}
        onContinue={handleOcrContinue}
      />

      <ProductOffSearchSheet
        visible={isOffSearchOpen}
        onClose={closeOffSearch}
        onSelect={(hit) => void handleOffSearchSelect(hit)}
        isSelecting={isOffSearchSelecting}
      />

      <ProductFormSheet
        visible={isFormOpen}
        product={editingProduct}
        initialDraft={formDraft}
        onClose={closeForm}
        onSaved={() => setListRevision((revision) => revision + 1)}
      />
    </View>
  );
};
