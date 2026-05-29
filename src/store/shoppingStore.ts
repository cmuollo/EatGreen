// ============================================================
// store/shoppingStore.ts
// Gestione delle liste della spesa con Zustand.
// La lista è un'entità composta da ShoppingListItem,
// ciascuno dei quali fa FK al catalogo ingredienti.
// ============================================================

import { create } from 'zustand';
import { ShoppingList, ShoppingListItem, ShoppingListStatus, IngredientCategory } from '../types';
import { getDatabase } from '../db';

// ─── Helper ─────────────────────────────────────────────────

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

// ─── Extended item (include nome e categoria dall'ingrediente) ─

export interface ShoppingListItemWithDetail extends ShoppingListItem {
  ingredientName: string;
  ingredientCategory: IngredientCategory;
}

export interface ShoppingListWithDetails extends Omit<ShoppingList, 'items'> {
  items: ShoppingListItemWithDetail[];
}

// ─── Store Interface ─────────────────────────────────────────

interface ShoppingListState {
  lists: ShoppingListWithDetails[];
  activeListId: string | null;
  isLoading: boolean;
  error: string | null;

  fetchLists: () => Promise<void>;
  createList: (name: string) => Promise<string>;
  deleteList: (id: string) => Promise<void>;
  setListStatus: (id: string, status: ShoppingListStatus) => Promise<void>;

  addItem: (listId: string, item: Omit<ShoppingListItem, 'id'>) => Promise<void>;
  updateItem: (listId: string, item: ShoppingListItem) => Promise<void>;
  toggleItem: (listId: string, itemId: string) => Promise<void>;
  removeItem: (listId: string, itemId: string) => Promise<void>;

  /** Genera una lista della spesa a partire dalle ricette di un piano alimentare */
  generateFromMealPlan: (mealPlanId: string, listName: string) => Promise<string>;

  setActiveList: (id: string | null) => void;
}

// ─── Store Implementation ────────────────────────────────────

export const useShoppingListStore = create<ShoppingListState>((set, get) => ({
  lists: [],
  activeListId: null,
  isLoading: false,
  error: null,

  fetchLists: async () => {
    set({ isLoading: true, error: null });
    try {
      const db = getDatabase();
      type ListRow = { id:string; name:string; status:string; created_at:string; updated_at:string };
      type ItemRow = {
        id:number; ingredient_id:string; quantity:number; unit:string;
        checked:number; notes:string|null;
        ingredient_name:string; ingredient_category:string;
      };

      const listRows = await db.getAllAsync<ListRow>(
        'SELECT * FROM shopping_lists ORDER BY created_at DESC'
      );

      const lists: ShoppingListWithDetails[] = await Promise.all(
        listRows.map(async (lr) => {
          const itemRows = await db.getAllAsync<ItemRow>(
            `SELECT sli.*, i.name AS ingredient_name, i.category AS ingredient_category
             FROM shopping_list_items sli
             JOIN ingredients i ON i.id = sli.ingredient_id
             WHERE sli.shopping_list_id = ?
             ORDER BY i.category, i.name`,
            [lr.id]
          );
          return {
            id: lr.id, name: lr.name,
            status: lr.status as ShoppingListStatus,
            createdAt: lr.created_at, updatedAt: lr.updated_at,
            items: itemRows.map((ir) => ({
              id: String(ir.id), ingredientId: ir.ingredient_id,
              quantity: ir.quantity, unit: ir.unit,
              checked: ir.checked === 1, notes: ir.notes ?? undefined,
              ingredientName: ir.ingredient_name,
              ingredientCategory: ir.ingredient_category as IngredientCategory,
            })),
          };
        })
      );
      set({ lists, isLoading: false });
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false });
    }
  },

  createList: async (name) => {
    const id = generateId('sl');
    const db = getDatabase();
    await db.runAsync(
      `INSERT INTO shopping_lists (id, name) VALUES (?, ?)`, [id, name]
    );
    await get().fetchLists();
    return id;
  },

  deleteList: async (id) => {
    const db = getDatabase();
    await db.runAsync('DELETE FROM shopping_lists WHERE id = ?', [id]);
    set((state) => ({ lists: state.lists.filter((l) => l.id !== id) }));
  },

  setListStatus: async (id, status) => {
    const db = getDatabase();
    await db.runAsync(
      `UPDATE shopping_lists SET status=?, updated_at=datetime('now') WHERE id=?`, [status, id]
    );
    set((state) => ({
      lists: state.lists.map((l) => l.id === id ? { ...l, status } : l),
    }));
  },

  addItem: async (listId, item) => {
    const db = getDatabase();
    await db.runAsync(
      `INSERT INTO shopping_list_items (shopping_list_id, ingredient_id, quantity, unit, notes)
       VALUES (?, ?, ?, ?, ?)`,
      [listId, item.ingredientId, item.quantity, item.unit, item.notes ?? null]
    );
    await db.runAsync(
      `UPDATE shopping_lists SET updated_at=datetime('now') WHERE id=?`, [listId]
    );
    await get().fetchLists();
  },

  updateItem: async (listId, item) => {
    const db = getDatabase();
    await db.runAsync(
      `UPDATE shopping_list_items SET ingredient_id=?, quantity=?, unit=?, notes=? WHERE id=?`,
      [item.ingredientId, item.quantity, item.unit, item.notes ?? null, item.id]
    );
    await get().fetchLists();
  },

  toggleItem: async (listId, itemId) => {
    const db = getDatabase();
    await db.runAsync(
      `UPDATE shopping_list_items SET checked = NOT checked WHERE id=?`, [itemId]
    );
    set((state) => ({
      lists: state.lists.map((l) =>
        l.id !== listId ? l : {
          ...l,
          items: l.items.map((i) =>
            i.id !== itemId ? i : { ...i, checked: !i.checked }
          ),
        }
      ),
    }));
  },

  removeItem: async (listId, itemId) => {
    const db = getDatabase();
    await db.runAsync('DELETE FROM shopping_list_items WHERE id=?', [itemId]);
    set((state) => ({
      lists: state.lists.map((l) =>
        l.id !== listId ? l : { ...l, items: l.items.filter((i) => i.id !== itemId) }
      ),
    }));
  },

  generateFromMealPlan: async (mealPlanId, listName) => {
    const db = getDatabase();
    // Aggrega ingredienti da tutte le ricette del piano
    type AggRow = { ingredient_id:string; default_unit:string; total_qty:number };
    const rows = await db.getAllAsync<AggRow>(
      `SELECT ri.ingredient_id,
              i.default_unit,
              SUM(ri.quantity * (mpe.servings * 1.0 / r.servings)) AS total_qty
       FROM meal_plan_entries mpe
       JOIN recipes r ON r.id = mpe.recipe_id
       JOIN recipe_ingredients ri ON ri.recipe_id = r.id
       JOIN ingredients i ON i.id = ri.ingredient_id
       WHERE mpe.meal_plan_id = ?
       GROUP BY ri.ingredient_id`,
      [mealPlanId]
    );

    const listId = generateId('sl');
    await db.withTransactionAsync(async () => {
      await db.runAsync(
        `INSERT INTO shopping_lists (id, name) VALUES (?, ?)`, [listId, listName]
      );
      for (const row of rows) {
        await db.runAsync(
          `INSERT INTO shopping_list_items (shopping_list_id, ingredient_id, quantity, unit)
           VALUES (?, ?, ?, ?)`,
          [listId, row.ingredient_id, Math.ceil(row.total_qty), row.default_unit]
        );
      }
    });
    await get().fetchLists();
    return listId;
  },

  setActiveList: (id) => set({ activeListId: id }),
}));
