// ============================================================
// store/ingredientsStore.ts
// Gestione dello stato degli ingredienti con Zustand.
// Responsabilità: stato in memoria + operazioni CRUD su SQLite.
// Dipende da db/ per la persistenza; NON conosce UI né navigation.
// ============================================================

import { create } from 'zustand';
import { Ingredient, IngredientCategory } from '../types';
import { getDatabase } from '../db';

// ─── Helpers interni ────────────────────────────────────────

/** Mappa una riga SQLite → Ingredient */
function rowToIngredient(row: Record<string, unknown>): Ingredient {
  return {
    id:       row.id as string,
    name:     row.name as string,
    category: row.category as IngredientCategory,
    unit:     row.default_unit as string,
    macrosPer100g: {
      calories:      row.calories as number,
      protein:       row.protein as number,
      carbohydrates: row.carbohydrates as number,
      fats:          row.fats as number,
      fiber:         row.fiber as number | undefined,
    },
  };
}

// ─── Store Interface ─────────────────────────────────────────

interface IngredientsState {
  ingredients: Ingredient[];
  isLoading: boolean;
  error: string | null;

  // Carica tutti gli ingredienti (o filtrati per categoria)
  fetchIngredients: (category?: IngredientCategory) => Promise<void>;

  // Aggiunge un ingrediente al catalogo
  addIngredient: (ingredient: Omit<Ingredient, 'id'>) => Promise<void>;

  // Aggiorna un ingrediente esistente
  updateIngredient: (ingredient: Ingredient) => Promise<void>;

  // Rimuove un ingrediente (fallisce se usato in ricette o liste)
  deleteIngredient: (id: string) => Promise<void>;

  // Restituisce gli ingredienti raggruppati per categoria (selector)
  getByCategory: (category: IngredientCategory) => Ingredient[];
}

// ─── Store Implementation ────────────────────────────────────

export const useIngredientsStore = create<IngredientsState>((set, get) => ({
  ingredients: [],
  isLoading: false,
  error: null,

  fetchIngredients: async (category) => {
    set({ isLoading: true, error: null });
    try {
      const db = getDatabase();
      const rows = category
        ? await db.getAllAsync<Record<string, unknown>>(
            'SELECT * FROM ingredients WHERE category = ? ORDER BY name',
            [category]
          )
        : await db.getAllAsync<Record<string, unknown>>(
            'SELECT * FROM ingredients ORDER BY category, name'
          );
      set({ ingredients: rows.map(rowToIngredient), isLoading: false });
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false });
    }
  },

  addIngredient: async (ingredient) => {
    const id = `ing_${Date.now()}`;
    const db = getDatabase();
    await db.runAsync(
      `INSERT INTO ingredients (id, name, category, default_unit, calories, protein, carbohydrates, fats, fiber)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        ingredient.name,
        ingredient.category,
        ingredient.unit,
        ingredient.macrosPer100g.calories,
        ingredient.macrosPer100g.protein,
        ingredient.macrosPer100g.carbohydrates,
        ingredient.macrosPer100g.fats,
        ingredient.macrosPer100g.fiber ?? null,
      ]
    );
    await get().fetchIngredients();
  },

  updateIngredient: async (ingredient) => {
    const db = getDatabase();
    await db.runAsync(
      `UPDATE ingredients
       SET name=?, category=?, default_unit=?, calories=?, protein=?, carbohydrates=?, fats=?, fiber=?
       WHERE id=?`,
      [
        ingredient.name,
        ingredient.category,
        ingredient.unit,
        ingredient.macrosPer100g.calories,
        ingredient.macrosPer100g.protein,
        ingredient.macrosPer100g.carbohydrates,
        ingredient.macrosPer100g.fats,
        ingredient.macrosPer100g.fiber ?? null,
        ingredient.id,
      ]
    );
    await get().fetchIngredients();
  },

  deleteIngredient: async (id) => {
    // RESTRICT sulle FK impedisce l'eliminazione se l'ingrediente è usato
    const db = getDatabase();
    await db.runAsync('DELETE FROM ingredients WHERE id = ?', [id]);
    set((state) => ({
      ingredients: state.ingredients.filter((i) => i.id !== id),
    }));
  },

  getByCategory: (category) =>
    get().ingredients.filter((i) => i.category === category),
}));
