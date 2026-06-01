import { createMMKV } from 'react-native-mmkv';

import type { SQLiteDatabase } from 'expo-sqlite';

import { productEanRepository } from '@/repositories/productEan.repository';
import { generateId } from '@/utils/id';
import { isValidEan } from '@/utils/ean';

const CACHE_PREFIX = 'product:';
const MIGRATION_FLAG = 'migration_v2_done';

type LegacyProduct = {
  ean: string;
  name: string;
  carbsPer100g: number;
};

const getMmkv = () => createMMKV({ id: 'glucoscan-products' });

export const migrateFromMmkvIfNeeded = async (db: SQLiteDatabase): Promise<void> => {
  const mmkv = getMmkv();
  if (mmkv.getBoolean(MIGRATION_FLAG)) return;

  const keys = mmkv.getAllKeys().filter((key) => key.startsWith(CACHE_PREFIX));
  const now = new Date().toISOString();

  for (const key of keys) {
    const raw = mmkv.getString(key);
    if (!raw) continue;
    try {
      const legacy = JSON.parse(raw) as LegacyProduct;
      const id = generateId();
      await db.runAsync(
        `INSERT OR IGNORE INTO products (id, ean, name, carbs_per_100g, created_at)
         VALUES (?, NULL, ?, ?, ?)`,
        id,
        legacy.name,
        legacy.carbsPer100g,
        now,
      );
      const ean = legacy.ean?.trim();
      if (ean && isValidEan(ean)) {
        await productEanRepository.setForProduct(id, [ean]);
      }
    } catch {
      continue;
    }
  }

  mmkv.set(MIGRATION_FLAG, true);
};
