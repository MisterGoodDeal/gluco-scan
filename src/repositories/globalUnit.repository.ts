import { getDatabase } from '@/database/client';
import type { GlobalUnit } from '@/types/globalUnit';
import { generateId } from '@/utils/id';

type GlobalUnitRow = {
  id: string;
  abbreviation: string;
  name: string;
  equivalent_in_grams: number;
};

const mapRow = (row: GlobalUnitRow): GlobalUnit => ({
  id: row.id,
  abbreviation: row.abbreviation,
  name: row.name,
  equivalentInGrams: row.equivalent_in_grams,
});

export const globalUnitRepository = {
  async getAll(): Promise<GlobalUnit[]> {
    const db = getDatabase();
    const rows = await db.getAllAsync<GlobalUnitRow>(
      'SELECT * FROM global_units ORDER BY name',
    );
    return rows.map(mapRow);
  },

  async create(data: Omit<GlobalUnit, 'id'>): Promise<GlobalUnit> {
    const db = getDatabase();
    const unit: GlobalUnit = { id: generateId(), ...data };
    await db.runAsync(
      `INSERT INTO global_units (id, abbreviation, name, equivalent_in_grams)
       VALUES (?, ?, ?, ?)`,
      unit.id,
      unit.abbreviation,
      unit.name,
      unit.equivalentInGrams,
    );
    return unit;
  },

  async update(unit: GlobalUnit): Promise<void> {
    const db = getDatabase();
    await db.runAsync(
      `UPDATE global_units SET abbreviation = ?, name = ?, equivalent_in_grams = ? WHERE id = ?`,
      unit.abbreviation,
      unit.name,
      unit.equivalentInGrams,
      unit.id,
    );
  },

  async delete(id: string): Promise<void> {
    const db = getDatabase();
    await db.runAsync('DELETE FROM global_units WHERE id = ?', id);
  },
};
