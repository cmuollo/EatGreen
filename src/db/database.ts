
// Livello di accesso fisico al DB (Data Access Layer).
// Responsabilità: aprire/chiudere la connessione SQLite,
// eseguire query parametrizzate, gestire transazioni.
// NON contiene logica di business né dipende da Redux/Zustand.
// Il file espone funzioni asincrone per l'inizializzazione e la chiusura del DB,
// che vanno chiamate rispettivamente all'avvio e alla chiusura dell'app.
// Le query di creazione tabelle sono importate da db/schema.ts, che si occupa
// solo di definire la struttura del DB (DDL).


import * as SQLite from 'expo-sqlite';
import { CREATE_TABLES_SQL } from './schema';

/** Singleton della connessione al database */
// Manteniamo una variabile privata per la connessione, inizialmente null.
let _db: SQLite.SQLiteDatabase | null = null;

/**
 * Restituisce (o apre) la connessione al database.
 * Usa il pattern singleton per evitare aperture multiple.
 */
export function getDatabase(): SQLite.SQLiteDatabase {
  if (!_db) {
    // Apertura connessione (se non esiste già)
    _db = SQLite.openDatabaseSync('eat_green.db');
  }
  return _db;
}

/**
 * Inizializza il DB: crea le tabelle se non esistono.
 * Va chiamata all'avvio dell'app (es. in App.tsx o nel provider).
 */
export async function initDatabase(): Promise<void> {
  const db = getDatabase();
  // execAsync esegue più statement separati da ";"
  await db.execAsync(CREATE_TABLES_SQL);
}

/**
 * Chiude la connessione al database.
 * Da chiamare solo quando l'app va in background prolungato
 * o viene smontata del tutto.
 */
export async function closeDatabase(): Promise<void> {
  if (_db) {
    await _db.closeAsync();
    _db = null;
  }
}


