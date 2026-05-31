import { useMemo } from 'react';

import { useScanStore } from '@/store/scanStore';
import type { ScannedItem } from '@/types/scannedItem';
import { computeCarbs } from '@/utils/carbs';

export const getItemCarbs = (item: ScannedItem): number =>
  computeCarbs(item.grams, item.product.carbsPer100g);

export const useCarbCalculator = () => {
  const scannedItems = useScanStore((state) => state.scannedItems);

  const totalCarbs = useMemo(
    () => scannedItems.reduce((sum, item) => sum + getItemCarbs(item), 0),
    [scannedItems],
  );

  return { totalCarbs, getItemCarbs };
};
