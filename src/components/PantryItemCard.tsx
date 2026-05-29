import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ingredient } from '../types';

type Props = {
  item: Ingredient;
  onPress?: () => void;
};

export function PantryItemCard({ item, onPress }: Props) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.category}>{item.category}</Text>
      </View>

      <Text style={styles.meta}>
        Unità: {item.unit} · {item.macrosPer100g.calories} kcal / 100g
      </Text>
      <Text style={styles.meta}>
        P: {item.macrosPer100g.protein}g · C: {item.macrosPer100g.carbohydrates}g · G: {item.macrosPer100g.fats}g
      </Text>
      {item.macrosPer100g.fiber != null ? (
        <Text style={styles.meta}>Fibre: {item.macrosPer100g.fiber}g</Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#edf0ea',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  name: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#1f2d1f',
  },
  category: {
    color: '#2e7d32',
    fontWeight: '600',
    textTransform: 'uppercase',
    fontSize: 11,
  },
  meta: {
    marginTop: 6,
    color: '#5d685d',
    fontSize: 13,
  },
});