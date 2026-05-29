import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// TODO: implementare — schermata assegnata agli Ingegneri 2/3
export function RecipeListScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Ricette</Text>
      <Text style={styles.sub}>In sviluppo...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FBE7' },
  text:      { fontSize: 22, fontWeight: '600', color: '#2E7D32' },
  sub:       { fontSize: 14, color: '#9E9E9E', marginTop: 8 },
});
