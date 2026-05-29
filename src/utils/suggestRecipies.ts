import { Ingredient } from '../types';

type RecipeIngredientLike = {
  ingredientId: string;
  quantity: number;
  unit: string;
};

type RecipeLike = {
  id: string;
  name: string;
  category: string;
  prepTimeMinutes: number;
  difficulty?: string;
  servings: number;
  ingredients?: RecipeIngredientLike[];
  totalMacros?: {
    calories: number;
    protein: number;
    carbohydrates: number;
    fats: number;
  };
};

export type RecipeSuggestion = RecipeLike & {
  matchScore: number;
  missingIngredients: number;
  availableIngredients: number;
};

export function suggestRecipes(
  recipes: RecipeLike[],
  pantryIngredients: Ingredient[]
): RecipeSuggestion[] {
  const pantryIds = new Set(pantryIngredients.map((item) => item.id));

  return recipes
    .map((recipe) => {
      const ingredients = recipe.ingredients ?? [];
      const available = ingredients.filter((ingredient) => pantryIds.has(ingredient.ingredientId)).length;
      const missing = ingredients.length - available;
      const score = ingredients.length === 0 ? 0 : available / ingredients.length;

      return {
        ...recipe,
        matchScore: Number(score.toFixed(2)),
        missingIngredients: missing,
        availableIngredients: available,
      };
    })
    .sort((a, b) => {
      if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
      if (a.missingIngredients !== b.missingIngredients) return a.missingIngredients - b.missingIngredients;
      return a.prepTimeMinutes - b.prepTimeMinutes;
    });
}