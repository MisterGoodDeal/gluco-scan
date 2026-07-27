import type { CompositionItem } from '@/types/compositionItem';

export interface Composition {
  id: string;
  name: string;
  createdAt: string;
  items: CompositionItem[];
  totalCarbs: number;
}
