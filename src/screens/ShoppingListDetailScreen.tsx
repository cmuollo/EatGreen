import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useIngredientsStore, useShoppingListStore } from '../store';

export function ShoppingListDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const listId: string | undefined = route.params?.listId;

  const { lists, fetchLists, addItem, removeItem, toggleItem, createList } =
    useShoppingListStore();
  const { ingredients, fetchIngredients } = useIngredientsStore();

  const [listName, setListName] = useState('Nuova lista');
  const [ingredientId, setIngredientId] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState('g');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchLists();
    fetchIngredients();
  }, [fetchLists, fetchIngredients]);

  const currentList = useMemo(
    () => lists.find((item) => item.id === listId),
    [lists, listId]
  );

  const handleCreateList = async () => {
    const id = await createList(listName.trim() || 'Lista spesa');
    navigation.replace('ShoppingListDetail', { mode: 'detail', listId: id });
  };

  const handleAddItem = async () => {
    if (!currentList) return;
    if (!ingredientId.trim()) {
      Alert.alert('Errore', 'Seleziona un ingrediente.');
      return;
    }

    await addItem(currentList.id, {
      ingredientId,
      quantity: Number(quantity) || 1,
      unit: unit.trim() || 'g',
      checked: false,
      notes: notes.trim() || undefined,
    });

    setIngredientId('');
    setQuantity('1');
    setUnit('g');
    setNotes('');
  };

  if (!listId) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Crea lista</Text>
        <TextInput style={styles.input} value={listName} onChangeText={setListName} placeholder="Nome lista" />
        <Pressable style={styles.button} onPress={handleCreateList}>
          <Text style={styles.buttonText}>Crea</Text>
        </Pressable>
      </View>
    );
  }

  if (!currentList) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Lista non trovata</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{currentList.name}</Text>
      <Text style={styles.subtitle}>{currentList.status}</Text>

      <Text style={styles.section}>Aggiungi elemento</Text>
      <TextInput
        style={styles.input}
        value={ingredientId}
        onChangeText={setIngredientId}
        placeholder="Ingredient ID"
      />
      <TextInput style={styles.input} value={quantity} onChangeText={setQuantity} placeholder="Quantità" keyboardType="numeric" />
      <TextInput style={styles.input} value={unit} onChangeText={setUnit} placeholder="Unità" />
      <TextInput style={styles.input} value={notes} onChangeText={setNotes} placeholder="Note" />

      <Pressable style={styles.button} onPress={handleAddItem}>
        <Text style={styles.buttonText}>Aggiungi</Text>
      </Pressable>

      <FlatList
        data={currentList.items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.ingredientName}</Text>
            <Text style={styles.cardSub}>
              {item.quantity} {item.unit} · {item.ingredientCategory}
            </Text>
            {!!item.notes && <Text style={styles.cardMeta}>{item.notes}</Text>}

            <View style={styles.row}>
              <Pressable
                style={styles.smallButton}
                onPress={() => toggleItem(currentList.id, item.id)}
              >
                <Text style={styles.smallButtonText}>
                  {item.checked ? 'Segna non acquistato' : 'Segna acquistato'}
                </Text>
              </Pressable>

              <Pressable
                style={[styles.smallButton, styles.deleteButton]}
                onPress={() => removeItem(currentList.id, item.id)}
              >
                <Text style={styles.smallButtonText}>Elimina</Text>
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nessun elemento nella lista.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f7f8f4' },
  title: { fontSize: 28, fontWeight: '700', color: '#173a1a' },
  subtitle: { marginTop: 4, color: '#4c5a4c', marginBottom: 16 },
  section: { fontSize: 18, fontWeight: '700', marginBottom: 8, color: '#1f2d1f' },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d5d8d1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#2e7d32',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: { color: '#fff', fontWeight: '700' },
  list: { paddingBottom: 24 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#edf0ea',
  },
  cardTitle: { fontSize: 17, fontWeight: '700', color: '#1f2d1f' },
  cardSub: { marginTop: 4, color: '#4c5a4c' },
  cardMeta: { marginTop: 8, color: '#6b756b' },
  row: { flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap' },
  smallButton: {
    backgroundColor: '#e8f2e8',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  deleteButton: { backgroundColor: '#fdecec' },
  smallButtonText: { fontSize: 12, fontWeight: '700', color: '#1f2d1f' },
  empty: { textAlign: 'center', marginTop: 24, color: '#666' },
});