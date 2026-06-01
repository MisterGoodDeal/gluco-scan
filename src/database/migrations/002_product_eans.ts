export const MIGRATION_002_SQL = `
CREATE TABLE IF NOT EXISTS product_eans (
  id TEXT PRIMARY KEY NOT NULL,
  product_id TEXT NOT NULL,
  ean TEXT NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_product_eans_ean ON product_eans(ean);
CREATE INDEX IF NOT EXISTS idx_product_eans_product ON product_eans(product_id);

INSERT OR IGNORE INTO product_eans (id, product_id, ean)
SELECT 'legacy-' || id, id, ean FROM products WHERE ean IS NOT NULL AND trim(ean) != '';

DROP INDEX IF EXISTS idx_products_ean;
`;
