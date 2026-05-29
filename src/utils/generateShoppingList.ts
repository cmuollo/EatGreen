import { MealPlanWithEntries } from '../store/mealPlanStore';
import { Ingredient } from '../types';

export type ShoppingListGeneratedItem = {
  ingredientId: string;
  ingredientName: string;
  category: string;
  quantity: number;
  unit: string;
  checked: boolean;
  notes?: string;
};

type RecipeIngredientLike = {
  ingredientId: string;
  quantity: number;
  unit: string;
  ingredientName?: string;
  ingredientCategory?: string;
};

type RecipeLike = {
  id: string;
  servings: number;
  ingredients?: RecipeIngredientLike[];
};

type MealPlanEntryLike = {
  recipeId: string;
  servings: number;
};

export function generateShoppingListFromMealPlan(
  mealPlan: MealPlanWithEntries,
  recipes: RecipeLike[],
  pantryIngredients: Ingredient[] = []
): ShoppingListGeneratedItem[] {
  const recipeMap = new Map(recipes.map((r) => [r.id, r]));
  const pantryMap = new Map(
    pantryIngredients.map((i) => [i.id, { name: i.name, category: i.category, unit: i.unit }])
  );

  const aggregated = new Map<
    string,
    { ingredientName: string; category: string; quantity: number; unit: string }
  >();

  for (const entry of mealPlan.entries) {
    const recipe = recipeMap.get(entry.recipeId);
    if (!recipe?.ingredients?.length) continue;

    const factor = entry.servings / Math.max(recipe.servings, 1);

    for (const ingredient of recipe.ingredients) {
      const current = aggregated.get(ingredient.ingredientId);
      const ingredientMeta = pantryMap.get(ingredient.ingredientId);

      const nextQty = (current?.quantity ?? 0) + ingredient.quantity * factor;

      aggregated.set(ingredient.ingredientId, {
        ingredientName:
          ingredient.ingredientName ?? ingredientMeta?.name ?? ingredient.ingredientId,
        category:
          ingredient.ingredientCategory ?? ingredientMeta?.category ?? 'altro',
        quantity: Number(nextQty.toFixed(2)),
        unit: ingredient.unit,
      });
    }
  }

  return Array.from(aggregated.entries()).map(([ingredientId, data]) => ({
    ingredientId,
    ingredientName: data.ingredientName,
    category: data.category,
    quantity: data.quantity,
    unit: data.unit,
    checked: false,
  }));
}