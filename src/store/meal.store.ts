import { create } from 'zustand';

import { mealRepository } from '@/repositories/meal.repository';
import { productRepository } from '@/repositories/product.repository';
import { usePreferencesStore } from '@/store/preferences.store';
import type { Composition } from '@/types/composition';
import type { Meal } from '@/types/meal';
import type { MealItem, MealItemQuantityType } from '@/types/mealItem';
import type { ProductTag } from '@/types/productTag';
import { MealType } from '@/types/mealType';
import { toDateKey } from '@/utils/date';
import { generateId } from '@/utils/id';
import { inferMealTypeFromTime } from '@/utils/mealType';

export type MealDraftMeta = {
  type: MealType;
  dateKey: string;
  hours: number;
  minutes: number;
};

export type MealDraftItem = Omit<MealItem, 'id'> & {
  id: string;
  productName: string;
  imageUrl?: string | null;
  carbsPer100g: number;
  carbs: number;
  unitLabel: string;
  quantityType?: MealItemQuantityType;
  rawEquivalentQuantity: number;
  productTags: ProductTag[];
};

type MealStore = {
  selectedDate: string;
  dayMeals: Meal[];
  dayTotalCarbs: number;
  isLoading: boolean;
  step: number;
  draftMeta: MealDraftMeta;
  draftItems: MealDraftItem[];
  draftSourceCompositionId: string | null;
  draftSourceCompositionName: string | null;
  preserveDraftOnNextCreateOpen: boolean;
  editingMealId: string | null;
  selectedMeal: Meal | null;
  hydrateDay: (dateKey?: string) => Promise<void>;
  setSelectedDate: (dateKey: string) => void;
  setSelectedMeal: (meal: Meal | null) => void;
  setStep: (step: number) => void;
  setDraftMeta: (meta: Partial<MealDraftMeta>) => void;
  addDraftItem: (item: MealDraftItem) => void;
  removeDraftItem: (id: string) => void;
  updateDraftItem: (id: string, item: MealDraftItem) => void;
  addDraftItems: (items: MealDraftItem[]) => void;
  beginFromComposition: (
    composition: Composition,
    options?: { replaceExisting?: boolean; keepStep?: boolean },
  ) => void;
  consumePreservedDraftOnCreateOpen: () => boolean;
  clearDraftSourceComposition: () => void;
  beginEditMeal: (mealId: string) => Promise<boolean>;
  resetDraft: () => void;
  saveMeal: () => Promise<string>;
};

const inferTypeForDraft = (hours: number, minutes: number) =>
  inferMealTypeFromTime(hours, minutes, usePreferencesStore.getState().mealTypeSchedule);

const defaultMeta = (): MealDraftMeta => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  return {
    type: inferTypeForDraft(hours, minutes),
    dateKey: toDateKey(now),
    hours,
    minutes,
  };
};

