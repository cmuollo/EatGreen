import { createPersistedStore } from './createPersistedStore';
import { MealPlan } from '../types';

interface MealPlanStore {
  meals: MealPlan[];
  addMeal: (meal: MealPlan) => void;
  removeMeal: (id: string) => void;
  getMealsByDate: (date: string) => MealPlan[];
}

export const useMealPlanStore = createPersistedStore<MealPlanStore>('mealplan-storage', (set, get) => ({
  meals: [],

  addMeal: (meal) =>
    set((s) => ({ meals: [...s.meals, meal] })),

  removeMeal: (id) =>
    set((s) => ({ meals: s.meals.filter((m) => m.id !== id) })),

  // Selector: filtra i pasti per una data specifica
  getMealsByDate: (date) =>
    get().meals.filter((m) => m.date === date),
}));
