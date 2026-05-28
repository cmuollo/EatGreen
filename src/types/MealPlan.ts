export type MealSlotType = 'colazione' | 'pranzo' | 'cena';

export interface MealPlan {
  id: string;
  date: string;       // formato ISO: 'YYYY-MM-DD'
  slot: MealSlotType;
  recipeId: string;
}
