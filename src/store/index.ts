// ============================================================
// store/index.ts
// Barrel export degli store Zustand
// ============================================================

export { useIngredientsStore } from './ingredientsStore';
export { useRecipesStore } from './recipeStore';
export type { RecipeWithMacros } from './recipeStore';
export { useShoppingListStore } from './shoppingStore';
export type { ShoppingListItemWithDetail, ShoppingListWithDetails } from './shoppingStore';
export { useMealPlanStore } from './mealPlanStore';
export type { MealPlanEntryWithRecipe, MealPlanWithEntries } from './mealPlanStore';
