import { create } from 'zustand';

import { mealRepository } from '@/repositories/meal.repository';
import { productRepository } from '@/repositories/product.repository';
import { usePreferencesStore } from '@/store/preferences.store';
import type { Meal } from '@/types/meal';
import type { MealItem, MealItemQuantityType } from '@/types/mealItem';
import type { ProductTag } from '@/types/productTag';
import { MealType } from '@/types/mealType';
import { toDateKey } from '@/utils/date';
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
  beginEditMeal: (mealId: string) => Promise<boolean>;
  resetDraft: () => void;
  saveMeal: () => Promise<void>;
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
    });
    return true;
  },

  resetDraft: () =>
    set({
      step: 0,
      draftMeta: defaultMeta(),
      draftItems: [],
      editingMealId: null,
    }),

  saveMeal: async () => {
    const { draftMeta, draftItems, editingMealId } = get();
    const createdAt = new Date(
      `${draftMeta.dateKey}T${String(draftMeta.hours).padStart(2, '0')}:${String(draftMeta.minutes).padStart(2, '0')}:00`,
    ).toISOString();

    const payload = {
      type: draftMeta.type,
      date: draftMeta.dateKey,
      createdAt,
      items: draftItems.map(
        ({
          id: _id,
          productName: _n,
          carbsPer100g: _c,
          unitLabel: _l,
          productTags: _t,
          ...item
        }) => item,
      ),
    };

    if (editingMealId) {
      await mealRepository.updateWithItems(editingMealId, payload);
    } else {
      await mealRepository.createWithItems(payload);
    }

    get().resetDraft();
    await get().hydrateDay(draftMeta.dateKey);
  },
}));
