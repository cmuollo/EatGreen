import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useIngredientsStore } from '../store';

export function PantryScreen() {
  const navigation = useNavigation<any>();
  const { ingredients, isLoading, error, fetchIngredients } = useIngredientsStore();

  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchIngredients();
  }, [fetchIngredients]);

  const filteredIngredients = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ingredients;
    return ingredients.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [ingredients, search]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dispensa</Text>

      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Cerca ingrediente o categoria"
        style={styles.search}
        placeholderTextColor="#7a7a7a"
      />

      <Pressable
        style={styles.primaryButton}
        onPress={() => navigation.navigate('PantryItemForm', { mode: 'create' })}
      >
        <Text style={styles.primaryButtonText}>Aggiungi ingrediente</Text>
      </Pressable>

      {isLoading && <ActivityIndicator size="large" color="#2e7d32" />}
      {error && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={filteredIngredients}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() =>
              navigation.navigate('PantryItemForm', {
                mode: 'edit',
                ingredientId: item.id,
              })
            }
          >
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardSub}>{item.category}</Text>
            <Text style={styles.cardMeta}>
              {item.unit} · {item.macrosPer100g.calories} kcal / 100g
            </Text>
          </Pressable>
        )}
        ListEmptyComponent={
          !isLoading ? <Text style={styles.empty}>Nessun ingrediente trovato.</Text> : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f7f8f4' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 12, color: '#173a1a' },
  search: {
    borderWidth: 1,
    borderColor: '#d5d8d1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#2e7d32',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  primaryButtonText: { color: '#fff', fontWeight: '700' },
  list: { paddingBottom: 24 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#edf0ea',
  },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#1f2d1f' },
  cardSub: { marginTop: 4, color: '#4c5a4c' },
  cardMeta: { marginTop: 8, color: '#6b756b', fontSize: 12 },
  empty: { textAlign: 'center', marginTop: 24, color: '#666' },
  error: { color: '#b00020', marginBottom: 8 },
});