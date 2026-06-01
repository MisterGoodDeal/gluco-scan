import { createMMKV, type MMKV } from 'react-native-mmkv';

import { getSortLocale } from '@/i18n';
import { fetchProductByEAN } from '@/services/openFoodFacts.service';
import type { Product } from '@/types/product';

const CACHE_PREFIX = 'product:';

let storage: MMKV | null = null;

const getStorage = (): MMKV => {
  if (!storage) {
    storage = createMMKV({ id: 'glucoscan-products' });
  }
  return storage;
};

const cacheKey = (ean: string) => `${CACHE_PREFIX}${ean}`;

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

export const removeCachedProduct = (ean: string): void => {
  getStorage().remove(cacheKey(ean));
};

export const getAllCachedProducts = (): Product[] => {
  const keys = getStorage().getAllKeys().filter((key) => key.startsWith(CACHE_PREFIX));
  const products: Product[] = [];

  for (const key of keys) {
    const raw = getStorage().getString(key);
    if (!raw) continue;
    try {
      products.push(JSON.parse(raw) as Product);
    } catch {
      continue;
    }
  }

  return products.sort((a, b) => a.name.localeCompare(b.name, getSortLocale()));
};

export const getProduct = async (ean: string): Promise<Product> => {
  const cached = getCachedProduct(ean);
  if (cached) return cached;

  const product = await fetchProductByEAN(ean);
  setCachedProduct(product);
  return product;
};
