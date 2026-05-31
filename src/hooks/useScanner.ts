import * as Haptics from 'expo-haptics';
import { useCallback, useRef, useState } from 'react';

import { SCAN_COOLDOWN_MS } from '@/constants/api';
import { getProduct } from '@/hooks/useProductCache';
import { InvalidBarcodeError, getErrorMessage } from '@/services/errors';
import { useScanStore } from '@/store/scanStore';
import { createScanDebouncer } from '@/utils/debounce';

const isValidEan = (ean: string): boolean => /^\d{8,14}$/.test(ean);

export const useScanner = () => {
  const addItem = useScanStore((state) => state.addItem);
  const debouncerRef = useRef(createScanDebouncer(SCAN_COOLDOWN_MS));

  const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [scanSuccessFlash, setScanSuccessFlash] = useState(false);
  const [lastScannedEan, setLastScannedEan] = useState<string | null>(null);

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
        const product = await getProduct(ean);
        addItem(product);
        setLastScannedEan(ean);
        setScanSuccessFlash(true);
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setTimeout(() => setScanSuccessFlash(false), 300);
      } catch (error) {
        setScanError(getErrorMessage(error));
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } finally {
        setIsLoadingProduct(false);
      }
    },
    [addItem],
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
  };
};
