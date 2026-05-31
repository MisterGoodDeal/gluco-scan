import { create } from 'zustand';

import { DEFAULT_GRAMS } from '@/constants/api';
import type { Product } from '@/types/product';
import type { ScannedItem } from '@/types/scannedItem';

type ScanStore = {
  scannedItems: ScannedItem[];
  addItem: (product: Product, grams?: number) => void;
  removeItem: (id: string) => void;
  updateGrams: (id: string, grams: number) => void;
  reset: () => void;
};

export const useScanStore = create<ScanStore>((set) => ({
  scannedItems: [],
  addItem: (product, grams = DEFAULT_GRAMS) =>
    set((state) => ({
      scannedItems: [
        ...state.scannedItems,
        {
          id: crypto.randomUUID(),
          product,
          grams,
        },
      ],
    })),
  removeItem: (id) =>
    set((state) => ({
      scannedItems: state.scannedItems.filter((item) => item.id !== id),
    })),
  updateGrams: (id, grams) =>
    set((state) => ({
      scannedItems: state.scannedItems.map((item) =>
        item.id === id ? { ...item, grams } : item,
      ),
    })),
  reset: () => set({ scannedItems: [] }),
}));
