import * as Haptics from 'expo-haptics';
import { useCallback, useRef, useState } from 'react';

import { SCAN_COOLDOWN_MS } from '@/constants/api';
import { fetchOffPartialByEAN, fetchProductByEAN } from '@/services/openFoodFacts.service';
import { getCachedProduct, setCachedProduct } from '@/services/productCache';
import { InvalidBarcodeError } from '@/services/errors';
import { useScanStore } from '@/store/scanStore';
import type { Product } from '@/types/product';
import { createScanDebouncer } from '@/utils/debounce';
import { isValidEan } from '@/utils/ean';
import type { ManualProductInitial } from '@/components/organisms/ProductManualEntryModal';

export const useScanner = () => {
  const addItem = useScanStore((state) => state.addItem);
  const debouncerRef = useRef(createScanDebouncer(SCAN_COOLDOWN_MS));

  const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [scanSuccessFlash, setScanSuccessFlash] = useState(false);
  const [lastScannedEan, setLastScannedEan] = useState<string | null>(null);
  const [manualEntry, setManualEntry] = useState<ManualProductInitial | null>(null);

  const completeScan = useCallback(
    (product: Product) => {
      addItem(product);
      setLastScannedEan(product.ean);
      setScanSuccessFlash(true);
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => setScanSuccessFlash(false), 300);
    },
    [addItem],
  );

  const openManualEntry = useCallback(async (ean: string) => {
    const partial = await fetchOffPartialByEAN(ean);
    setManualEntry({
      ean,
      name: partial.name,
      carbsPer100g: partial.carbsPer100g,
    });
    setScanError(null);
  }, []);

  const handleScan = useCallback(
    async (rawEan: string) => {
      const ean = rawEan.trim();
      if (!isValidEan(ean)) {
        setScanError(new InvalidBarcodeError().message);
        return;
      }

      if (!debouncerRef.current.canScan(ean)) return;

      debouncerRef.current.recordScan(ean);
      setIsLoadingProduct(true);
      setScanError(null);

      try {
        const cached = getCachedProduct(ean);
        if (cached) {
          completeScan(cached);
          return;
        }

        try {
          const product = await fetchProductByEAN(ean);
          setCachedProduct(product);
          completeScan(product);
        } catch {
          await openManualEntry(ean);
          void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }
      } finally {
        setIsLoadingProduct(false);
      }
    },
    [completeScan, openManualEntry],
  );

  const closeManualEntry = useCallback(() => setManualEntry(null), []);

  const submitManualEntry = useCallback(
    (product: Product) => {
      setCachedProduct(product);
      completeScan(product);
      setManualEntry(null);
    },
    [completeScan],
  );

  const clearError = useCallback(() => setScanError(null), []);

  return {
    handleScan,
    isLoadingProduct,
    scanError,
    scanSuccessFlash,
    lastScannedEan,
    clearError,
    isScanning: !isLoadingProduct,
    manualEntry,
    closeManualEntry,
    submitManualEntry,
  };
};
