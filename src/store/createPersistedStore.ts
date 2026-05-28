/**
 * Factory che crea uno Zustand store con persistenza AsyncStorage.
 * Usata da tutti gli store per evitare di ripetere la configurazione (DRY).
 */
import { create, StateCreator } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function createPersistedStore<T>(key: string, storeCreator: StateCreator<T>) {
  return create<T>()(
    persist(storeCreator, {
      name: key,
      storage: createJSONStorage(() => AsyncStorage),
    })
  );
}
