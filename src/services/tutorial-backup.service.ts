import { File, Paths } from 'expo-file-system';

import { TUTORIAL_BACKUP_FILENAME } from '@/constants/tutorial';
import { tutorialMmkv } from '@/utils/tutorialMmkv';
import { buildExportPayload, serializePayload } from '@/services/import-export.service';

const backupFile = () => new File(Paths.document, TUTORIAL_BACKUP_FILENAME);

export const tutorialBackupExists = (): boolean => backupFile().exists;

export const createTutorialBackup = async (): Promise<void> => {
  if (tutorialMmkv.getIsTutorialRunning() && tutorialBackupExists()) {
    throw new Error('Tutorial backup already exists while tutorial is running');
  }
  const payload = await buildExportPayload();
  const bytes = serializePayload(payload);
  backupFile().write(bytes);
};

export const readTutorialBackupBytes = async (): Promise<Uint8Array> => {
  if (!tutorialBackupExists()) {
    throw new Error('Tutorial backup file not found');
  }
  return backupFile().bytes();
};

export const deleteTutorialBackup = (): void => {
  if (tutorialBackupExists()) {
    backupFile().delete();
  }
};
