import {
  deleteTutorialBackup,
  readTutorialBackupBytes,
  tutorialBackupExists,
} from '@/services/tutorial-backup.service';
import { importFromGsBytes } from '@/services/import-export.service';
import { hydrateAllStores } from '@/services/tutorial.service';
import { tutorialMmkv } from '@/utils/tutorialMmkv';

export type TutorialRecoveryResult =
  | { recovered: false }
  | { recovered: true }
  | { recovered: false; critical: true };

export const runTutorialRecoveryIfNeeded = async (): Promise<TutorialRecoveryResult> => {
  const isRunning = tutorialMmkv.getIsTutorialRunning();
  const hasBackup = tutorialBackupExists();

  if (!isRunning && !hasBackup) {
    return { recovered: false };
  }

  if (isRunning && !hasBackup) {
    tutorialMmkv.setIsTutorialRunning(false);
    return { recovered: false, critical: true };
  }

  if (!isRunning && hasBackup) {
    deleteTutorialBackup();
    return { recovered: false };
  }

  const bytes = await readTutorialBackupBytes();
  await importFromGsBytes(bytes, { mode: 'replace' });
  deleteTutorialBackup();
  tutorialMmkv.setIsTutorialRunning(false);
  tutorialMmkv.setCurrentStep(0);
  await hydrateAllStores();

  return { recovered: true };
};
