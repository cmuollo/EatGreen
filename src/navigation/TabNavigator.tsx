import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Schermate principali (implementate dall'Ingegnere 3 e 2)
import { RecipeListScreen } from '../screens/RecipeListScreen';
import { PantryScreen } from '../screens/PantryScreen';
import { MealPlanScreen } from '../screens/MealPlanScreen';
import { ShoppingListScreen } from '../screens/ShoppingListScreen';
import { StatsScreen } from '../screens/StatsScreen';

const Tab = createBottomTabNavigator();

// Configurazione icone per ogni tab
const TAB_ICONS: Record<string, { focused: string; unfocused: string }> = {
  Ricette:  { focused: 'restaurant',      unfocused: 'restaurant-outline' },
  Dispensa: { focused: 'basket',          unfocused: 'basket-outline' },
  Piano:    { focused: 'calendar',        unfocused: 'calendar-outline' },
  Spesa:    { focused: 'cart',            unfocused: 'cart-outline' },
  Statistiche: { focused: 'bar-chart',   unfocused: 'bar-chart-outline' },
};

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          const icons = TAB_ICONS[route.name];
          const iconName = focused ? icons.focused : icons.unfocused;
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2E7D32',   // verde primario app
        tabBarInactiveTintColor: '#9E9E9E',
      })}
    >
      <Tab.Screen name="Ricette"      component={RecipeListScreen} />
      <Tab.Screen name="Dispensa"     component={PantryScreen} />
      <Tab.Screen name="Piano"        component={MealPlanScreen} />
      <Tab.Screen name="Spesa"        component={ShoppingListScreen} />
      <Tab.Screen name="Statistiche"  component={StatsScreen} />
    </Tab.Navigator>
  );
}
