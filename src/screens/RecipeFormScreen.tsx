import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useRecipesStore, useIngredientsStore } from '../store';
import { RecipesStackParamList } from '../navigation/types';
import { RecipeCategory, Difficulty, RecipeIngredient } from '../types';

type Route = RouteProp<RecipesStackParamList, 'RecipeForm'>;

export function RecipeFormScreen() {
  const navigation = useNavigation();
  const { recipeId } = useRoute<Route>().params ?? {};
  
  const { recipes, addRecipe, updateRecipe } = useRecipesStore();
  const { ingredients: catalog, fetchIngredients } = useIngredientsStore();
  
  const existing = recipes.find((r) => r.id === recipeId);

  const [name, setName] = useState(existing?.name ?? '');
  const [description, setDesc] = useState(existing?.description ?? '');
  const [category, setCategory] = useState<RecipeCategory>(existing?.category ?? 'pranzo');
  const [prepTime, setPrepTime] = useState(String(existing?.prepTimeMinutes ?? '30'));
  const [difficulty, setDiff] = useState<Difficulty>(existing?.difficulty ?? 'facile');
  const [servings, setServings] = useState(String(existing?.servings ?? '1'));
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>(existing?.ingredients ?? []);
  const [notes, setNotes] = useState(existing?.notes ?? '');

  useEffect(() => { fetchIngredients(); }, [fetchIngredients]);

  const handleAddIngredient = () => {
    if (catalog.length === 0) return Alert.alert("Errore", "Nessun ingrediente nel catalogo!");
    // Aggiunge di default il primo ingrediente del catalogo
    setIngredients([...ingredients, { ingredientId: catalog[0].id, quantity: 100, unit: catalog[0].unit }]);
  };

  const handleUpdateIngredient = (index: number, field: keyof RecipeIngredient, value: any) => {
    const newIngs = [...ingredients];
    newIngs[index] = { ...newIngs[index], [field]: value };
    // Se cambia l'ingrediente, aggiorna l'unità di misura di default
    if (field === 'ingredientId') {
      const catIng = catalog.find(c => c.id === value);
      if (catIng) newIngs[index].unit = catIng.unit;
    }
    setIngredients(newIngs);
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!name.trim()) return Alert.alert('Errore', 'Inserisci il nome della ricetta');
    
    const recipeData = {
      id: existing?.id ?? '', // Verrà generato dallo store se nuovo
      name: name.trim(),
      description: description.trim(),
      category,
      prepTimeMinutes: parseInt(prepTime) || 0,
      difficulty,
      servings: parseInt(servings) || 1,
      ingredients,
      notes: notes.trim() || undefined
    };

    if (existing) {
      await updateRecipe(recipeData as any);
    } else {
      await addRecipe(recipeData);
    }
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.label}>Nome Ricetta</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Es. Pasta al Pomodoro" />

      <Text style={styles.label}>Categoria (colazione, pranzo, cena, spuntino, altro)</Text>
      <TextInput style={styles.input} value={category} onChangeText={(t) => setCategory(t as RecipeCategory)} />

      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={styles.label}>Tempo (min)</Text>
          <TextInput style={styles.input} value={prepTime} onChangeText={setPrepTime} keyboardType="numeric" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Porzioni</Text>
          <TextInput style={styles.input} value={servings} onChangeText={setServings} keyboardType="numeric" />
        </View>
      </View>

      <Text style={styles.label}>Descrizione</Text>
      <TextInput style={[styles.input, styles.multiline]} value={description} onChangeText={setDesc} multiline />

      <Text style={styles.sectionTitle}>Ingredienti</Text>
      {ingredients.map((ing, idx) => (
        <View key={idx} style={styles.ingRow}>
          {/* Per brevità usiamo TextInput, in un'app reale qui andrebbe un Picker/Dropdown */}
          <TextInput 
            style={[styles.input, { flex: 2, marginRight: 8 }]} 
            placeholder="ID Ingrediente" 
            value={ing.ingredientId} 
            onChangeText={(val) => handleUpdateIngredient(idx, 'ingredientId', val)} 
          />
          <TextInput 
            style={[styles.input, { flex: 1, marginRight: 8 }]} 
            keyboardType="numeric"
            value={String(ing.quantity)} 
            onChangeText={(val) => handleUpdateIngredient(idx, 'quantity', parseFloat(val) || 0)} 
          />
          <TouchableOpacity onPress={() => handleRemoveIngredient(idx)} style={styles.delBtn}>
            <Ionicons name="trash" size={20} color="#C62828" />
          </TouchableOpacity>
        </View>
      ))}
      
      <TouchableOpacity style={styles.addIngBtn} onPress={handleAddIngredient}>
        <Text style={styles.addIngText}>+ Aggiungi Ingrediente</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>{existing ? 'Salva Modifiche' : 'Crea Ricetta'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#F9FBE7', padding: 16 },
  label:        { fontSize: 13, fontWeight: '600', color: '#2E7D32', marginTop: 12, marginBottom: 4 },
  input:        { backgroundColor: '#fff', borderRadius: 8, padding: 12, fontSize: 15, borderWidth: 1, borderColor: '#E8F5E9' },
  multiline:    { height: 80, textAlignVertical: 'top' },
  row:          { flexDirection: 'row' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1B5E20', marginTop: 24, marginBottom: 8 },
  ingRow:       { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  delBtn:       { padding: 8, backgroundColor: '#FFEBEE', borderRadius: 8 },
  addIngBtn:    { padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#A5D6A7', borderStyle: 'dashed', alignItems: 'center', marginTop: 8 },
  addIngText:   { color: '#4CAF50', fontWeight: '600' },
  saveBtn:      { backgroundColor: '#2E7D32', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 32 },
  saveText:     { color: '#fff', fontSize: 16, fontWeight: '700' },
});