import { getDatabase } from '@/database/client';
import type { ProductUnit } from '@/types/productUnit';
import { generateId } from '@/utils/id';
import { scheduleWidgetSync } from '@/features/widgets/services/widgetSync.service';

type ProductUnitRow = {
  id: string;
  product_id: string;
  abbreviation: string;
  name: string;
  equivalent_in_grams: number;
};

const mapRow = (row: ProductUnitRow): ProductUnit => ({
  id: row.id,
  abbreviation: row.abbreviation,
  name: row.name,
  equivalentInGrams: row.equivalent_in_grams,
});

export const productUnitRepository = {
  async getByProductId(productId: string): Promise<ProductUnit[]> {
    const db = getDatabase();
    const rows = await db.getAllAsync<ProductUnitRow>(
      'SELECT * FROM product_units WHERE product_id = ? ORDER BY name',
      productId,
    );
    return rows.map(mapRow);
  },

  async create(
    productId: string,
    data: Omit<ProductUnit, 'id'>,
  ): Promise<ProductUnit> {
    const db = getDatabase();
    const unit: ProductUnit = { id: generateId(), ...data };
    await db.runAsync(
      `INSERT INTO product_units (id, product_id, abbreviation, name, equivalent_in_grams)
       VALUES (?, ?, ?, ?, ?)`,
      unit.id,
      productId,
      unit.abbreviation,
      unit.name,
      unit.equivalentInGrams,
    );
    scheduleWidgetSync();
    return unit;
  },

  async update(unit: ProductUnit, productId: string): Promise<void> {
    const db = getDatabase();
    await db.runAsync(
      `UPDATE product_units SET abbreviation = ?, name = ?, equivalent_in_grams = ?
       WHERE id = ? AND product_id = ?`,
      unit.abbreviation,
      unit.name,
      unit.equivalentInGrams,
      unit.id,
      productId,
    );
    scheduleWidgetSync();
  },

  async delete(id: string): Promise<void> {
    const db = getDatabase();
    await db.runAsync('DELETE FROM product_units WHERE id = ?', id);
    scheduleWidgetSync();
  },
};
