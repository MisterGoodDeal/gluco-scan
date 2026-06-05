export const MIGRATION_005_SQL = `
ALTER TABLE products ADD COLUMN tags TEXT NOT NULL DEFAULT '[]';
ALTER TABLE products ADD COLUMN custom_cooking_factor REAL;

ALTER TABLE meal_items ADD COLUMN quantity_type TEXT NOT NULL DEFAULT 'raw';
ALTER TABLE meal_items ADD COLUMN raw_equivalent_quantity REAL;
ALTER TABLE meal_items ADD COLUMN carbs REAL;

CREATE TABLE IF NOT EXISTS cooking_conversions (
  tag TEXT PRIMARY KEY NOT NULL,
  cooked_factor REAL NOT NULL
);

INSERT OR IGNORE INTO cooking_conversions (tag, cooked_factor) VALUES ('pasta', 2.5);
INSERT OR IGNORE INTO cooking_conversions (tag, cooked_factor) VALUES ('rice', 3);
INSERT OR IGNORE INTO cooking_conversions (tag, cooked_factor) VALUES ('semolina', 2.7);
INSERT OR IGNORE INTO cooking_conversions (tag, cooked_factor) VALUES ('couscous', 2.7);
INSERT OR IGNORE INTO cooking_conversions (tag, cooked_factor) VALUES ('quinoa', 2.7);
INSERT OR IGNORE INTO cooking_conversions (tag, cooked_factor) VALUES ('bulgur', 2.5);
INSERT OR IGNORE INTO cooking_conversions (tag, cooked_factor) VALUES ('lentils', 2.3);
INSERT OR IGNORE INTO cooking_conversions (tag, cooked_factor) VALUES ('chickpeas', 2.4);
INSERT OR IGNORE INTO cooking_conversions (tag, cooked_factor) VALUES ('beans', 2.3);
INSERT OR IGNORE INTO cooking_conversions (tag, cooked_factor) VALUES ('potato', 1);
INSERT OR IGNORE INTO cooking_conversions (tag, cooked_factor) VALUES ('bread', 1);
INSERT OR IGNORE INTO cooking_conversions (tag, cooked_factor) VALUES ('cereal', 1.5);
`;
