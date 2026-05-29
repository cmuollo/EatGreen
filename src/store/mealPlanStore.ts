// ============================================================
// store/mealPlanStore.ts
// Gestione del piano alimentare con Zustand.
// Il piano è un'entità composta da MealPlanEntry,
// ciascuna delle quali fa FK a una ricetta.
// ============================================================

import { create } from 'zustand';
import { MealPlan, MealPlanEntry, MealSlot } from '../types';
import { getDatabase } from '../db';
import { RecipeWithMacros } from './recipeStore';

// ─── Helper ─────────────────────────────────────────────────

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

// ─── Extended Entry (include recipe details) ─────────────────

export interface MealPlanEntryWithRecipe extends MealPlanEntry {
  recipeName: string;
  recipeCategory: string;
  prepTimeMinutes: number;
  totalCalories: number;  // calcolato runtime dal recipesStore
}

export interface MealPlanWithEntries extends Omit<MealPlan, 'entries'> {
  entries: MealPlanEntryWithRecipe[];
}

// ─── Store Interface ─────────────────────────────────────────

interface MealPlanState {
  plans: MealPlanWithEntries[];
  activePlanId: string | null;
  isLoading: boolean;
  error: string | null;

  fetchPlans: () => Promise<void>;
  createPlan: (name: string, startDate: string, endDate: string) => Promise<string>;
  deletePlan: (id: string) => Promise<void>;

  addEntry: (planId: string, entry: Omit<MealPlanEntry, 'id'>) => Promise<void>;
  updateEntry: (planId: string, entry: MealPlanEntry) => Promise<void>;
  removeEntry: (planId: string, entryId: string) => Promise<void>;

  /** Restituisce le entry di un giorno specifico */
  getEntriesForDate: (planId: string, date: string) => MealPlanEntryWithRecipe[];

  /** Calcola i macros totali di un giorno del piano */
  getDailyMacros: (planId: string, date: string, allRecipes: RecipeWithMacros[]) =>
    { calories: number; protein: number; carbohydrates: number; fats: number };

  setActivePlan: (id: string | null) => void;
}

// ─── Store Implementation ────────────────────────────────────

export const useMealPlanStore = create<MealPlanState>((set, get) => ({
  plans: [],
  activePlanId: null,
  isLoading: false,
  error: null,

  fetchPlans: async () => {
    set({ isLoading: true, error: null });
    try {
      const db = getDatabase();
      type PlanRow = { id:string; name:string; start_date:string; end_date:string; created_at:string; updated_at:string };
      type EntryRow = {
        id:number; entry_date:string; slot:string; recipe_id:string;
        servings:number; notes:string|null;
        recipe_name:string; recipe_category:string; prep_time_minutes:number;
      };

      const planRows = await db.getAllAsync<PlanRow>(
        'SELECT * FROM meal_plans ORDER BY start_date DESC'
      );

      const plans: MealPlanWithEntries[] = await Promise.all(
        planRows.map(async (pr) => {
          const entryRows = await db.getAllAsync<EntryRow>(
            `SELECT mpe.*, r.name AS recipe_name, r.category AS recipe_category,
                    r.prep_time_minutes
             FROM meal_plan_entries mpe
             JOIN recipes r ON r.id = mpe.recipe_id
             WHERE mpe.meal_plan_id = ?
             ORDER BY mpe.entry_date, mpe.slot`,
            [pr.id]
          );
          return {
            id: pr.id, name: pr.name,
            startDate: pr.start_date, endDate: pr.end_date,
            createdAt: pr.created_at, updatedAt: pr.updated_at,
            entries: entryRows.map((er) => ({
              id: String(er.id),
              date: er.entry_date,
              slot: er.slot as MealSlot,
              recipeId: er.recipe_id,
              servings: er.servings,
              notes: er.notes ?? undefined,
              recipeName: er.recipe_name,
              recipeCategory: er.recipe_category,
              prepTimeMinutes: er.prep_time_minutes,
              totalCalories: 0, // viene aggiornato in getDailyMacros
            })),
          };
        })
      );
      set({ plans, isLoading: false });
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false });
    }
  },

  createPlan: async (name, startDate, endDate) => {
    const id = generateId('mp');
    const db = getDatabase();
    await db.runAsync(
      `INSERT INTO meal_plans (id, name, start_date, end_date) VALUES (?, ?, ?, ?)`,
      [id, name, startDate, endDate]
    );
    await get().fetchPlans();
    return id;
  },

  deletePlan: async (id) => {
    const db = getDatabase();
    await db.runAsync('DELETE FROM meal_plans WHERE id = ?', [id]);
    set((state) => ({ plans: state.plans.filter((p) => p.id !== id) }));
  },

  addEntry: async (planId, entry) => {
    const db = getDatabase();
    await db.runAsync(
      `INSERT INTO meal_plan_entries (meal_plan_id, entry_date, slot, recipe_id, servings, notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [planId, entry.date, entry.slot, entry.recipeId, entry.servings, entry.notes ?? null]
    );
    await db.runAsync(
      `UPDATE meal_plans SET updated_at=datetime('now') WHERE id=?`, [planId]
    );
    await get().fetchPlans();
  },

  updateEntry: async (planId, entry) => {
    const db = getDatabase();
    await db.runAsync(
      `UPDATE meal_plan_entries
       SET entry_date=?, slot=?, recipe_id=?, servings=?, notes=? WHERE id=?`,
      [entry.date, entry.slot, entry.recipeId, entry.servings, entry.notes ?? null, entry.id]
    );
    await get().fetchPlans();
  },

  removeEntry: async (planId, entryId) => {
    const db = getDatabase();
    await db.runAsync('DELETE FROM meal_plan_entries WHERE id=?', [entryId]);
    set((state) => ({
      plans: state.plans.map((p) =>
        p.id !== planId ? p : { ...p, entries: p.entries.filter((e) => e.id !== entryId) }
      ),
    }));
  },

  getEntriesForDate: (planId, date) => {
    const plan = get().plans.find((p) => p.id === planId);
    return plan ? plan.entries.filter((e) => e.date === date) : [];
  },

  getDailyMacros: (planId, date, allRecipes) => {
    const entries = get().getEntriesForDate(planId, date);
    return entries.reduce(
      (acc, entry) => {
        const recipe = allRecipes.find((r) => r.id === entry.recipeId);
        if (!recipe) return acc;
        // scala i macros in base alle porzioni dell'entry rispetto alla ricetta
        const factor = entry.servings / recipe.servings;
        return {
          calories:      acc.calories      + recipe.totalMacros.calories * factor,
          protein:       acc.protein       + recipe.totalMacros.protein * factor,
          carbohydrates: acc.carbohydrates + recipe.totalMacros.carbohydrates * factor,
          fats:          acc.fats          + recipe.totalMacros.fats * factor,
        };
      },
      { calories: 0, protein: 0, carbohydrates: 0, fats: 0 }
    );
  },

  setActivePlan: (id) => set({ activePlanId: id }),
}));
