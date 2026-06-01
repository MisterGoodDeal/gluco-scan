import { create } from 'zustand';

import { globalUnitRepository } from '@/repositories/globalUnit.repository';
import type { GlobalUnit } from '@/types/globalUnit';

type SettingsStore = {
  globalUnits: GlobalUnit[];
  isLoading: boolean;
  isExporting: boolean;
  isImporting: boolean;
  hydrate: () => Promise<void>;
  createUnit: (data: Omit<GlobalUnit, 'id'>) => Promise<void>;
  updateUnit: (unit: GlobalUnit) => Promise<void>;
  removeUnit: (id: string) => Promise<void>;
  setExporting: (value: boolean) => void;
  setImporting: (value: boolean) => void;
};

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  globalUnits: [],
  isLoading: false,
  isExporting: false,
  isImporting: false,

  hydrate: async () => {
    set({ isLoading: true });
    const globalUnits = await globalUnitRepository.getAll();
    set({ globalUnits, isLoading: false });
  },

  createUnit: async (data) => {
    await globalUnitRepository.create(data);
    await get().hydrate();
  },

  updateUnit: async (unit) => {
    await globalUnitRepository.update(unit);
    await get().hydrate();
  },

  removeUnit: async (id) => {
    await globalUnitRepository.delete(id);
    await get().hydrate();
  },

  setExporting: (value) => set({ isExporting: value }),
  setImporting: (value) => set({ isImporting: value }),
}));
