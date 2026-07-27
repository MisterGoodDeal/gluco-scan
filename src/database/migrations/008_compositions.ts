export const MIGRATION_008_SQL = `
CREATE TABLE IF NOT EXISTS compositions (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  created_at TEXT NOT NULL,
  total_carbs REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS composition_items (
  id TEXT PRIMARY KEY NOT NULL,
  composition_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  quantity REAL NOT NULL,
  unit_type TEXT NOT NULL,
  unit_id TEXT,
  quantity_type TEXT NOT NULL,
  raw_equivalent_quantity REAL NOT NULL,
  carbs REAL NOT NULL,
  product_name TEXT NOT NULL,
  image_url TEXT,
  unit_label TEXT NOT NULL,
  FOREIGN KEY (composition_id) REFERENCES compositions(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE INDEX IF NOT EXISTS idx_compositions_name ON compositions(name);
CREATE INDEX IF NOT EXISTS idx_composition_items_composition ON composition_items(composition_id);
CREATE INDEX IF NOT EXISTS idx_composition_items_product ON composition_items(product_id);

ALTER TABLE meals ADD COLUMN source_composition_id TEXT;
ALTER TABLE meals ADD COLUMN source_composition_name TEXT;
`;
