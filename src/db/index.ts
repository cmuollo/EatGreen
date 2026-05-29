
// ============================================================
// db/index.ts
// Barrel export del livello DB — espone solo le API pubbliche.
// ============================================================

export { initDatabase, closeDatabase, getDatabase } from './database';
export { CREATE_TABLES_SQL } from './schema';
export { seedDatabase } from './seed';