import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';

const DB_NAME = 'glucoscan.db';

let dbInstance: SQLiteDatabase | null = null;
let initPromise: Promise<SQLiteDatabase> | null = null;

export const initDatabase = async (): Promise<SQLiteDatabase> => {
  if (dbInstance) return dbInstance;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const db = await openDatabaseAsync(DB_NAME);
    dbInstance = db;
    const { bootstrapDatabase } = await import('@/database/bootstrap');
    await bootstrapDatabase(db);
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
