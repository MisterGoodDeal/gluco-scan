import { createMMKV } from 'react-native-mmkv';
import { create } from 'zustand';

import { productRepository } from '@/repositories/product.repository';
import type { Product } from '@/types/product';
import type { ProductTagFilter } from '@/constants/product-tag-filters';
import type { ProductTag } from '@/types/productTag';
import { productMatchesQuery } from '@/utils/productSearch';
import { productMatchesTagFilter } from '@/utils/productTagFilter';

const storage = createMMKV({ id: 'glucoscan-settings' });
const COMPACT_LIST_KEY = 'products_compact_list';

const readCompactList = (): boolean => storage.getBoolean(COMPACT_LIST_KEY) ?? false;

type ProductStore = {
  products: Product[];
  query: string;
  tagFilter: ProductTagFilter;
  compactList: boolean;
  isLoading: boolean;
  hydrate: () => Promise<void>;
  setQuery: (query: string) => void;
  setTagFilter: (filter: ProductTagFilter) => void;
  toggleCompactList: () => void;
  getFiltered: () => Product[];
  create: (data: {
    id?: string;
    name: string;
    carbsPer100g: number;
    eans?: string[];
    imageUrl?: string | null;
    tags?: ProductTag[];
    customCookingFactor?: number | null;
  }) => Promise<Product>;
  update: (product: Product) => Promise<void>;
  remove: (id: string) => Promise<void>;
};

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  query: '',
  tagFilter: 'all',
  compactList: readCompactList(),
  isLoading: false,

  toggleCompactList: () => {
    const compactList = !get().compactList;
    storage.set(COMPACT_LIST_KEY, compactList);
    set({ compactList });
  },

  hydrate: async () => {
    set({ isLoading: true });
    try {
      const products = await productRepository.getAll();
      set({ products, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  setQuery: (query) => set({ query }),

  setTagFilter: (tagFilter) => set({ tagFilter }),

  getFiltered: () => {
    const { products, query, tagFilter } = get();
    const trimmed = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesQuery = !trimmed || productMatchesQuery(product, trimmed);
      const matchesTag = productMatchesTagFilter(product, tagFilter);
      return matchesQuery && matchesTag;
    });
  },

  create: async (data) => {
    const product = await productRepository.create(data);
    await get().hydrate();
    return product;
  },

  update: async (product) => {
    await productRepository.update(product);
    await get().hydrate();
  },

  remove: async (id) => {
    await productRepository.delete(id);
    await get().hydrate();
  },
}));
