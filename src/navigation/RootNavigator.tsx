import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';

import type {
  RecipesStackParamList,
  PantryStackParamList,
  MainTabParamList,
} from './types';

import {
  RecipeListScreen,
  RecipeDetailScreen,
  RecipeFormScreen,
  PantryScreen,
  PantryItemFormScreen,
  MealPlanScreen,
  ShoppingListScreen,
  StatsScreen,
} from '../screens';

const RecipesStack = createNativeStackNavigator<RecipesStackParamList>();
const PantryStack = createNativeStackNavigator<PantryStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function RecipesStackNavigator() {
  return (
    <RecipesStack.Navigator>
      <RecipesStack.Screen name="RecipeList" component={RecipeListScreen} options={{ title: 'Ricette' }} />
      <RecipesStack.Screen name="RecipeDetail" component={RecipeDetailScreen} options={{ title: 'Dettaglio ricetta' }} />
      <RecipesStack.Screen name="RecipeForm" component={RecipeFormScreen} options={{ title: 'Nuova / Modifica ricetta' }} />
    </RecipesStack.Navigator>
  );
}

function PantryStackNavigator() {
  return (
    <PantryStack.Navigator>
      <PantryStack.Screen name="PantryList" component={PantryScreen} options={{ title: 'Dispensa' }} />
      <PantryStack.Screen name="PantryItemForm" component={PantryItemFormScreen} options={{ title: 'Nuovo / Modifica prodotto' }} />
    </PantryStack.Navigator>
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

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={getTabIcon(route.name)} size={size} color={color} />
          ),
        })}
      >
        <Tab.Screen name="RecipesTab" component={RecipesStackNavigator} options={{ title: 'Ricette' }} />
        <Tab.Screen name="PantryTab" component={PantryStackNavigator} options={{ title: 'Dispensa' }} />
        <Tab.Screen name="MealPlanTab" component={MealPlanScreen} options={{ title: 'Piano' }} />
        <Tab.Screen name="ShoppingTab" component={ShoppingListScreen} options={{ title: 'Spesa' }} />
        <Tab.Screen name="StatsTab" component={StatsScreen} options={{ title: 'Statistiche' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}