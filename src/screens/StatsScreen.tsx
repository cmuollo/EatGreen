import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useIngredientsStore, useMealPlanStore, useRecipesStore, useShoppingListStore } from '../store';

export function StatsScreen() {
  const { ingredients, fetchIngredients } = useIngredientsStore();
  const { recipes, fetchRecipes } = useRecipesStore();
  const { plans, fetchPlans } = useMealPlanStore();
  const { lists, fetchLists } = useShoppingListStore();

  useEffect(() => {
    fetchIngredients();
    fetchRecipes();
    fetchPlans();
    fetchLists();
  }, [fetchIngredients, fetchRecipes, fetchPlans, fetchLists]);

  const stats = useMemo(() => {
    const totalIngredients = ingredients.length;
    const totalRecipes = recipes.length;
    const totalMealPlans = plans.length;
    const totalShoppingLists = lists.length;
    const totalShoppingItems = lists.reduce((sum, list) => sum + list.items.length, 0);

    return [
      { label: 'Ingredienti totali', value: totalIngredients },
      { label: 'Ricette totali', value: totalRecipes },
      { label: 'Piani alimentari', value: totalMealPlans },
      { label: 'Liste spesa', value: totalShoppingLists },
      { label: 'Elementi lista spesa', value: totalShoppingItems },
    ];
  }, [ingredients, recipes, plans, lists]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Statistiche</Text>

      {stats.map((item) => (
        <View key={item.label} style={styles.card}>
          <Text style={styles.cardLabel}>{item.label}</Text>
          <Text style={styles.cardValue}>{item.value}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#f7f8f4' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 16, color: '#173a1a' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#edf0ea',
  },
  cardLabel: { color: '#4c5a4c', marginBottom: 6 },
  cardValue: { fontSize: 28, fontWeight: '700', color: '#2e7d32' },
});