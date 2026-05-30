import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MealPlanEntryWithRecipe } from '../store/mealPlanStore';

interface Props {
  slotName: string;
  entry?: MealPlanEntryWithRecipe;
  onAdd: () => void;
  onPress: () => void;
}

export function MealSlot({ slotName, entry, onAdd, onPress }: Props) {
  if (!entry) {
    return (
      <TouchableOpacity style={styles.emptyCard} onPress={onAdd} activeOpacity={0.7}>
        <Ionicons name="add" size={20} color="#2E7D32" />
        <Text style={styles.emptyText}>Aggiungi {slotName}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.header}>
        <Text style={styles.slotName}>{slotName}</Text>
        <Text style={styles.recipeName} numberOfLines={1}>{entry.recipeName}</Text>
      </View>
      <View style={styles.metaRow}>
        <Text style={styles.metaText}>{entry.prepTimeMinutes} min · {entry.servings} porzioni</Text>
        <Text style={styles.caloriesText}>{Math.round(entry.totalCalories || 0)} kcal</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E8F5E9',
    borderStyle: 'dashed',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E8F5E9',
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  slotName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#757575',
    textTransform: 'uppercase',
  },
  recipeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1B5E20',
    flex: 1,
    textAlign: 'right',
    marginLeft: 8,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  metaText: {
    fontSize: 13,
    color: '#757575',
  },
  caloriesText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#FF9800',
  },
});