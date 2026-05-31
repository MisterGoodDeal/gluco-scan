import { createMMKV, type MMKV } from 'react-native-mmkv';

import { fetchProductByEAN } from '@/services/openFoodFacts.service';
import type { Product } from '@/types/product';

let storage: MMKV | null = null;

const getStorage = (): MMKV => {
  if (!storage) {
    storage = createMMKV({ id: 'glucoscan-products' });
  }
  return storage;
};

const cacheKey = (ean: string) => `product:${ean}`;

export const getCachedProduct = (ean: string): Product | null => {
  const raw = getStorage().getString(cacheKey(ean));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Product;
  } catch {
    return null;
  }
};

export const setCachedProduct = (product: Product): void => {
  getStorage().set(cacheKey(product.ean), JSON.stringify(product));
};

export const getProduct = async (ean: string): Promise<Product> => {
  const cached = getCachedProduct(ean);
  if (cached) return cached;

  const product = await fetchProductByEAN(ean);
  setCachedProduct(product);
  return product;
};
