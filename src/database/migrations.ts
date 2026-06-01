import type { SQLiteDatabase } from 'expo-sqlite';

import { MIGRATION_001_SQL, SEED_GLOBAL_UNITS_SQL } from '@/database/migrations/001_initial';
import { MIGRATION_002_SQL } from '@/database/migrations/002_product_eans';
import { MIGRATION_003_SQL } from '@/database/migrations/003_app_preferences';

const migrations: { version: number; sql: string; seed?: string }[] = [
  { version: 1, sql: MIGRATION_001_SQL, seed: SEED_GLOBAL_UNITS_SQL },
  { version: 2, sql: MIGRATION_002_SQL },
  { version: 3, sql: MIGRATION_003_SQL },
];

export const runMigrations = async (db: SQLiteDatabase): Promise<void> => {
  const result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  let currentVersion = result?.user_version ?? 0;

  for (const migration of migrations) {
    if (migration.version <= currentVersion) continue;
    await db.execAsync(migration.sql);
    if (migration.seed) {
      await db.execAsync(migration.seed);
    }
    currentVersion = migration.version;
    await db.execAsync(`PRAGMA user_version = ${migration.version}`);
  }
};
