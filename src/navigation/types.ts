import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Parametri di ogni schermata dello stack principale
export type RootStackParamList = {
  Tabs: undefined;
  RecipeDetail: { recipeId: string };
  RecipeForm: { recipeId?: string };     // recipeId assente = nuova ricetta
  PantryItemForm: { itemId?: string };
  AddMeal: { date: string; slot: string };
};

// Tipo helper riusabile per le props di navigazione
export type ScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
