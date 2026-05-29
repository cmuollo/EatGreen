import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useShoppingListStore } from '../store';

export function ShoppingListScreen() {
  const navigation = useNavigation<any>();
  const { lists, isLoading, error, fetchLists } = useShoppingListStore();

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista della spesa</Text>

      <Pressable
        style={styles.primaryButton}
        onPress={() => navigation.navigate('ShoppingListDetail', { mode: 'create' })}
      >
        <Text style={styles.primaryButtonText}>Nuova lista</Text>
      </Pressable>

      {isLoading && <ActivityIndicator size="large" color="#2e7d32" />}
      {error && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={lists}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() =>
              navigation.navigate('ShoppingListDetail', { mode: 'detail', listId: item.id })
            }
          >
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardSub}>{item.status}</Text>
            <Text style={styles.cardMeta}>{item.items.length} elementi</Text>
          </Pressable>
        )}
        ListEmptyComponent={
          !isLoading ? <Text style={styles.empty}>Nessuna lista disponibile.</Text> : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f7f8f4' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 12, color: '#173a1a' },
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