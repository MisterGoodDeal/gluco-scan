import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';

import { migrateFromMmkvIfNeeded } from '@/database/migrateFromMmkv';
import { migrateSettingsFromMmkvIfNeeded } from '@/database/migrateSettingsFromMmkv';
import { runMigrations } from '@/database/migrations';
import { runTutorialRecoveryIfNeeded } from '@/services/tutorial-recovery.service';
import { hydrateAppPreferences } from '@/store/preferences.store';
import { useCookingConversionStore } from '@/store/cookingConversion.store';

const DB_NAME = 'glucoscan.db';

let dbInstance: SQLiteDatabase | null = null;
let initPromise: Promise<SQLiteDatabase> | null = null;

export const initDatabase = async (): Promise<SQLiteDatabase> => {
  if (dbInstance) return dbInstance;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const db = await openDatabaseAsync(DB_NAME);
    dbInstance = db;
    await runMigrations(db);
    await runTutorialRecoveryIfNeeded();
    await migrateFromMmkvIfNeeded(db);
    await migrateSettingsFromMmkvIfNeeded(db);
    await hydrateAppPreferences();
    await useCookingConversionStore.getState().hydrate();
    return db;
  })();

  return initPromise;
};

export const getDatabase = (): SQLiteDatabase => {
  if (!dbInstance) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return dbInstance;
};