export const useMealStore = create<MealStore>((set, get) => ({
  selectedDate: toDateKey(new Date()),
  dayMeals: [],
  dayTotalCarbs: 0,
  isLoading: false,
  step: 0,
  draftMeta: defaultMeta(),
  draftItems: [],
  draftSourceCompositionId: null,
  draftSourceCompositionName: null,
  preserveDraftOnNextCreateOpen: false,
  editingMealId: null,
  selectedMeal: null,

  hydrateDay: async (dateKey) => {
    const date = dateKey ?? get().selectedDate;
    set({ isLoading: true, selectedDate: date });
    const [dayMeals, dayTotalCarbs] = await Promise.all([
      mealRepository.getByDate(date),
      mealRepository.getDayTotalCarbs(date),
    ]);
    set({ dayMeals, dayTotalCarbs, isLoading: false });
  },

  setSelectedDate: (dateKey) => {
    void get().hydrateDay(dateKey);
  },

  setSelectedMeal: (meal) => set({ selectedMeal: meal }),

  setStep: (step) => set({ step }),

  setDraftMeta: (meta) =>
    set((state) => {
      const draftMeta = { ...state.draftMeta, ...meta };
      if ('hours' in meta || 'minutes' in meta) {
        draftMeta.type = inferTypeForDraft(draftMeta.hours, draftMeta.minutes);
      }
      return { draftMeta };
    }),

  addDraftItem: (item) =>
    set((state) => ({ draftItems: [...state.draftItems, item] })),

  removeDraftItem: (id) =>
    set((state) => ({
      draftItems: state.draftItems.filter((item) => item.id !== id),
    })),

  updateDraftItem: (id, item) =>
    set((state) => ({
      draftItems: state.draftItems.map((draft) => (draft.id === id ? item : draft)),
    })),

  addDraftItems: (items) =>
    set((state) => ({
      draftItems: [...state.draftItems, ...items],
    })),

  beginFromComposition: (composition, options) =>
    set((state) => {
      const mappedItems: MealDraftItem[] = composition.items.map((item) => ({
        id: generateId(),
        productId: item.productId,
        quantity: item.quantity,
        unitType: item.unitType,
        unitId: item.unitId,
        quantityType: item.quantityType,
        rawEquivalentQuantity: item.rawEquivalentQuantity,
        productName: item.productName,
        imageUrl: item.imageUrl ?? null,
        carbsPer100g:
          item.productId === 'system-manual-carbs'
            ? 100
            : item.rawEquivalentQuantity > 0
              ? (item.carbs / item.rawEquivalentQuantity) * 100
              : 0,
        carbs: item.carbs,
        unitLabel: item.unitLabel,
        productTags: [],
      }));

      return {
        step: options?.keepStep ? state.step : 0,
        draftItems: options?.replaceExisting ? mappedItems : [...state.draftItems, ...mappedItems],
        draftSourceCompositionId: composition.id,
        draftSourceCompositionName: composition.name,
        preserveDraftOnNextCreateOpen: true,
      };
    }),

  consumePreservedDraftOnCreateOpen: () => {
    const shouldPreserve = get().preserveDraftOnNextCreateOpen;
    if (shouldPreserve) {
      set({ preserveDraftOnNextCreateOpen: false });
    }
    return shouldPreserve;
  },

  clearDraftSourceComposition: () =>
    set({
      draftSourceCompositionId: null,
      draftSourceCompositionName: null,
    }),

  beginEditMeal: async (mealId) => {
    const meal = await mealRepository.getById(mealId);
    if (!meal) return false;

    const created = new Date(meal.createdAt);
    const draftItems: MealDraftItem[] = [];

    for (const item of meal.items) {
      const product = await productRepository.getById(item.productId);
      draftItems.push({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        unitType: item.unitType,
        unitId: item.unitId,
        quantityType: item.quantityType,
        rawEquivalentQuantity: item.rawEquivalentQuantity ?? item.quantity,
        productName: item.productName ?? product?.name ?? '',
          imageUrl: item.imageUrl ?? product?.imageUrl ?? null,
        carbsPer100g: product?.carbsPer100g ?? 0,
        carbs: item.carbs ?? 0,
        unitLabel: item.unitLabel ?? 'g',
        productTags: product?.tags ?? [],
      });
    }

    set({
      editingMealId: meal.id,
      step: 1,
      draftMeta: {
        type: meal.type,
        dateKey: meal.date,
        hours: created.getHours(),
        minutes: created.getMinutes(),
      },
      draftItems,
      draftSourceCompositionId: meal.sourceCompositionId ?? null,
      draftSourceCompositionName: meal.sourceCompositionName ?? null,
      preserveDraftOnNextCreateOpen: false,
    });
    return true;
  },

  resetDraft: () =>
    set({
      step: 0,
      draftMeta: defaultMeta(),
      draftItems: [],
      draftSourceCompositionId: null,
      draftSourceCompositionName: null,
      preserveDraftOnNextCreateOpen: false,
      editingMealId: null,
    }),

  saveMeal: async () => {
    const {
      draftMeta,
      draftItems,
      draftSourceCompositionId,
      draftSourceCompositionName,
      editingMealId,
    } = get();
    const createdAt = new Date(
      `${draftMeta.dateKey}T${String(draftMeta.hours).padStart(2, '0')}:${String(draftMeta.minutes).padStart(2, '0')}:00`,
    ).toISOString();

    const payload = {
      type: draftMeta.type,
      date: draftMeta.dateKey,
      createdAt,
      sourceCompositionId: draftSourceCompositionId,
      sourceCompositionName: draftSourceCompositionName,
      items: draftItems.map(
        ({
          id: _id,
          productName: _n,
          imageUrl: _i,
          carbsPer100g: _c,
          unitLabel: _l,
          productTags: _t,
          ...item
        }) => item,
      ),
    };

    let mealId: string;
    if (editingMealId) {
      await mealRepository.updateWithItems(editingMealId, payload);
      mealId = editingMealId;
    } else {
      const meal = await mealRepository.createWithItems(payload);
      mealId = meal.id;
    }

    const dateKey = draftMeta.dateKey;
    get().resetDraft();
    await get().hydrateDay(dateKey);
    return mealId;
  },
}));
