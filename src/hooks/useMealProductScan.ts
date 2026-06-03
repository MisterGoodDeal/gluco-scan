import * as Haptics from 'expo-haptics';
import { useCallback, useRef, useState } from 'react';

import { SCAN_COOLDOWN_MS } from '@/constants/api';
import i18n from '@/i18n';
import { productRepository } from '@/repositories/product.repository';
import {
  fetchOffPartialByEAN,
  fetchProductByEAN,
  type OffProductResult,
} from '@/services/openFoodFacts.service';
import {
  getErrorMessage,
  InvalidBarcodeError,
  OffRateLimitError,
  ProductNotFoundError,
} from '@/services/errors';
import type { Product } from '@/types/product';
import { createScanDebouncer } from '@/utils/debounce';
import { isValidEan, normalizeEan } from '@/utils/ean';

export type MealScanResult =
  | { kind: 'existing'; product: Product }
  | { kind: 'off'; off: OffProductResult };

export const persistOffProduct = async (off: OffProductResult): Promise<Product> => {
  const ean = normalizeEan(off.ean);
  const existing = await productRepository.getByEan(ean);
  if (existing) return existing;

  return productRepository.create({
    name: off.name,
    carbsPer100g: off.carbsPer100g,
    eans: [ean],
    imageUrl: off.imageUrl,
  });
};

export const useMealProductScan = () => {
  const debouncerRef = useRef(createScanDebouncer(SCAN_COOLDOWN_MS));
  const inFlightRef = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  const resolveForMeal = useCallback(async (ean: string): Promise<MealScanResult | null> => {
    const normalizedEan = normalizeEan(ean);
    const cached = await productRepository.getByEan(normalizedEan);
    if (cached) return { kind: 'existing', product: cached };

    try {
      const fromOff = await fetchProductByEAN(normalizedEan);
      return { kind: 'off', off: { ...fromOff, ean: normalizedEan } };
    } catch (err) {
      if (err instanceof OffRateLimitError) {
        setWarning(getErrorMessage(err));
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
      try {
        const partial = await fetchOffPartialByEAN(normalizedEan);
        if (partial.name && partial.carbsPer100g != null) {
          return {
            kind: 'off',
            off: {
              ean: normalizedEan,
              name: partial.name,
              carbsPer100g: partial.carbsPer100g,
              imageUrl: partial.imageUrl,
            },
          };
        }
      } catch {
        // partial fetch may also rate limit
      }
      if (err instanceof ProductNotFoundError) {
        setError(i18n.t('meals.productNotFoundOff'));
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } else if (!(err instanceof OffRateLimitError)) {
        setError(getErrorMessage(err));
      }
      return null;
    }
  }, []);

  const handleScan = useCallback(
    async (rawEan: string): Promise<MealScanResult | null> => {
      const ean = rawEan.trim();
      if (!isValidEan(ean)) {
        setError(getErrorMessage(new InvalidBarcodeError()));
        return null;
      }
      if (inFlightRef.current || !debouncerRef.current.canScan(ean)) return null;

      inFlightRef.current = true;
      debouncerRef.current.recordScan(ean);
      setIsLoading(true);
      setError(null);
      setWarning(null);

      try {
        const result = await resolveForMeal(ean);
        if (result) {
          void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        return result;
      } finally {
        inFlightRef.current = false;
        setIsLoading(false);
      }
    },
    [resolveForMeal],
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
