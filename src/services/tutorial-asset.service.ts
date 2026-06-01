import { File, Paths } from 'expo-file-system';

import { TUTORIAL_PAYLOAD } from '@/data/tutorialPayload';
import { deserializePayload, serializePayload } from '@/services/import-export.service';

const bundledTutorialFile = () => new File(Paths.bundle, 'assets/tutorial/tutorial.gs');

export const loadTutorialAssetBytes = async (): Promise<Uint8Array> => {
  try {
    const bundled = bundledTutorialFile();
    if (bundled.exists) {
      return bundled.bytes();
    }
  } catch {
    // Bundle path unavailable in dev — fall back to in-app payload
  }

  return serializePayload(TUTORIAL_PAYLOAD);
};

export const loadTutorialPayload = async () => deserializePayload(await loadTutorialAssetBytes());
