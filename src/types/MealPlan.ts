export type MealSlot = 'colazione' | 'spuntino_mattina' | 'pranzo' | 'spuntino_pomeriggio' | 'cena';

/**
 * Singolo pasto nel piano: collega uno slot orario a una ricetta.
 */
export interface MealPlanEntry {
  id: string;
  date: string;          // ISO 8601 (YYYY-MM-DD)
  slot: MealSlot;
  recipeId: string;      // FK → Recipe.id
  servings: number;      // porzioni desiderate (può differire da Recipe.servings)
  notes?: string;
}

export interface MealPlan {
  id: string;
  name: string;
  startDate: string;     // ISO 8601
  endDate: string;
  createdAt: string;
  updatedAt: string;
  entries: MealPlanEntry[];
}