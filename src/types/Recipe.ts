export type RecipeCategory = 'colazione' | 'pranzo' | 'cena' | 'spuntino' | 'altro';
export type Difficulty = 'facile' | 'media' | 'difficile';

/**
 * Categorie di ingredienti disponibili nel catalogo.
 * Usate per filtrare il piano alimentare e la lista della spesa.
 */
export type IngredientCategory =
  | 'carne_bianca'
  | 'carne_rossa'
  | 'pesce'
  | 'legumi'
  | 'frutta'
  | 'verdura'
  | 'latticini'
  | 'prodotti_animali'
  | 'vegano';

/**
 * Macronutrienti espressi per 100 g (o 100 ml) di prodotto.
 * Tutti i valori fanno riferimento a 100 g salvo diversa indicazione
 * esplicita nel contesto di utilizzo.
 */
export interface Macros {
  calories: number;       // kcal per 100 g
  protein: number;        // g per 100 g
  carbohydrates: number;  // g per 100 g
  fats: number;           // g per 100 g
  fiber?: number;         // g per 100 g, opzionale
}

/**
 * Ingrediente nel catalogo prodotti (unità di misura e macros per 100 g).
 */
export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  unit: string;                  // unità di misura di default (g, ml, …)
  macrosPer100g: Macros;         // valori SEMPRE riferiti a 100 g/ml
}

/**
 * Riga ingrediente all'interno di una ricetta o lista della spesa.
 * Contiene quantità effettiva e riferimento all'ingrediente del catalogo.
 */
export interface RecipeIngredient {
  ingredientId: string;  // FK → Ingredient.id
  quantity: number;      // quantità nella ricetta (nella stessa unità dell'ingrediente)
  unit: string;          // può sovrascrivere l'unità di default (es. "fetta")
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  category: RecipeCategory;
  prepTimeMinutes: number;
  difficulty: Difficulty;
  servings: number;
  ingredients: RecipeIngredient[];
  notes?: string;
}