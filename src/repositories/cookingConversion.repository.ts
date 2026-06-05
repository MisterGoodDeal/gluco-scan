import { getDatabase } from '@/database/client';
import { DEFAULT_COOKING_CONVERSIONS } from '@/constants/cooking-conversions';
import type { CookingConversion } from '@/types/cookingConversion';
import type { ProductTag } from '@/types/productTag';

type CookingConversionRow = {
  tag: string;
  cooked_factor: number;
};

export const cookingConversionRepository = {
  async getAll(): Promise<CookingConversion[]> {
    const db = getDatabase();
    const rows = await db.getAllAsync<CookingConversionRow>(
      'SELECT tag, cooked_factor FROM cooking_conversions ORDER BY tag',
    );
    return rows.map((row) => ({
      tag: row.tag as ProductTag,
      cookedFactor: row.cooked_factor,
    }));
  },

  async getByTag(tag: ProductTag): Promise<CookingConversion | null> {
    const db = getDatabase();
    const row = await db.getFirstAsync<CookingConversionRow>(
      'SELECT tag, cooked_factor FROM cooking_conversions WHERE tag = ?',
      tag,
    );
    if (!row) return null;
    return { tag: row.tag as ProductTag, cookedFactor: row.cooked_factor };
  },

  async upsert(conversion: CookingConversion): Promise<void> {
    const db = getDatabase();
    await db.runAsync(
      `INSERT INTO cooking_conversions (tag, cooked_factor)
       VALUES (?, ?)
       ON CONFLICT(tag) DO UPDATE SET cooked_factor = excluded.cooked_factor`,
      conversion.tag,
      conversion.cookedFactor,
    );
  },

  async seedDefaults(): Promise<void> {
    for (const conversion of DEFAULT_COOKING_CONVERSIONS) {
      await this.upsert(conversion);
    }
  },
};
