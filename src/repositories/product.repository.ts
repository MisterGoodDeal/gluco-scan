import { getDatabase } from '@/database/client';
import { productUnitRepository } from '@/repositories/productUnit.repository';
import type { Product } from '@/types/product';
import { generateId } from '@/utils/id';

type ProductRow = {
  id: string;
  ean: string | null;
  name: string;
  carbs_per_100g: number;
  created_at: string;
  usage_count?: number;
};

const mapRow = (row: ProductRow, customUnits: Product['customUnits'] = []): Product => ({
  id: row.id,
  ean: row.ean ?? undefined,
  name: row.name,
  carbsPer100g: row.carbs_per_100g,
  customUnits,
  usageCount: row.usage_count ?? 0,
});

export const productRepository = {
  async getAll(): Promise<Product[]> {
    const db = getDatabase();
    const rows = await db.getAllAsync<ProductRow>(
      `SELECT p.*, COUNT(mi.id) as usage_count
       FROM products p
       LEFT JOIN meal_items mi ON mi.product_id = p.id
       GROUP BY p.id
       ORDER BY p.name`,
    );
    const products: Product[] = [];
    for (const row of rows) {
      const units = await productUnitRepository.getByProductId(row.id);
      products.push(mapRow(row, units));
    }
    return products;
  },

  async search(query: string): Promise<Product[]> {
    const all = await this.getAll();
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return all;
    return all.filter(
      (p) =>
        p.name.toLowerCase().includes(trimmed) ||
        (p.ean?.includes(trimmed) ?? false),
    );
  },

  async getById(id: string): Promise<Product | null> {
    const db = getDatabase();
    const row = await db.getFirstAsync<ProductRow>(
      `SELECT p.*, COUNT(mi.id) as usage_count
       FROM products p
       LEFT JOIN meal_items mi ON mi.product_id = p.id
       WHERE p.id = ?
       GROUP BY p.id`,
      id,
    );
    if (!row) return null;
    const units = await productUnitRepository.getByProductId(id);
    return mapRow(row, units);
  },

  async getByEan(ean: string): Promise<Product | null> {
    const db = getDatabase();
    const row = await db.getFirstAsync<ProductRow>(
      'SELECT * FROM products WHERE ean = ?',
      ean,
    );
    if (!row) return null;
    const units = await productUnitRepository.getByProductId(row.id);
    return mapRow(row, units);
  },

  async create(data: {
    name: string;
    carbsPer100g: number;
    ean?: string;
  }): Promise<Product> {
    const db = getDatabase();
    const id = generateId();
    const now = new Date().toISOString();
    await db.runAsync(
      `INSERT INTO products (id, ean, name, carbs_per_100g, created_at)
       VALUES (?, ?, ?, ?, ?)`,
      id,
      data.ean ?? null,
      data.name,
      data.carbsPer100g,
      now,
    );
    const product = await this.getById(id);
    if (!product) throw new Error('Failed to create product');
    return product;
  },

  async update(product: Product): Promise<Product> {
    const db = getDatabase();
    await db.runAsync(
      `UPDATE products SET ean = ?, name = ?, carbs_per_100g = ? WHERE id = ?`,
      product.ean ?? null,
      product.name,
      product.carbsPer100g,
      product.id,
    );
    const updated = await this.getById(product.id);
    if (!updated) throw new Error('Failed to update product');
    return updated;
  },

  async delete(id: string): Promise<void> {
    const db = getDatabase();
    await db.runAsync('DELETE FROM products WHERE id = ?', id);
  },

  async getUsageCount(id: string): Promise<number> {
    const db = getDatabase();
    const row = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM meal_items WHERE product_id = ?',
      id,
    );
    return row?.count ?? 0;
  },
};
