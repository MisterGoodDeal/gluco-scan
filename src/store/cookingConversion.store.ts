import { create } from 'zustand';

import { cookingConversionRepository } from '@/repositories/cookingConversion.repository';
import type { CookingConversion } from '@/types/cookingConversion';

type CookingConversionStore = {
  conversions: CookingConversion[];
  isLoading: boolean;
  hydrate: () => Promise<void>;
  updateConversion: (conversion: CookingConversion) => Promise<void>;
};

export const useCookingConversionStore = create<CookingConversionStore>((set, get) => ({
  conversions: [],
  isLoading: false,

  hydrate: async () => {
    set({ isLoading: true });
    try {
      const conversions = await cookingConversionRepository.getAll();
      set({ conversions, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  updateConversion: async (conversion) => {
    await cookingConversionRepository.upsert(conversion);
    await get().hydrate();
  },
}));
