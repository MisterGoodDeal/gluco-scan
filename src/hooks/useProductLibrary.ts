import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

import type { ManualProductInitial } from '@/components/organisms/ProductManualEntryModal';
import { fetchOffPartialByEAN } from '@/services/openFoodFacts.service';
import {
  getAllCachedProducts,
  removeCachedProduct,
  setCachedProduct,
} from '@/services/productCache';
import type { Product } from '@/types/product';

const normalize = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const emptyManualEntry = (): ManualProductInitial => ({
  ean: '',
  name: '',
  carbsPer100g: undefined,
});

export const useProductLibrary = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState('');
  const [manualEntry, setManualEntry] = useState<ManualProductInitial | null>(null);
  const [isLookupLoading, setIsLookupLoading] = useState(false);

  const refresh = useCallback(() => {
    setProducts(getAllCachedProducts());
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const filteredProducts = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return products;

    const normalizedQuery = normalize(trimmed);
    return products.filter(
      (product) =>
        normalize(product.name).includes(normalizedQuery) ||
        product.ean.includes(trimmed),
    );
  }, [products, query]);

  const openAddModal = useCallback(() => {
    setManualEntry(emptyManualEntry());
  }, []);

  const closeAddModal = useCallback(() => {
    setManualEntry(null);
    setIsLookupLoading(false);
  }, []);

  const lookupOffData = useCallback(async (ean: string) => {
    setIsLookupLoading(true);
    try {
      const partial = await fetchOffPartialByEAN(ean);
      setManualEntry({
        ean: partial.ean,
        name: partial.name ?? '',
        carbsPer100g: partial.carbsPer100g,
      });
    } finally {
      setIsLookupLoading(false);
    }
  }, []);

  const saveManualProduct = useCallback(
    (product: Product) => {
      setCachedProduct(product);
      refresh();
      closeAddModal();
    },
    [closeAddModal, refresh],
  );

  const deleteProduct = useCallback(
    (ean: string) => {
      removeCachedProduct(ean);
      refresh();
    },
    [refresh],
  );

  return {
    query,
    setQuery,
    filteredProducts,
    manualEntry,
    isLookupLoading,
    openAddModal,
    closeAddModal,
    lookupOffData,
    saveManualProduct,
    deleteProduct,
    refresh,
  };
};
