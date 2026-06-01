import { getDatabase } from '@/database/client';
import { productEanRepository } from '@/repositories/productEan.repository';
import { productUnitRepository } from '@/repositories/productUnit.repository';
import type { Product } from '@/types/product';
import { generateId } from '@/utils/id';
import { productMatchesQuery } from '@/utils/productSearch';

type ProductRow = {
  id: string;
  name: string;
  carbs_per_100g: number;
  image_url: string | null;
  created_at: string;
  usage_count?: number;
};

const mapRow = (
  row: ProductRow,
  customUnits: Product['customUnits'],
  eans: string[],
): Product => ({
  id: row.id,
  eans,
  name: row.name,
  carbsPer100g: row.carbs_per_100g,
  imageUrl: row.image_url,
  customUnits,
  usageCount: row.usage_count ?? 0,
});

const loadProduct = async (row: ProductRow): Promise<Product> => {
  const [units, eans] = await Promise.all([
    productUnitRepository.getByProductId(row.id),
    productEanRepository.getByProductId(row.id),
  ]);
  return mapRow(row, units, eans);
};

export const productRepository = {
  async getAll(): Promise<Product[]> {
    const db = getDatabase();
    const rows = await db.getAllAsync<ProductRow>(
      `SELECT p.id, p.name, p.carbs_per_100g, p.image_url, p.created_at, COUNT(mi.id) as usage_count
       FROM products p
       LEFT JOIN meal_items mi ON mi.product_id = p.id
       GROUP BY p.id
       ORDER BY p.name`,
    );
    const eansByProduct = await productEanRepository.getByProductIds(rows.map((r) => r.id));
    const products: Product[] = [];
    for (const row of rows) {
      const units = await productUnitRepository.getByProductId(row.id);
      products.push(mapRow(row, units, eansByProduct.get(row.id) ?? []));
    }
    return products;
  },

  async search(query: string): Promise<Product[]> {
    const all = await this.getAll();
    return all.filter((p) => productMatchesQuery(p, query));
  },

  async getById(id: string): Promise<Product | null> {
    const db = getDatabase();
    const row = await db.getFirstAsync<ProductRow>(
      `SELECT p.id, p.name, p.carbs_per_100g, p.image_url, p.created_at, COUNT(mi.id) as usage_count
       FROM products p
       LEFT JOIN meal_items mi ON mi.product_id = p.id
       WHERE p.id = ?
       GROUP BY p.id`,
      id,
    );
    if (!row) return null;
    return loadProduct(row);
  },

  async getByEan(ean: string): Promise<Product | null> {
    const productId = await productEanRepository.getProductIdByEan(ean);
    if (!productId) return null;
    return this.getById(productId);
  },

  async create(data: {
    name: string;
    carbsPer100g: number;
    eans?: string[];
    imageUrl?: string | null;
  }): Promise<Product> {
    const db = getDatabase();
    const id = generateId();
    const now = new Date().toISOString();
    await db.runAsync(
      `INSERT INTO products (id, ean, name, carbs_per_100g, image_url, created_at)
       VALUES (?, NULL, ?, ?, ?, ?)`,
      id,
      data.name,
      data.carbsPer100g,
      data.imageUrl ?? null,
      now,
    );
    await productEanRepository.setForProduct(id, data.eans ?? []);
    const product = await this.getById(id);
    if (!product) throw new Error('Failed to create product');
    return product;
  },

  async update(product: Product): Promise<Product> {
    const db = getDatabase();
    await db.runAsync(
      `UPDATE products SET name = ?, carbs_per_100g = ?, image_url = ? WHERE id = ?`,
      product.name,
      product.carbsPer100g,
      product.imageUrl ?? null,
      product.id,
    );
    await productEanRepository.setForProduct(product.id, product.eans);
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
