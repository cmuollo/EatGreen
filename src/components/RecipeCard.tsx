import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RecipeWithMacros } from '../store/recipeStore';

interface Props {
  recipe: RecipeWithMacros;
  onPress: () => void;
}

export function RecipeCard({ recipe, onPress }: Props) {
  const categoryLabel = recipe.category.charAt(0).toUpperCase() + recipe.category.slice(1);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.row}>
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>{recipe.name}</Text>
          <Text style={styles.meta}>
            {categoryLabel} · {recipe.prepTimeMinutes} min · {recipe.difficulty}
          </Text>
          <View style={styles.badgeContainer}>
            <Ionicons name="flame-outline" size={14} color="#FF9800" />
            <Text style={styles.calories}>{recipe.totalCalories} kcal</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#A5D6A7" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginHorizontal: 16, marginVertical: 8, elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  row: { flexDirection: 'row', alignItems: 'center' },
  info: { flex: 1, paddingRight: 12 },
  name: { fontSize: 18, fontWeight: '600', color: '#1B5E20' },
  meta: { fontSize: 14, color: '#757575', marginTop: 4 },
  badgeContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  calories: { fontSize: 13, fontWeight: '500', color: '#FF9800', marginLeft: 4 },
});