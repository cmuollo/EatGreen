import { createPersistedStore } from './createPersistedStore';
import { Recipe } from '../types';

interface RecipeStore {
  recipes: Recipe[];
  addRecipe: (recipe: Recipe) => void;
  updateRecipe: (id: string, data: Partial<Recipe>) => void;
  deleteRecipe: (id: string) => void;
}

export const useRecipeStore = createPersistedStore<RecipeStore>('recipe-storage', (set) => ({
  recipes: [],

  addRecipe: (recipe) =>
    set((s) => ({ recipes: [...s.recipes, recipe] })),

  updateRecipe: (id, data) =>
    set((s) => ({
      recipes: s.recipes.map((r) => (r.id === id ? { ...r, ...data } : r)),
    })),

  deleteRecipe: (id) =>
    set((s) => ({ recipes: s.recipes.filter((r) => r.id !== id) })),
}));
