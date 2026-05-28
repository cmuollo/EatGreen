export type RecipeCategory = 'colazione' | 'pranzo' | 'cena' | 'spuntino' | 'altro';
export type Difficulty = 'facile' | 'media' | 'difficile';

export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  nutrition?: Macros; // valori nutrizionali per la quantità specificata (kcal e grammi)
  nutritionPerUnit?: Macros; // opzionale: valori per unità o per 100g (specificare unità nel contesto)
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  category: RecipeCategory;
  prepTimeMinutes: number;
  difficulty: Difficulty;
  servings: number;
  ingredients: Ingredient[];
  notes?: string;
  totalCalories?: number; // opzionale: somma delle calorie degli ingredienti
  totalMacros?: Macros; // opzionale: somma dei macros degli ingredienti
}

export interface Macros {
  calories: number; // kcal
  protein: number; // g
  carbohydrates: number; // g
  fats: number; // g
  fiber?: number; // g, opzionale
}
