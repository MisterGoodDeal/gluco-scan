import { BlurTargetView } from 'expo-blur';
import { router } from 'expo-router';
import { type FC, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import styled from 'styled-components/native';

import { BackgroundGradient } from '@/components/atoms/BackgroundGradient';
import { SearchInput } from '@/components/atoms/SearchInput';
import { Text } from '@/components/atoms/Text';
import { ScreenHeader } from '@/components/molecules/ScreenHeader';
import { ProductLibraryList } from '@/components/organisms/ProductLibraryList';
import { ProductManualEntryModal } from '@/components/organisms/ProductManualEntryModal';
import { useProductLibrary } from '@/hooks/useProductLibrary';
import { useScanStore } from '@/store/scanStore';
import type { Product } from '@/types/product';
import { Screen } from '@/styles/global';

const SearchBar = styled.View`
  padding: 0 ${({ theme }) => theme.spacing.md}px ${({ theme }) => theme.spacing.md}px;
`;

const AddHeaderButton = styled.Pressable`
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme }) => theme.colors.accentMuted};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.glass.border};
`;

export const ProductLibraryLayout: FC = () => {
  const { t } = useTranslation();
  const blurTargetRef = useRef<View>(null);
  const addItem = useScanStore((state) => state.addItem);

  const {
    query,
    setQuery,
    filteredProducts,
    manualEntry,
    isEditing,
    isLookupLoading,
    lookupWarning,
    openAddModal,
    openEditModal,
    closeAddModal,
    lookupOffData,
    saveManualProduct,
    deleteProduct,
  } = useProductLibrary();

  const handleAddToMeal = (product: Product) => {
    addItem(product);
    router.back();
  };

  const handleSaveProduct = (product: Product) => {
    saveManualProduct(product);
  };

  return (
    <Screen>
      <StatusBar style="light" />
      <BlurTargetView ref={blurTargetRef} style={{ flex: 1 }}>
        <BackgroundGradient />
        <ScreenHeader
          title={t('products.title')}
          onBack={() => router.back()}
          rightAction={
            <AddHeaderButton onPress={openAddModal} accessibilityLabel={t('common.add')}>
              <Text $variant="caption" $color="accent">
                {t('products.addButton')}
              </Text>
            </AddHeaderButton>
          }
        />
        <SearchBar>
          <SearchInput value={query} onChangeText={setQuery} />
        </SearchBar>
        <ProductLibraryList
          products={filteredProducts}
          blurTarget={blurTargetRef}
          onEdit={openEditModal}
          onAddToMeal={handleAddToMeal}
          onDelete={deleteProduct}
        />
      </BlurTargetView>
      <ProductManualEntryModal
        visible={manualEntry !== null}
        initial={manualEntry}
        title={isEditing ? t('products.editProduct') : t('products.addProduct')}
        subtitle={isEditing ? t('products.editSubtitle') : t('products.addSubtitle')}
        submitLabel={t('common.save')}
        isLookupLoading={isLookupLoading}
        lookupWarning={lookupWarning}
        onClose={closeAddModal}
        onLookup={lookupOffData}
        onSubmit={handleSaveProduct}
      />
    </Screen>
  );
};
