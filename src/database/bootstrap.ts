import type { SQLiteDatabase } from 'expo-sqlite';

import { migrateFromMmkvIfNeeded } from '@/database/migrateFromMmkv';
import { migrateSettingsFromMmkvIfNeeded } from '@/database/migrateSettingsFromMmkv';
import { runMigrations } from '@/database/migrations';
import { runTutorialRecoveryIfNeeded } from '@/services/tutorial-recovery.service';
import { hydrateAppPreferences } from '@/store/preferences.store';
import { useCookingConversionStore } from '@/store/cookingConversion.store';

export const bootstrapDatabase = async (db: SQLiteDatabase): Promise<void> => {
  await runMigrations(db);
  await runTutorialRecoveryIfNeeded();
  await migrateFromMmkvIfNeeded(db);
  await migrateSettingsFromMmkvIfNeeded(db);
  await hydrateAppPreferences();
  await useCookingConversionStore.getState().hydrate();
};
