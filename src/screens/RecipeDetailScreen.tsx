import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useRecipesStore, useIngredientsStore } from '../store';
import { RecipesStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RecipesStackParamList>;
type Route = RouteProp<RecipesStackParamList, 'RecipeDetail'>;

export function RecipeDetailScreen() {
  const navigation = useNavigation<Nav>();
  const { recipeId } = useRoute<Route>().params;
  
  const recipe = useRecipesStore((s) => s.recipes.find((r) => r.id === recipeId));
  const deleteRecipe = useRecipesStore((s) => s.deleteRecipe);
  
  const { ingredients: catalog, fetchIngredients } = useIngredientsStore();

  useEffect(() => {
    fetchIngredients(); // Assicura che il catalogo sia caricato per i nomi degli ingredienti
  }, [fetchIngredients]);

  if (!recipe) return null;

  const handleDelete = () => {
    Alert.alert('Elimina ricetta', 'Sei sicuro di voler eliminare questa ricetta?', [
      { text: 'Annulla', style: 'cancel' },
      { text: 'Elimina', style: 'destructive', onPress: async () => { 
          await deleteRecipe(recipeId); 
          navigation.goBack(); 
      }},
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{recipe.name}</Text>
      <Text style={styles.meta}>
        {recipe.category.toUpperCase()} · {recipe.prepTimeMinutes} min · {recipe.difficulty} · {recipe.servings} porzioni
      </Text>
      
      <View style={styles.macrosBox}>
        <Text style={styles.macrosTitle}>Valori totali ({recipe.totalCalories} kcal)</Text>
        <Text style={styles.macrosText}>
          Pro: {recipe.totalMacros.protein}g | Carbo: {recipe.totalMacros.carbohydrates}g | Grassi: {recipe.totalMacros.fats}g
        </Text>
      </View>

      {recipe.description ? <Text style={styles.body}>{recipe.description}</Text> : null}

      <Text style={styles.section}>Ingredienti</Text>
      {recipe.ingredients.map((ing, idx) => {
        const catIng = catalog.find(i => i.id === ing.ingredientId);
        return (
          <Text key={idx} style={styles.ing}>
            • {catIng ? catIng.name : 'Ingrediente ignoto'} - {ing.quantity} {ing.unit}
          </Text>
        );
      })}

      {recipe.notes ? <><Text style={styles.section}>Note</Text><Text style={styles.body}>{recipe.notes}</Text></> : null}

      <View style={styles.actions}>
        <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('RecipeForm', { recipeId })}>
          <Ionicons name="pencil" size={18} color="#2E7D32" /><Text style={styles.editText}>Modifica</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.delBtn} onPress={handleDelete}>
          <Ionicons name="trash" size={18} color="#C62828" /><Text style={styles.delText}>Elimina</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: '#F9FBE7', padding: 16 },
  title:       { fontSize: 26, fontWeight: '700', color: '#1B5E20', marginBottom: 6 },
  meta:        { fontSize: 14, color: '#666', marginBottom: 16, fontWeight: '500' },
  macrosBox:   { backgroundColor: '#E8F5E9', padding: 12, borderRadius: 8, marginBottom: 16 },
  macrosTitle: { fontSize: 14, fontWeight: '700', color: '#2E7D32', marginBottom: 4 },
  macrosText:  { fontSize: 13, color: '#388E3C' },
  section:     { fontSize: 18, fontWeight: '600', color: '#2E7D32', marginTop: 16, marginBottom: 8 },
  body:        { fontSize: 15, color: '#444', lineHeight: 22 },
  ing:         { fontSize: 15, color: '#333', marginBottom: 6, paddingLeft: 8 },
  actions:     { flexDirection: 'row', gap: 12, marginTop: 32, marginBottom: 40 },
  editBtn:     { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 8, backgroundColor: '#E8F5E9' },
  editText:    { color: '#2E7D32', fontWeight: '600', marginLeft: 8 },
  delBtn:      { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 8, backgroundColor: '#FFEBEE' },
  delText:     { color: '#C62828', fontWeight: '600', marginLeft: 8 },
});