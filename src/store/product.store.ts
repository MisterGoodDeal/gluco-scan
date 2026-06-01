import { create } from 'zustand';

import { productRepository } from '@/repositories/product.repository';
import type { Product } from '@/types/product';
import { productMatchesQuery } from '@/utils/productSearch';

type ProductStore = {
  products: Product[];
  query: string;
  isLoading: boolean;
  hydrate: () => Promise<void>;
  setQuery: (query: string) => void;
  getFiltered: () => Product[];
  create: (data: { name: string; carbsPer100g: number; eans?: string[] }) => Promise<Product>;
  update: (product: Product) => Promise<void>;
  remove: (id: string) => Promise<void>;
};

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  query: '',
  isLoading: false,

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

  getFiltered: () => {
    const { products, query } = get();
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return products;
    return products.filter((p) => productMatchesQuery(p, trimmed));
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
