import type { SQLiteDatabase } from 'expo-sqlite';

import { MIGRATION_001_SQL, SEED_GLOBAL_UNITS_SQL } from '@/database/migrations/001_initial';
import { MIGRATION_002_SQL } from '@/database/migrations/002_product_eans';
import { MIGRATION_003_SQL } from '@/database/migrations/003_app_preferences';
import { MIGRATION_004_SQL } from '@/database/migrations/004_product_image';
import { MIGRATION_005_SQL } from '@/database/migrations/005_tags_and_cooking';
import { MIGRATION_006_SQL } from '@/database/migrations/006_meal_type_schedule';
import { MIGRATION_007_SQL } from '@/database/migrations/007_manual_carbs_product';
import { backfillLegacyMealItems } from '@/database/backfillLegacyMealItems';
import { defaultMealTypeSchedule, serializeMealTypeSchedule } from '@/types/mealTypeSchedule';

const migrations: { version: number; sql: string; seed?: string; after?: (db: SQLiteDatabase) => Promise<void> }[] = [
  { version: 1, sql: MIGRATION_001_SQL, seed: SEED_GLOBAL_UNITS_SQL },
  { version: 2, sql: MIGRATION_002_SQL },
  { version: 3, sql: MIGRATION_003_SQL },
  { version: 4, sql: MIGRATION_004_SQL },
  {
    version: 5,
    sql: MIGRATION_005_SQL,
    after: backfillLegacyMealItems,
  },
  {
    version: 6,
    sql: MIGRATION_006_SQL,
    after: async (db) => {
      await db.runAsync(
        `UPDATE app_preferences SET meal_type_schedule = ? WHERE meal_type_schedule IS NULL`,
        serializeMealTypeSchedule(defaultMealTypeSchedule),
      );
    },
  },
  { version: 7, sql: MIGRATION_007_SQL },
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
    if (migration.after) {
      await migration.after(db);
    }
    currentVersion = migration.version;
    await db.execAsync(`PRAGMA user_version = ${migration.version}`);
  }
};
