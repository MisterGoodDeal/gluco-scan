import { MANUAL_CARBS_PRODUCT_ID } from '@/constants/manualCarbs';

export const MIGRATION_007_SQL = `
INSERT OR IGNORE INTO products (id, ean, name, carbs_per_100g, image_url, tags, custom_cooking_factor, created_at)
VALUES ('${MANUAL_CARBS_PRODUCT_ID}', NULL, 'Manual carbs', 100, NULL, '[]', NULL, datetime('now'));
`;
