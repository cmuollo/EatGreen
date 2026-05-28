import { createPersistedStore } from './createPersistedStore';
import { ShoppingItem } from '../types';

interface ShoppingStore {
  items: ShoppingItem[];
  addItem: (item: ShoppingItem) => void;
  addItems: (items: ShoppingItem[]) => void;   // usato dalla feature genera-lista
  updateItem: (id: string, data: Partial<ShoppingItem>) => void;
  deleteItem: (id: string) => void;
  togglePurchased: (id: string) => void;
  clearPurchased: () => void;
}

export const useShoppingStore = createPersistedStore<ShoppingStore>('shopping-storage', (set) => ({
  items: [],

  addItem: (item) =>
    set((s) => ({ items: [...s.items, item] })),

  // Aggiunge più item in un'unica operazione (evita re-render multipli)
  addItems: (newItems) =>
    set((s) => ({ items: [...s.items, ...newItems] })),

  updateItem: (id, data) =>
    set((s) => ({
      items: s.items.map((i) => (i.id === id ? { ...i, ...data } : i)),
    })),

  deleteItem: (id) =>
    set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

  togglePurchased: (id) =>
    set((s) => ({
      items: s.items.map((i) => (i.id === id ? { ...i, purchased: !i.purchased } : i)),
    })),

  clearPurchased: () =>
    set((s) => ({ items: s.items.filter((i) => !i.purchased) })),
}));
