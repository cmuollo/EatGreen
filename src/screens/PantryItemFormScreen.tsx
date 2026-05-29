import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useIngredientsStore } from '../store';

const CATEGORIES = [
  'carne_bianca',
  'carne_rossa',
  'pesce',
  'legumi',
  'frutta',
  'verdura',
  'latticini',
  'prodotti_animali',
  'vegano',
] as const;

export function PantryItemFormScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { ingredients, addIngredient, updateIngredient } = useIngredientsStore();

  const mode: 'create' | 'edit' = route.params?.mode ?? 'create';
  const ingredientId: string | undefined = route.params?.ingredientId;

  const existing = ingredients.find((item) => item.id === ingredientId);

  const [name, setName] = useState('');
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('verdura');
  const [unit, setUnit] = useState('g');
  const [calories, setCalories] = useState('0');
  const [protein, setProtein] = useState('0');
  const [carbohydrates, setCarbohydrates] = useState('0');
  const [fats, setFats] = useState('0');
  const [fiber, setFiber] = useState('');

  useEffect(() => {
    if (mode === 'edit' && existing) {
      setName(existing.name);
      setCategory(existing.category as (typeof CATEGORIES)[number]);
      setUnit(existing.unit);
      setCalories(String(existing.macrosPer100g.calories));
      setProtein(String(existing.macrosPer100g.protein));
      setCarbohydrates(String(existing.macrosPer100g.carbohydrates));
      setFats(String(existing.macrosPer100g.fats));
      setFiber(existing.macrosPer100g.fiber != null ? String(existing.macrosPer100g.fiber) : '');
    }
  }, [mode, existing]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Errore', 'Inserisci il nome dell’ingrediente.');
      return;
    }

    const payload = {
      id: existing?.id ?? '',
      name: name.trim(),
      category,
      unit: unit.trim() || 'g',
      macrosPer100g: {
        calories: Number(calories) || 0,
        protein: Number(protein) || 0,
        carbohydrates: Number(carbohydrates) || 0,
        fats: Number(fats) || 0,
        fiber: fiber.trim() === '' ? undefined : Number(fiber),
      },
    };

    if (mode === 'edit' && existing) {
      await updateIngredient({ ...existing, ...payload });
    } else {
      await addIngredient(payload as any);
    }

    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {mode === 'edit' ? 'Modifica ingrediente' : 'Nuovo ingrediente'}
      </Text>

      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Nome" />
      <TextInput style={styles.input} value={category} onChangeText={(v) => setCategory(v as any)} placeholder="Categoria" />
      <TextInput style={styles.input} value={unit} onChangeText={setUnit} placeholder="Unità di misura" />

      <TextInput style={styles.input} value={calories} onChangeText={setCalories} placeholder="Calorie" keyboardType="numeric" />
      <TextInput style={styles.input} value={protein} onChangeText={setProtein} placeholder="Proteine" keyboardType="numeric" />
      <TextInput style={styles.input} value={carbohydrates} onChangeText={setCarbohydrates} placeholder="Carboidrati" keyboardType="numeric" />
      <TextInput style={styles.input} value={fats} onChangeText={setFats} placeholder="Grassi" keyboardType="numeric" />
      <TextInput style={styles.input} value={fiber} onChangeText={setFiber} placeholder="Fibre" keyboardType="numeric" />

      <Pressable style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Salva</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#f7f8f4' },
  title: { fontSize: 26, fontWeight: '700', marginBottom: 16, color: '#173a1a' },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d5d8d1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#2e7d32',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { color: '#fff', fontWeight: '700' },
});