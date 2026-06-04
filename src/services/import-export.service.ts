import type { SQLiteDatabase } from 'expo-sqlite';
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
import {
  clearProductImagesDirectory,
  productsToExportProducts,
  resolveImportedProductImageUrl,
} from '@/services/productImage.service';
import { normalizeExportProduct } from '@/utils/exportProduct';

export const EXPORT_VERSION = 4;
const SUPPORTED_EXPORT_VERSIONS = [1, 2, 3, 4] as const;

export type ImportMode = 'merge' | 'replace';

export type ImportOptions = {
  mode?: ImportMode;
  skipPreferences?: boolean;
};

export const buildExportPayload = async (): Promise<ExportPayload> => ({
  version: EXPORT_VERSION,
  exportedAt: new Date().toISOString(),
  products: await productsToExportProducts(await productRepository.getAll()),
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

export const clearUserDataTables = async (db: SQLiteDatabase): Promise<void> => {
  clearProductImagesDirectory();
  await db.execAsync('DELETE FROM meal_items');
  await db.execAsync('DELETE FROM meals');
  await db.execAsync('DELETE FROM product_eans');
  await db.execAsync('DELETE FROM product_units');
  await db.execAsync('DELETE FROM products');
  await db.execAsync('DELETE FROM global_units');
};

const insertProduct = async (db: SQLiteDatabase, product: ExportPayload['products'][0]) => {
  const imageUrl = resolveImportedProductImageUrl(product);
  await db.runAsync(
    `INSERT INTO products (id, ean, name, carbs_per_100g, image_url, created_at)
     VALUES (?, NULL, ?, ?, ?, ?)`,
    product.id,
    product.name,
    product.carbsPer100g,
    imageUrl,
    new Date().toISOString(),
  );
  await productEanRepository.setForProduct(product.id, product.eans);

  for (const unit of product.customUnits) {
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
};

const insertGlobalUnit = async (db: SQLiteDatabase, unit: ExportPayload['globalUnits'][0]) => {
  await db.runAsync(
    `INSERT INTO global_units (id, abbreviation, name, equivalent_in_grams)
     VALUES (?, ?, ?, ?)`,
    unit.id,
    unit.abbreviation,
    unit.name,
    unit.equivalentInGrams,
  );
};

const insertMeal = async (db: SQLiteDatabase, meal: ExportPayload['meals'][0]) => {
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
};

const insertFullPayload = async (db: SQLiteDatabase, payload: ExportPayload): Promise<void> => {
  for (const product of payload.products) {
    await insertProduct(db, product);
  }
  for (const unit of payload.globalUnits) {
    await insertGlobalUnit(db, unit);
  }
  for (const meal of payload.meals) {
    await insertMeal(db, meal);
  }
};

const mergePayload = async (db: SQLiteDatabase, payload: ExportPayload): Promise<void> => {
  for (const product of payload.products) {
    const existing = await productRepository.getById(product.id);
    if (!existing) {
      await insertProduct(db, product);
    } else {
      const imageUrl = resolveImportedProductImageUrl(product);
      await productRepository.update({ ...product, imageUrl });
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
  }

  for (const unit of payload.globalUnits) {
    const all = await globalUnitRepository.getAll();
    if (!all.find((u) => u.id === unit.id)) {
      await insertGlobalUnit(db, unit);
    }
  }

  for (const meal of payload.meals) {
    const existing = await mealRepository.getById(meal.id);
    if (existing) {
      await mealRepository.delete(meal.id);
    }
    await insertMeal(db, meal);
  }
};

export const importPayload = async (
  payload: ExportPayload,
  options: ImportOptions = {},
): Promise<void> => {
  const mode = options.mode ?? 'merge';
  const db = getDatabase();

  await db.withTransactionAsync(async () => {
    if (mode === 'replace') {
      await clearUserDataTables(db);
      await insertFullPayload(db, payload);
    } else {
      await mergePayload(db, payload);
    }
  });

  if (payload.preferences && !options.skipPreferences) {
    await usePreferencesStore.getState().applyImported(payload.preferences);
  }
};

export const importFromGsBytes = async (
  bytes: Uint8Array,
  options: ImportOptions = {},
): Promise<void> => {
  const payload = deserializePayload(bytes);
  await importPayload(payload, options);
};
