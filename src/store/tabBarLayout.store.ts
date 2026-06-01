import { create } from 'zustand';

type TabBarLayoutState = {
  height: number | null;
  setHeight: (height: number) => void;
};

export const useTabBarLayoutStore = create<TabBarLayoutState>((set) => ({
  height: null,
  setHeight: (height) => set({ height }),
}));
