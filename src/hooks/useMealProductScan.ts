import * as Haptics from 'expo-haptics';
import { useCallback, useRef, useState } from 'react';

import { SCAN_COOLDOWN_MS } from '@/constants/api';
import { productRepository } from '@/repositories/product.repository';
import { fetchOffPartialByEAN, fetchProductByEAN } from '@/services/openFoodFacts.service';
import { InvalidBarcodeError, OffRateLimitError } from '@/services/errors';
import type { Product } from '@/types/product';
import { createScanDebouncer } from '@/utils/debounce';
import { isValidEan } from '@/utils/ean';
import { getErrorMessage } from '@/services/errors';

export const useMealProductScan = () => {
  const debouncerRef = useRef(createScanDebouncer(SCAN_COOLDOWN_MS));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  const resolveProduct = useCallback(async (ean: string): Promise<Product | null> => {
    const cached = await productRepository.getByEan(ean);
    if (cached) return cached;

    try {
      const fromOff = await fetchProductByEAN(ean);
      const created = await productRepository.create({
        name: fromOff.name,
        carbsPer100g: fromOff.carbsPer100g,
        ean: fromOff.ean,
      });
      return created;
    } catch (err) {
      if (err instanceof OffRateLimitError) {
        setWarning(getErrorMessage(err));
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
      try {
        const partial = await fetchOffPartialByEAN(ean);
        if (partial.name && partial.carbsPer100g != null) {
          return productRepository.create({
            name: partial.name,
            carbsPer100g: partial.carbsPer100g,
            ean,
          });
        }
      } catch {
        // partial fetch may also rate limit
      }
      return null;
    }
  }, []);

  const handleScan = useCallback(
    async (rawEan: string): Promise<Product | null> => {
      const ean = rawEan.trim();
      if (!isValidEan(ean)) {
        setError(getErrorMessage(new InvalidBarcodeError()));
        return null;
      }
      if (!debouncerRef.current.canScan(ean)) return null;

      debouncerRef.current.recordScan(ean);
      setIsLoading(true);
      setError(null);
      setWarning(null);

      try {
        const product = await resolveProduct(ean);
        if (product) {
          void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        return product;
      } finally {
        setIsLoading(false);
      }
    },
    [resolveProduct],
  );

  const clearMessages = useCallback(() => {
    setError(null);
    setWarning(null);
  }, []);

  return {
    handleScan,
    isLoading,
    error,
    warning,
    clearMessages,
  };
};
