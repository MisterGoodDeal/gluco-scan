import { create } from 'zustand';

import { compositionRepository } from '@/repositories/composition.repository';
import type { Composition } from '@/types/composition';
import type { MealDraftItem } from '@/store/meal.store';

type CompositionStore = {
  compositions: Composition[];
  isLoading: boolean;
  query: string;
  draftName: string;
  draftItems: MealDraftItem[];
  editingCompositionId: string | null;
  hydrate: () => Promise<void>;
  setQuery: (query: string) => void;
  setDraftName: (name: string) => void;
  addDraftItem: (item: MealDraftItem) => void;
  updateDraftItem: (id: string, item: MealDraftItem) => void;
  removeDraftItem: (id: string) => void;
  resetDraft: () => void;
  beginEditComposition: (compositionId: string) => Promise<boolean>;
  saveComposition: () => Promise<string>;
  deleteComposition: (id: string) => Promise<void>;
};

const mapCompositionItemToDraft = (item: Composition['items'][number]): MealDraftItem => ({
  id: item.id,
  productId: item.productId,
  quantity: item.quantity,
  unitType: item.unitType,
  unitId: item.unitId,
  quantityType: item.quantityType,
  rawEquivalentQuantity: item.rawEquivalentQuantity,
  productName: item.productName,
  imageUrl: item.imageUrl ?? null,
  carbsPer100g: item.rawEquivalentQuantity > 0 ? (item.carbs / item.rawEquivalentQuantity) * 100 : 0,
  carbs: item.carbs,
  unitLabel: item.unitLabel,
  productTags: [],
});

export const useCompositionStore = create<CompositionStore>((set, get) => ({
  compositions: [],
  isLoading: false,
  query: '',
  draftName: '',
  draftItems: [],
  editingCompositionId: null,

  hydrate: async () => {
    set({ isLoading: true });
    try {
      const compositions = await compositionRepository.getAll();
      set({ compositions, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  setQuery: (query) => set({ query }),
  setDraftName: (draftName) => set({ draftName }),

  addDraftItem: (item) =>
    set((state) => ({
      draftItems: [...state.draftItems, item],
    })),

  updateDraftItem: (id, item) =>
    set((state) => ({
      draftItems: state.draftItems.map((draft) => (draft.id === id ? item : draft)),
    })),

  removeDraftItem: (id) =>
    set((state) => ({
      draftItems: state.draftItems.filter((item) => item.id !== id),
    })),

  resetDraft: () =>
    set({
      draftName: '',
      draftItems: [],
      editingCompositionId: null,
    }),

  beginEditComposition: async (compositionId) => {
    const composition = await compositionRepository.getById(compositionId);
    if (!composition) return false;

    set({
      editingCompositionId: composition.id,
      draftName: composition.name,
      draftItems: composition.items.map(mapCompositionItemToDraft),
    });
    return true;
  },

  saveComposition: async () => {
    const { draftName, draftItems, editingCompositionId } = get();
    const payload = {
      name: draftName.trim(),
      items: draftItems.map(
        ({
          id: _id,
          productTags: _tags,
          carbsPer100g: _carbsPer100g,
          ...item
        }) => item,
      ),
    };

    let compositionId: string;
    if (editingCompositionId) {
      await compositionRepository.updateWithItems(editingCompositionId, payload);
      compositionId = editingCompositionId;
    } else {
      const composition = await compositionRepository.createWithItems(payload);
      compositionId = composition.id;
    }

    get().resetDraft();
    await get().hydrate();
    return compositionId;
  },

  deleteComposition: async (id) => {
    await compositionRepository.delete(id);
    await get().hydrate();
  },
}));
