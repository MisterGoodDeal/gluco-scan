import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { buildExportPayload, serializePayload } from '@/services/import-export.service';

export {
  buildExportPayload,
  deserializePayload,
  importFromGsBytes,
  importPayload,
  serializePayload,
} from '@/services/import-export.service';
export type { ImportMode, ImportOptions } from '@/services/import-export.service';

export const exportToGsFile = async (): Promise<string> => {
  const payload = await buildExportPayload();
  const compressed = serializePayload(payload);
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const filename = `export-${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}.gs`;
  const file = new File(Paths.cache, filename);
  file.write(compressed);

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(file.uri, {
      mimeType: 'application/octet-stream',
      UTI: 'public.data',
    });
  }

  return file.uri;
};

export const writeGsFile = async (filename: string, bytes: Uint8Array): Promise<string> => {
  const file = new File(Paths.document, filename);
  file.write(bytes);
  return file.uri;
};
