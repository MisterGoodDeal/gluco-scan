import { create } from 'zustand';

import { mealRepository } from '@/repositories/meal.repository';
import type { Meal } from '@/types/meal';
import type { MealItem } from '@/types/mealItem';
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
};

type MealStore = {
  selectedDate: string;
  dayMeals: Meal[];
  dayTotalCarbs: number;
  isLoading: boolean;
  step: number;
  draftMeta: MealDraftMeta;
  draftItems: MealDraftItem[];
  selectedMeal: Meal | null;
  hydrateDay: (dateKey?: string) => Promise<void>;
  setSelectedDate: (dateKey: string) => void;
  setSelectedMeal: (meal: Meal | null) => void;
  setStep: (step: number) => void;
  setDraftMeta: (meta: Partial<MealDraftMeta>) => void;
  addDraftItem: (item: MealDraftItem) => void;
  removeDraftItem: (id: string) => void;
  resetDraft: () => void;
  saveMeal: () => Promise<void>;
};

const defaultMeta = (): MealDraftMeta => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  return {
    type: inferMealTypeFromTime(hours, minutes),
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
        draftMeta.type = inferMealTypeFromTime(draftMeta.hours, draftMeta.minutes);
      }
      return { draftMeta };
    }),

  addDraftItem: (item) =>
    set((state) => ({ draftItems: [...state.draftItems, item] })),

  removeDraftItem: (id) =>
    set((state) => ({
      draftItems: state.draftItems.filter((item) => item.id !== id),
    })),

  resetDraft: () =>
    set({
      step: 0,
      draftMeta: defaultMeta(),
      draftItems: [],
    }),

  saveMeal: async () => {
    const { draftMeta, draftItems } = get();
    const createdAt = new Date(
      `${draftMeta.dateKey}T${String(draftMeta.hours).padStart(2, '0')}:${String(draftMeta.minutes).padStart(2, '0')}:00`,
    ).toISOString();

    await mealRepository.createWithItems({
      type: draftMeta.type,
      date: draftMeta.dateKey,
      createdAt,
      items: draftItems.map(({ id: _id, productName: _n, carbsPer100g: _c, carbs: _carbs, unitLabel: _l, ...item }) => item),
    });

    get().resetDraft();
    await get().hydrateDay(draftMeta.dateKey);
  },
}));
