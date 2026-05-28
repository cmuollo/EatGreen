import { createPersistedStore } from './createPersistedStore';
import { PantryItem } from '../types';

interface PantryStore {
  items: PantryItem[];
  addItem: (item: PantryItem) => void;
  updateItem: (id: string, data: Partial<PantryItem>) => void;
  deleteItem: (id: string) => void;
}

export const usePantryStore = createPersistedStore<PantryStore>('pantry-storage', (set) => ({
  items: [],

  addItem: (item) =>
    set((s) => ({ items: [...s.items, item] })),

  updateItem: (id, data) =>
    set((s) => ({
      items: s.items.map((i) => (i.id === id ? { ...i, ...data } : i)),
    })),

  deleteItem: (id) =>
    set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
}));
