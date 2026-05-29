import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { DatabaseProvider } from './src/db/DatabaseProvider';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './src/navigation/types';
import TabNavigator from './src/navigation/TabNavigator';

// Schermate di dettaglio fuori dai tab
import RecipeDetailScreen from './src/screens/RecipeDetailScreen';
import RecipeFormScreen from './src/screens/RecipeFormScreen';
import PantryItemFormScreen from './src/screens/PantryItemFormScreen';
import AddMealScreen from './src/screens/MealPlanScreen'; // placeholder, verrà sostituito 

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <DatabaseProvider>
    <NavigationContainer>
      <Stack.Navigator>
        {/* Tab Navigator come schermata root */}
        <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />

        {/* Schermate di dettaglio/form accessibili da qualsiasi tab */}
        <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} options={{ title: 'Ricetta' }} />
        <Stack.Screen name="RecipeForm"   component={RecipeFormScreen}   options={{ title: 'Modifica Ricetta' }} />
        <Stack.Screen name="PantryItemForm" component={PantryItemFormScreen} options={{ title: 'Prodotto' }} />
        <Stack.Screen name="AddMeal"      component={AddMealScreen}      options={{ title: 'Aggiungi Pasto' }} />
      </Stack.Navigator>
    </NavigationContainer>
    <StatusBar style="auto" />
    </DatabaseProvider>
  );
}