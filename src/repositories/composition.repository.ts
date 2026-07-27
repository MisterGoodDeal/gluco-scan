import { getDatabase } from '@/database/client';
import type { Composition } from '@/types/composition';
import type { CompositionItem } from '@/types/compositionItem';
import { generateId } from '@/utils/id';

type CompositionRow = {
  id: string;
  name: string;
  created_at: string;
  total_carbs: number;
};

type CompositionItemRow = {
  id: string;
  composition_id: string;
  product_id: string;
  quantity: number;
  unit_type: string;
  unit_id: string | null;
  quantity_type: string;
  raw_equivalent_quantity: number;
  carbs: number;
  product_name: string;
  image_url: string | null;
  unit_label: string;
};

export type CreateCompositionInput = {
  name: string;
  createdAt?: string;
  items: Omit<CompositionItem, 'id'>[];
};

const mapItemRow = (row: CompositionItemRow): CompositionItem => ({
  id: row.id,
  productId: row.product_id,
  quantity: row.quantity,
  unitType: row.unit_type as CompositionItem['unitType'],
  unitId: row.unit_id ?? undefined,
  quantityType: row.quantity_type as CompositionItem['quantityType'],
  rawEquivalentQuantity: row.raw_equivalent_quantity,
  productName: row.product_name,
  imageUrl: row.image_url,
  carbs: row.carbs,
  unitLabel: row.unit_label,
});

const loadComposition = async (row: CompositionRow): Promise<Composition> => {
  const db = getDatabase();
  const itemRows = await db.getAllAsync<CompositionItemRow>(
    'SELECT * FROM composition_items WHERE composition_id = ? ORDER BY rowid',
    row.id,
  );

  return {
    id: row.id,
    name: row.name,
    createdAt: row.created_at,
    totalCarbs: row.total_carbs,
    items: itemRows.map(mapItemRow),
  };
};

const sumCarbs = (items: Array<Pick<CompositionItem, 'carbs'>>) =>
  items.reduce((total, item) => total + item.carbs, 0);

export const compositionRepository = {
  async getAll(): Promise<Composition[]> {
    const db = getDatabase();
    const rows = await db.getAllAsync<CompositionRow>(
      'SELECT * FROM compositions ORDER BY lower(name), created_at',
    );
    const compositions: Composition[] = [];
    for (const row of rows) {
      compositions.push(await loadComposition(row));
    }
    return compositions;
  },

  async getById(id: string): Promise<Composition | null> {
    const db = getDatabase();
    const row = await db.getFirstAsync<CompositionRow>('SELECT * FROM compositions WHERE id = ?', id);
    if (!row) return null;
    return loadComposition(row);
  },

  async search(query: string): Promise<Composition[]> {
    const trimmed = query.trim();
    if (trimmed.length < 3) return [];

    const db = getDatabase();
    const rows = await db.getAllAsync<CompositionRow>(
      `SELECT * FROM compositions
       WHERE lower(name) LIKE ?
       ORDER BY lower(name), created_at`,
      `%${trimmed.toLowerCase()}%`,
    );

    const compositions: Composition[] = [];
    for (const row of rows) {
      compositions.push(await loadComposition(row));
    }
    return compositions;
  },

  async createWithItems(input: CreateCompositionInput): Promise<Composition> {
    const db = getDatabase();
    const id = generateId();
    const createdAt = input.createdAt ?? new Date().toISOString();
    const totalCarbs = sumCarbs(input.items);

    await db.withTransactionAsync(async () => {
      await db.runAsync(
        `INSERT INTO compositions (id, name, created_at, total_carbs)
         VALUES (?, ?, ?, ?)`,
        id,
        input.name,
        createdAt,
        totalCarbs,
      );

      for (const item of input.items) {
        await db.runAsync(
          `INSERT INTO composition_items (
            id, composition_id, product_id, quantity, unit_type, unit_id, quantity_type,
            raw_equivalent_quantity, carbs, product_name, image_url, unit_label
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          generateId(),
          id,
          item.productId,
          item.quantity,
          item.unitType,
          item.unitId ?? null,
          item.quantityType ?? 'raw',
          item.rawEquivalentQuantity,
          item.carbs,
          item.productName,
          item.imageUrl ?? null,
          item.unitLabel,
        );
      }
    });

    const composition = await this.getById(id);
    if (!composition) throw new Error('Failed to create composition');
    return composition;
  },

  async updateWithItems(
    id: string,
    input: CreateCompositionInput,
  ): Promise<Composition> {
    const db = getDatabase();
    const totalCarbs = sumCarbs(input.items);

    await db.withTransactionAsync(async () => {
      await db.runAsync(
        `UPDATE compositions SET name = ?, total_carbs = ? WHERE id = ?`,
        input.name,
        totalCarbs,
        id,
      );
      await db.runAsync('DELETE FROM composition_items WHERE composition_id = ?', id);

      for (const item of input.items) {
        await db.runAsync(
          `INSERT INTO composition_items (
            id, composition_id, product_id, quantity, unit_type, unit_id, quantity_type,
            raw_equivalent_quantity, carbs, product_name, image_url, unit_label
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          generateId(),
          id,
          item.productId,
          item.quantity,
          item.unitType,
          item.unitId ?? null,
          item.quantityType ?? 'raw',
          item.rawEquivalentQuantity,
          item.carbs,
          item.productName,
          item.imageUrl ?? null,
          item.unitLabel,
        );
      }
    });

    const composition = await this.getById(id);
    if (!composition) throw new Error('Failed to update composition');
    return composition;
  },

  async delete(id: string): Promise<void> {
    const db = getDatabase();
    await db.runAsync('DELETE FROM compositions WHERE id = ?', id);
  },
};
