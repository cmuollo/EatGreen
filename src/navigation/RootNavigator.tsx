// src/navigation/RootNavigator.tsx
// OWNER: cmuollo
// Questo file definisce SOLO la struttura della navigazione.
// Gli altri implementano gli screen nei rispettivi file
// senza modificare route names o struttura principale.

import React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

// ─────────────────────────────────────────────
// Import schermate 
// ─────────────────────────────────────────────
import { RecipeListScreen } from '../screens/RecipeListScreen';
import { RecipeDetailScreen } from '../screens/RecipeDetailScreen';
import { RecipeFormScreen } from '../screens/RecipeFormScreen';

import { PantryScreen }  from '../screens/PantryScreen';
import { PantryItemFormScreen }  from '../screens/PantryItemFormScreen';

import { MealPlanScreen } from '../screens/MealPlanScreen';
import { ShoppingListScreen }  from '../screens/ShoppingListScreen';
import { StatsScreen } from '../screens/StatsScreen';

// ─────────────────────────────────────────────
// Tipi navigazione
// ─────────────────────────────────────────────
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

const RecipesStack = createNativeStackNavigator<RecipesStackParamList>();
const PantryStack = createNativeStackNavigator<PantryStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// ─────────────────────────────────────────────
// Stack Ricette — owner schermate: dodierna
// ─────────────────────────────────────────────
function RecipesStackNavigator() {
  return (
    <RecipesStack.Navigator>
      <RecipesStack.Screen
        name="RecipeList"
        component={RecipeListScreen}
        options={{ title: 'Ricette' }}
      />
      <RecipesStack.Screen
        name="RecipeDetail"
        component={RecipeDetailScreen}
        options={{ title: 'Dettaglio ricetta' }}
      />
      <RecipesStack.Screen
        name="RecipeForm"
        component={RecipeFormScreen}
        options={{ title: 'Nuova / Modifica ricetta' }}
      />
    </RecipesStack.Navigator>
  );
}

// ─────────────────────────────────────────────
// Stack Dispensa — owner schermate: gmellone
// ─────────────────────────────────────────────
function PantryStackNavigator() {
  return (
    <PantryStack.Navigator>
      <PantryStack.Screen
        name="PantryList"
        component={PantryScreen}
        options={{ title: 'Dispensa' }}
      />
      <PantryStack.Screen
        name="PantryItemForm"
        component={PantryItemFormScreen}
        options={{ title: 'Nuovo / Modifica prodotto' }}
      />
    </PantryStack.Navigator>
  );
}

// ─────────────────────────────────────────────
// Tab principale
// ─────────────────────────────────────────────
export function RootNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            const iconName = getTabIcon(route.name);
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen
          name="RecipesTab"
          component={RecipesStackNavigator}
          options={{ title: 'Ricette' }}
        />
        <Tab.Screen
          name="PantryTab"
          component={PantryStackNavigator}
          options={{ title: 'Dispensa' }}
        />
        <Tab.Screen
          name="MealPlanTab"
          component={MealPlanScreen}
          options={{ title: 'Piano' }}
        />
        <Tab.Screen
          name="ShoppingTab"
          component={ShoppingListScreen}
          options={{ title: 'Spesa' }}
        />
        <Tab.Screen
          name="StatsTab"
          component={StatsScreen}
          options={{ title: 'Statistiche' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function getTabIcon(routeName: keyof MainTabParamList): keyof typeof Ionicons.glyphMap {
  switch (routeName) {
    case 'RecipesTab':
      return 'restaurant-outline';
    case 'PantryTab':
      return 'cube-outline';
    case 'MealPlanTab':
      return 'calendar-outline';
    case 'ShoppingTab':
      return 'cart-outline';
    case 'StatsTab':
      return 'stats-chart-outline';
    default:
      return 'ellipse-outline';
  }
}