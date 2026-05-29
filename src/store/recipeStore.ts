// ============================================================
// store/recipesStore.ts
// Gestione dello stato delle ricette con Zustand.
// Include il calcolo dei macros totali a runtime.
// ============================================================

import { create } from 'zustand';
import { Recipe, RecipeCategory, Macros } from '../types';
import { getDatabase } from '../db';

// ─── Helpers interni ────────────────────────────────────────

/** Calcola i macros di un ingrediente a partire da quantità e macros per 100g */
function calcMacrosForQty(
  macrosPer100g: Macros,
  quantityG: number
): Macros {
  const factor = quantityG / 100;
  return {
    calories:      parseFloat((macrosPer100g.calories * factor).toFixed(1)),
    protein:       parseFloat((macrosPer100g.protein * factor).toFixed(1)),
    carbohydrates: parseFloat((macrosPer100g.carbohydrates * factor).toFixed(1)),
    fats:          parseFloat((macrosPer100g.fats * factor).toFixed(1)),
    fiber:         macrosPer100g.fiber !== undefined
                     ? parseFloat((macrosPer100g.fiber * factor).toFixed(1))
                     : undefined,
  };
}

/** Somma array di Macros */
function sumMacros(arr: Macros[]): Macros {
  return arr.reduce(
    (acc, m) => ({
      calories:      acc.calories + m.calories,
      protein:       acc.protein + m.protein,
      carbohydrates: acc.carbohydrates + m.carbohydrates,
      fats:          acc.fats + m.fats,
      fiber:         (acc.fiber ?? 0) + (m.fiber ?? 0),
    }),
    { calories: 0, protein: 0, carbohydrates: 0, fats: 0, fiber: 0 }
  );
}

// ─── Extended Recipe (include computed macros) ───────────────

export interface RecipeWithMacros extends Recipe {
  totalCalories: number;
  totalMacros: Macros;
}

// ─── Store Interface ─────────────────────────────────────────

interface RecipesState {
  recipes: RecipeWithMacros[];
  isLoading: boolean;
  error: string | null;

  fetchRecipes: (category?: RecipeCategory) => Promise<void>;
  addRecipe: (recipe: Omit<Recipe, 'id'>) => Promise<void>;
  updateRecipe: (recipe: Recipe) => Promise<void>;
  deleteRecipe: (id: string) => Promise<void>;
}

// ─── Store Implementation ────────────────────────────────────

export const useRecipesStore = create<RecipesState>((set, get) => ({
  recipes: [],
  isLoading: false,
  error: null,

  fetchRecipes: async (category) => {
    set({ isLoading: true, error: null });
    try {
      const db = getDatabase();

      // Fetch ricette
      const recipeRows = category
        ? await db.getAllAsync<Record<string, unknown>>(
            'SELECT * FROM recipes WHERE category = ? ORDER BY name', [category])
        : await db.getAllAsync<Record<string, unknown>>(
            'SELECT * FROM recipes ORDER BY category, name');

      // Per ogni ricetta, fetch ingredienti con macros dal catalogo
      const recipesWithMacros: RecipeWithMacros[] = await Promise.all(
        recipeRows.map(async (row) => {
          type IngRow = {
            ingredient_id: string; quantity: number; unit: string;
            calories: number; protein: number; carbohydrates: number;
            fats: number; fiber: number | null;
          };
          const ingRows = await db.getAllAsync<IngRow>(
            `SELECT ri.ingredient_id, ri.quantity, ri.unit,
                    i.calories, i.protein, i.carbohydrates, i.fats, i.fiber
             FROM recipe_ingredients ri
             JOIN ingredients i ON i.id = ri.ingredient_id
             WHERE ri.recipe_id = ?`,
            [row.id as string]
          );

          // Calcola macros per ogni ingrediente in base alla quantità
          const macrosPerIngredient = ingRows.map((ir) =>
            calcMacrosForQty(
              { calories: ir.calories, protein: ir.protein,
                carbohydrates: ir.carbohydrates, fats: ir.fats,
                fiber: ir.fiber ?? undefined },
              ir.quantity
            )
          );
          const totalMacros = sumMacros(macrosPerIngredient);

          return {
            id:              row.id as string,
            name:            row.name as string,
            description:     row.description as string,
            category:        row.category as RecipeCategory,
            prepTimeMinutes: row.prep_time_minutes as number,
            difficulty:      row.difficulty as Recipe['difficulty'],
            servings:        row.servings as number,
            notes:           row.notes as string | undefined,
            ingredients:     ingRows.map((ir) => ({
              ingredientId: ir.ingredient_id,
              quantity:     ir.quantity,
              unit:         ir.unit,
            })),
            totalCalories: totalMacros.calories,
            totalMacros,
          };
        })
      );

      set({ recipes: recipesWithMacros, isLoading: false });
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false });
    }
  },

  addRecipe: async (recipe) => {
    const id = `rec_${Date.now()}`;
    const db = getDatabase();
    await db.withTransactionAsync(async () => {
      await db.runAsync(
        `INSERT INTO recipes (id, name, description, category, prep_time_minutes, difficulty, servings, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, recipe.name, recipe.description, recipe.category,
         recipe.prepTimeMinutes, recipe.difficulty, recipe.servings, recipe.notes ?? null]
      );
      for (const ri of recipe.ingredients) {
        await db.runAsync(
          `INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
           VALUES (?, ?, ?, ?)`,
          [id, ri.ingredientId, ri.quantity, ri.unit]
        );
      }
    });
    await get().fetchRecipes();
  },

  updateRecipe: async (recipe) => {
    const db = getDatabase();
    await db.withTransactionAsync(async () => {
      await db.runAsync(
        `UPDATE recipes SET name=?, description=?, category=?, prep_time_minutes=?,
         difficulty=?, servings=?, notes=? WHERE id=?`,
        [recipe.name, recipe.description, recipe.category, recipe.prepTimeMinutes,
         recipe.difficulty, recipe.servings, recipe.notes ?? null, recipe.id]
      );
      // Sostituisce tutti gli ingredienti (delete + re-insert)
      await db.runAsync('DELETE FROM recipe_ingredients WHERE recipe_id = ?', [recipe.id]);
      for (const ri of recipe.ingredients) {
        await db.runAsync(
          `INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
           VALUES (?, ?, ?, ?)`,
          [recipe.id, ri.ingredientId, ri.quantity, ri.unit]
        );
      }
    });
    await get().fetchRecipes();
  },

  deleteRecipe: async (id) => {
    const db = getDatabase();
    await db.runAsync('DELETE FROM recipes WHERE id = ?', [id]);
    set((state) => ({ recipes: state.recipes.filter((r) => r.id !== id) }));
  },
}));