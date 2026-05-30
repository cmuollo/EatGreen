import React, { useEffect, useState } from 'react';
import { View, FlatList, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useRecipesStore } from '../store';
import { RecipesStackParamList } from '../navigation/types';
import { RecipeCard } from '../components/RecipeCard';

type Nav = NativeStackNavigationProp<RecipesStackParamList, 'RecipeList'>;

export function RecipeListScreen() {
  const navigation = useNavigation<Nav>();
  const { recipes, isLoading, fetchRecipes } = useRecipesStore();
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const filtered = recipes.filter((r) =>
    r.name.toLowerCase().includes(query.toLowerCase()) || 
    r.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Cerca per nome o categoria..."
        value={query}
        onChangeText={setQuery}
        placeholderTextColor="#AAA"
      />
      {isLoading ? (
        <ActivityIndicator size="large" color="#2E7D32" style={{ marginTop: 24 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(r) => r.id}
          renderItem={({ item }) => (
            <RecipeCard
              recipe={item}
              onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.id })}
            />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="restaurant-outline" size={48} color="#C8E6C9" />
              <Text style={styles.emptyText}>Nessuna ricetta trovata</Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('RecipeForm')}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FBE7' },
  search:    { margin: 16, padding: 12, backgroundColor: '#fff', borderRadius: 12, fontSize: 15, borderWidth: 1, borderColor: '#E8F5E9' },
  fab:       { position: 'absolute', bottom: 24, right: 24, width: 60, height: 60, borderRadius: 30, backgroundColor: '#2E7D32', justifyContent: 'center', alignItems: 'center', elevation: 4 },
  empty:     { alignItems: 'center', marginTop: 40 },
  emptyText: { color: '#888', marginTop: 12, fontSize: 16 }
});