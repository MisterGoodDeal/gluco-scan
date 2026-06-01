import { getDatabase } from '@/database/client';
import { generateId } from '@/utils/id';

type ProductEanRow = {
  product_id: string;
  ean: string;
};

export const productEanRepository = {
  async getByProductId(productId: string): Promise<string[]> {
    const db = getDatabase();
    const rows = await db.getAllAsync<{ ean: string }>(
      'SELECT ean FROM product_eans WHERE product_id = ? ORDER BY ean',
      productId,
    );
    return rows.map((r) => r.ean);
  },

  async getByProductIds(productIds: string[]): Promise<Map<string, string[]>> {
    const map = new Map<string, string[]>();
    if (productIds.length === 0) return map;

    const db = getDatabase();
    const placeholders = productIds.map(() => '?').join(',');
    const rows = await db.getAllAsync<ProductEanRow>(
      `SELECT product_id, ean FROM product_eans WHERE product_id IN (${placeholders}) ORDER BY ean`,
      ...productIds,
    );
    for (const row of rows) {
      const list = map.get(row.product_id) ?? [];
      list.push(row.ean);
      map.set(row.product_id, list);
    }
    return map;
  },

  async getProductIdByEan(ean: string): Promise<string | null> {
    const db = getDatabase();
    const row = await db.getFirstAsync<{ product_id: string }>(
      'SELECT product_id FROM product_eans WHERE ean = ?',
      ean,
    );
    return row?.product_id ?? null;
  },

  async findConflicts(
    eans: string[],
    excludeProductId?: string,
  ): Promise<string | null> {
    for (const ean of eans) {
      const ownerId = await this.getProductIdByEan(ean);
      if (ownerId != null && ownerId !== excludeProductId) {
        return ean;
      }
    }
    return null;
  },

  async setForProduct(productId: string, eans: string[]): Promise<void> {
    const db = getDatabase();
    const unique = [...new Set(eans.map((e) => e.trim()).filter(Boolean))];
    await db.runAsync('DELETE FROM product_eans WHERE product_id = ?', productId);
    for (const ean of unique) {
      await db.runAsync(
        'INSERT INTO product_eans (id, product_id, ean) VALUES (?, ?, ?)',
        generateId(),
        productId,
        ean,
      );
    }
  },
};
