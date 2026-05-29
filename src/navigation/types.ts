import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Parametri di ogni schermata dello stack principale
export type RootStackParamList = {
  Tabs: undefined;
  RecipeDetail: { recipeId: string };
  RecipeForm: { recipeId?: string } | undefined;
  PantryItemForm: { itemId?: string } | undefined;
  AddMeal: { date?: string; slot?: string } | undefined;
};

// Tipo helper riusabile per le props di navigazione
export type ScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type RecipesStackParamList = {
  RecipeList: undefined;
  RecipeDetail: { recipeId: string };
  RecipeForm: { recipeId?: string } | undefined;
};

export type PantryStackParamList = {
  PantryList: undefined;
  PantryItemForm: { itemId?: string } | undefined;
};

export type MainTabParamList = {
  RecipesTab: undefined;
  PantryTab: undefined;
  MealPlanTab: undefined;
  ShoppingTab: undefined;
  StatsTab: undefined;
};