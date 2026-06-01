export const MIGRATION_001_SQL = `
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY NOT NULL,
  ean TEXT,
  name TEXT NOT NULL,
  carbs_per_100g REAL NOT NULL,
  created_at TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_products_ean ON products(ean) WHERE ean IS NOT NULL;

CREATE TABLE IF NOT EXISTS product_units (
  id TEXT PRIMARY KEY NOT NULL,
  product_id TEXT NOT NULL,
  abbreviation TEXT NOT NULL,
  name TEXT NOT NULL,
  equivalent_in_grams REAL NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_product_units_product ON product_units(product_id);

CREATE TABLE IF NOT EXISTS global_units (
  id TEXT PRIMARY KEY NOT NULL,
  abbreviation TEXT NOT NULL,
  name TEXT NOT NULL,
  equivalent_in_grams REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS meals (
  id TEXT PRIMARY KEY NOT NULL,
  type TEXT NOT NULL,
  date TEXT NOT NULL,
  created_at TEXT NOT NULL,
  total_carbs REAL NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_meals_date ON meals(date);

CREATE TABLE IF NOT EXISTS meal_items (
  id TEXT PRIMARY KEY NOT NULL,
  meal_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  quantity REAL NOT NULL,
  unit_type TEXT NOT NULL,
  unit_id TEXT,
  FOREIGN KEY (meal_id) REFERENCES meals(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE INDEX IF NOT EXISTS idx_meal_items_meal ON meal_items(meal_id);
CREATE INDEX IF NOT EXISTS idx_meal_items_product ON meal_items(product_id);
`;

export const SEED_GLOBAL_UNITS_SQL = `
INSERT OR IGNORE INTO global_units (id, abbreviation, name, equivalent_in_grams)
VALUES
  ('global-teaspoon', 'càc', 'Cuillère à café', 5),
  ('global-tablespoon', 'càs', 'Cuillère à soupe', 15);
`;
