import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { gzipSync, gunzipSync, strToU8, strFromU8 } from 'fflate';

import { getDatabase } from '@/database/client';
import { appPreferencesRepository } from '@/repositories/appPreferences.repository';
import { globalUnitRepository } from '@/repositories/globalUnit.repository';
import { mealRepository } from '@/repositories/meal.repository';
import { productEanRepository } from '@/repositories/productEan.repository';
import { productRepository } from '@/repositories/product.repository';
import { productUnitRepository } from '@/repositories/productUnit.repository';
import type { ExportPayload } from '@/types/exportPayload';
import { usePreferencesStore } from '@/store/preferences.store';
import { normalizeExportProduct } from '@/utils/exportProduct';

const EXPORT_VERSION = 3;
const SUPPORTED_EXPORT_VERSIONS = [1, 2, 3] as const;

export const buildExportPayload = async (): Promise<ExportPayload> => ({
  version: EXPORT_VERSION,
  exportedAt: new Date().toISOString(),
  products: await productRepository.getAll(),
  meals: await mealRepository.getAllForExport(),
  globalUnits: await globalUnitRepository.getAll(),
  preferences: await appPreferencesRepository.get(),
});

export const serializePayload = (payload: ExportPayload): Uint8Array => {
  const json = JSON.stringify(payload);
  return gzipSync(strToU8(json));
};

export const deserializePayload = (data: Uint8Array): ExportPayload => {
  const json = strFromU8(gunzipSync(data));
  const parsed = JSON.parse(json) as ExportPayload;
  if (!SUPPORTED_EXPORT_VERSIONS.includes(parsed.version as 1 | 2 | 3)) {
    throw new Error('Unsupported export version');
  }
  return {
    ...parsed,
    version: EXPORT_VERSION,
    products: parsed.products.map(normalizeExportProduct),
  };
};

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

export const importFromGsBytes = async (bytes: Uint8Array): Promise<void> => {
  const payload = deserializePayload(bytes);
  const db = getDatabase();

  await db.withTransactionAsync(async () => {
    for (const product of payload.products) {
      const existing = await productRepository.getById(product.id);
      if (!existing) {
        await db.runAsync(
          `INSERT INTO products (id, ean, name, carbs_per_100g, image_url, created_at)
           VALUES (?, NULL, ?, ?, ?, ?)`,
          product.id,
          product.name,
          product.carbsPer100g,
          product.imageUrl ?? null,
          new Date().toISOString(),
        );
        await productEanRepository.setForProduct(product.id, product.eans);
      } else {
        await productRepository.update(product);
      }

      for (const unit of product.customUnits) {
        const existingUnits = await productUnitRepository.getByProductId(product.id);
        if (!existingUnits.find((u) => u.id === unit.id)) {
          await db.runAsync(
            `INSERT INTO product_units (id, product_id, abbreviation, name, equivalent_in_grams)
             VALUES (?, ?, ?, ?, ?)`,
            unit.id,
            product.id,
            unit.abbreviation,
            unit.name,
            unit.equivalentInGrams,
          );
        }
      }
    }

    for (const unit of payload.globalUnits) {
      const all = await globalUnitRepository.getAll();
      if (!all.find((u) => u.id === unit.id)) {
        await db.runAsync(
          `INSERT INTO global_units (id, abbreviation, name, equivalent_in_grams)
           VALUES (?, ?, ?, ?)`,
          unit.id,
          unit.abbreviation,
          unit.name,
          unit.equivalentInGrams,
        );
      }
    }

    for (const meal of payload.meals) {
      const existing = await mealRepository.getById(meal.id);
      if (existing) {
        await mealRepository.delete(meal.id);
      }
      await db.runAsync(
        `INSERT INTO meals (id, type, date, created_at, total_carbs) VALUES (?, ?, ?, ?, ?)`,
        meal.id,
        meal.type,
        meal.date,
        meal.createdAt,
        meal.totalCarbs,
      );
      for (const item of meal.items) {
        await db.runAsync(
          `INSERT INTO meal_items (id, meal_id, product_id, quantity, unit_type, unit_id)
           VALUES (?, ?, ?, ?, ?, ?)`,
          item.id,
          meal.id,
          item.productId,
          item.quantity,
          item.unitType,
          item.unitId ?? null,
        );
      }
    }

    if (payload.preferences) {
      await usePreferencesStore.getState().applyImported(payload.preferences);
    }
  });
};
