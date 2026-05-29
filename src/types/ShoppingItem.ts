export type ShoppingListStatus = 'attiva' | 'completata' | 'archiviata';

/**
 * Elemento della lista della spesa: riferimento all'ingrediente
 * del catalogo + quantità necessaria + stato acquisto.
 */
export interface ShoppingListItem {
  id: string;
  ingredientId: string;  // FK → Ingredient.id (catalogo centralizzato)
  quantity: number;
  unit: string;
  checked: boolean;
  notes?: string;
}

export interface ShoppingList {
  id: string;
  name: string;
  createdAt: string;     // ISO 
  updatedAt: string;
  status: ShoppingListStatus;
  items: ShoppingListItem[];
}
