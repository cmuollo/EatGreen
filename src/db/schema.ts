
// 
// db/schema.ts
// Definizione dello schema SQLite per Eat Green.
// Principio di separazione: questo file si occupa SOLO di
// descrivere la struttura fisica del DB (DDL).
// Nessuna logica di business, nessun accesso a state management.
// Il file viene importato da db/database.ts, che esegue le query di creazione
// al primo avvio dell'app.

/**
 * Istruzioni DDL per la creazione delle tabelle.
 * L'ordine rispetta i vincoli di FK (tabelle padre prima delle figlie).
 *
 * Modello ER sintetico:
 *
 *  ingredients ──< recipe_ingredients >── recipes
 *  recipes ──< meal_plan_entries >── meal_plans
 *  ingredients ──< shopping_list_items >── shopping_lists
 */

export const CREATE_TABLES_SQL = `
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  -- ─────────────────────────────────────────
  -- Catalogo ingredienti
  -- Macros espressi SEMPRE per 100 g/ml
  -- ─────────────────────────────────────────
  CREATE TABLE IF NOT EXISTS ingredients (
    id              TEXT PRIMARY KEY,
    name            TEXT NOT NULL,
    category        TEXT NOT NULL CHECK (category IN (
                      'carne_bianca','carne_rossa','pesce','legumi',
                      'frutta','verdura','latticini','prodotti_animali','vegano'
                    )),
    default_unit    TEXT NOT NULL DEFAULT 'g',
    -- macros per 100 g
    calories        REAL NOT NULL,   -- kcal
    protein         REAL NOT NULL,   -- g
    carbohydrates   REAL NOT NULL,   -- g
    fats            REAL NOT NULL,   -- g
    fiber           REAL             -- g, nullable
  );

  -- ─────────────────────────────────────────
  -- Ricette
  -- ─────────────────────────────────────────
  CREATE TABLE IF NOT EXISTS recipes (
    id                TEXT PRIMARY KEY,
    name              TEXT NOT NULL,
    description       TEXT NOT NULL DEFAULT '',
    category          TEXT NOT NULL CHECK (category IN (
                        'colazione','pranzo','cena','spuntino','altro'
                      )),
    prep_time_minutes INTEGER NOT NULL DEFAULT 0,
    difficulty        TEXT NOT NULL CHECK (difficulty IN ('facile','media','difficile')),
    servings          INTEGER NOT NULL DEFAULT 1,
    notes             TEXT
  );

  -- Tabella di join ricetta ↔ ingrediente (relazione N:M)
  -- Memorizza la quantità nella ricetta (non i macros: si calcolano runtime)
  CREATE TABLE IF NOT EXISTS recipe_ingredients (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    recipe_id      TEXT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    ingredient_id  TEXT NOT NULL REFERENCES ingredients(id) ON DELETE RESTRICT,
    quantity       REAL NOT NULL,
    unit           TEXT NOT NULL
  );

  -- ─────────────────────────────────────────
  -- Liste della spesa
  -- ─────────────────────────────────────────
  CREATE TABLE IF NOT EXISTS shopping_lists (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    status      TEXT NOT NULL DEFAULT 'attiva' CHECK (status IN ('attiva','completata','archiviata')),
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
  );

  -- Elementi della lista: riferiscono il catalogo ingredienti
  -- (no duplicazione di name/unit: si legge dalla tabella ingredients)
  CREATE TABLE IF NOT EXISTS shopping_list_items (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    shopping_list_id TEXT NOT NULL REFERENCES shopping_lists(id) ON DELETE CASCADE,
    ingredient_id    TEXT NOT NULL REFERENCES ingredients(id) ON DELETE RESTRICT,
    quantity         REAL NOT NULL,
    unit             TEXT NOT NULL,
    checked          INTEGER NOT NULL DEFAULT 0,  -- 0 = false, 1 = true
    notes            TEXT
  );

  -- ─────────────────────────────────────────
  -- Piani alimentari
  -- ─────────────────────────────────────────
  CREATE TABLE IF NOT EXISTS meal_plans (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    start_date  TEXT NOT NULL,   -- YYYY-MM-DD
    end_date    TEXT NOT NULL,
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
  );

  -- Voci del piano: ogni riga = 1 ricetta in 1 slot di 1 giornata
  -- Il piano NON duplica gli ingredienti: si ottengono via JOIN
  CREATE TABLE IF NOT EXISTS meal_plan_entries (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    meal_plan_id TEXT    NOT NULL REFERENCES meal_plans(id) ON DELETE CASCADE,
    entry_date   TEXT    NOT NULL,  -- YYYY-MM-DD
    slot         TEXT    NOT NULL CHECK (slot IN (
                   'colazione','spuntino_mattina','pranzo',
                   'spuntino_pomeriggio','cena'
                 )),
    recipe_id    TEXT    NOT NULL REFERENCES recipes(id) ON DELETE RESTRICT,
    servings     INTEGER NOT NULL DEFAULT 1,
    notes        TEXT,
    UNIQUE (meal_plan_id, entry_date, slot)  -- un solo pasto per slot al giorno
  );

  -- ─────────────────────────────────────────
  -- Indici per le query più frequenti
  -- ─────────────────────────────────────────
  CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_recipe   ON recipe_ingredients(recipe_id);
  CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_ingredient ON recipe_ingredients(ingredient_id);
  CREATE INDEX IF NOT EXISTS idx_shopping_list_items_list    ON shopping_list_items(shopping_list_id);
  CREATE INDEX IF NOT EXISTS idx_shopping_list_items_ing     ON shopping_list_items(ingredient_id);
  CREATE INDEX IF NOT EXISTS idx_meal_plan_entries_plan      ON meal_plan_entries(meal_plan_id);
  CREATE INDEX IF NOT EXISTS idx_meal_plan_entries_date      ON meal_plan_entries(entry_date);
  CREATE INDEX IF NOT EXISTS idx_ingredients_category        ON ingredients(category);
`;

