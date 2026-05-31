import { Platform } from 'react-native';

import { fetchProductByEAN } from '@/services/openFoodFacts.service';
import type { Product } from '@/types/product';

type MmkvStorage = {
  getString: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
};

const memoryCache = new Map<string, Product>();

let storage: MmkvStorage | null = null;

const getStorage = (): MmkvStorage | null => {
  if (Platform.OS === 'web') return null;
  if (!storage) {
    const { createMMKV } = require('react-native-mmkv') as typeof import('react-native-mmkv');
    storage = createMMKV({ id: 'glucoscan-products' });
  }
  return storage;
};

const cacheKey = (ean: string) => `product:${ean}`;

export const getCachedProduct = (ean: string): Product | null => {
  const mmkv = getStorage();
  if (mmkv) {
    const raw = mmkv.getString(cacheKey(ean));
    if (!raw) return null;
    try {
      return JSON.parse(raw) as Product;
    } catch {
      return null;
    }
  }
  return memoryCache.get(ean) ?? null;
};

export const setCachedProduct = (product: Product): void => {
  const mmkv = getStorage();
  if (mmkv) {
    mmkv.set(cacheKey(product.ean), JSON.stringify(product));
    return;
  }
  memoryCache.set(product.ean, product);
};

export const getProduct = async (ean: string): Promise<Product> => {
  const cached = getCachedProduct(ean);
  if (cached) return cached;

  const product = await fetchProductByEAN(ean);
  setCachedProduct(product);
  return product;
};
