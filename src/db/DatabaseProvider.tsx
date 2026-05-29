// ============================================================
// db/DatabaseProvider.tsx
// Provider React che inizializza il DB e il seed all'avvio.
// Va wrappato attorno all'intera app in App.tsx.
// ============================================================

import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { initDatabase } from './database';
import { seedDatabase } from './seed';

interface Props {
  children: React.ReactNode;
}

export function DatabaseProvider({ children }: Props) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        await initDatabase();   // Crea le tabelle se non esistono
        await seedDatabase();   // Inserisce i dati iniziali (INSERT OR IGNORE)
        setReady(true);
      } catch (e) {
        setError((e as Error).message);
      }
    })();
  }, []);

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Errore DB: {error}</Text>
      </View>
    );
  }

  if (!ready) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.label}>Inizializzazione...</Text>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  error:  { color: 'red', textAlign: 'center', padding: 16 },
  label:  { marginTop: 8, color: '#666' },
});