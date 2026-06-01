import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';

import { migrateFromMmkvIfNeeded } from '@/database/migrateFromMmkv';
import { runMigrations } from '@/database/migrations';

const DB_NAME = 'glucoscan.db';

let dbInstance: SQLiteDatabase | null = null;
let initPromise: Promise<SQLiteDatabase> | null = null;

export const initDatabase = async (): Promise<SQLiteDatabase> => {
  if (dbInstance) return dbInstance;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const db = await openDatabaseAsync(DB_NAME);
    await runMigrations(db);
    await migrateFromMmkvIfNeeded(db);
    dbInstance = db;
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
