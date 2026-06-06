import {
  createTutorialBackup,
  deleteTutorialBackup,
  readTutorialBackupBytes,
  tutorialBackupExists,
} from '@/services/tutorial-backup.service';
import { loadTutorialAssetBytes } from '@/services/tutorial-asset.service';
import { importFromGsBytes } from '@/services/import-export.service';
import { useMealStore } from '@/store/meal.store';
import { useProductStore } from '@/store/product.store';
import { hydrateAppPreferences } from '@/store/preferences.store';
import { useSettingsStore } from '@/store/settings.store';
import { tutorialMmkv } from '@/utils/tutorialMmkv';
import { flushWidgetSync } from '@/features/widgets/services/widgetSync.service';

export const hydrateAllStores = async (): Promise<void> => {
  await Promise.all([
    useProductStore.getState().hydrate(),
    useMealStore.getState().hydrateDay(),
    useSettingsStore.getState().hydrate(),
    hydrateAppPreferences(),
  ]);
};

export const safeRestoreFromBackup = async (): Promise<boolean> => {
  if (!tutorialBackupExists()) {
    tutorialMmkv.setIsTutorialRunning(false);
    return false;
  }
  try {
    const bytes = await readTutorialBackupBytes();
    await importFromGsBytes(bytes, { mode: 'replace' });
    deleteTutorialBackup();
    tutorialMmkv.setIsTutorialRunning(false);
    tutorialMmkv.setCurrentStep(0);
    await hydrateAllStores();
    return true;
  } catch {
    return false;
  }
};

export const startTutorialSession = async (): Promise<void> => {
  await createTutorialBackup();
  tutorialMmkv.setIsTutorialRunning(true);
  tutorialMmkv.setCurrentStep(0);

  try {
    const tutorialBytes = await loadTutorialAssetBytes();
    await importFromGsBytes(tutorialBytes, { mode: 'replace' });
    await hydrateAllStores();
  } catch (error) {
    await safeRestoreFromBackup();
    throw error;
  }
};

export const endTutorialSession = async (markSeen: boolean): Promise<void> => {
  try {
    if (!tutorialBackupExists()) {
      throw new Error('Tutorial backup missing');
    }
    const bytes = await readTutorialBackupBytes();
    await importFromGsBytes(bytes, { mode: 'replace' });
    deleteTutorialBackup();
    tutorialMmkv.setIsTutorialRunning(false);
    tutorialMmkv.setCurrentStep(0);
    if (markSeen) {
      tutorialMmkv.setHasSeenTutorial(true);
    }
    await hydrateAllStores();
    if (markSeen) {
      await flushWidgetSync();
    }
  } catch (error) {
    await safeRestoreFromBackup();
    throw error;
  }
};
