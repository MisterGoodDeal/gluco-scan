import type { SQLiteDatabase } from 'expo-sqlite';
import { gzipSync, gunzipSync, strToU8, strFromU8 } from 'fflate';

import { getDatabase } from '@/database/client';
import { MIGRATION_007_SQL } from '@/database/migrations/007_manual_carbs_product';
import { appPreferencesRepository } from '@/repositories/appPreferences.repository';
import { compositionRepository } from '@/repositories/composition.repository';
import { cookingConversionRepository } from '@/repositories/cookingConversion.repository';
import { globalUnitRepository } from '@/repositories/globalUnit.repository';
import { mealRepository } from '@/repositories/meal.repository';
import { productEanRepository } from '@/repositories/productEan.repository';
import { productRepository } from '@/repositories/product.repository';
import { productUnitRepository } from '@/repositories/productUnit.repository';
import type { ExportPayload } from '@/types/exportPayload';
import type { MealItem } from '@/types/mealItem';
import { usePreferencesStore } from '@/store/preferences.store';
import { useCookingConversionStore } from '@/store/cookingConversion.store';
import {
  clearProductImagesDirectory,
  productsToExportProducts,
  resolveImportedProductImageUrl,
} from '@/services/productImage.service';
import { normalizeExportProduct } from '@/utils/exportProduct';
import { computeMealItemCarbsWithCooking } from '@/utils/carbs';
import { flushWidgetSync } from '@/features/widgets/services/widgetSync.service';

export const EXPORT_VERSION = 6;
const SUPPORTED_EXPORT_VERSIONS = [1, 2, 3, 4, 5, 6] as const;

export type ImportMode = 'merge' | 'replace';

export type ImportOptions = {
  mode?: ImportMode;
  skipPreferences?: boolean;
};

export const buildExportPayload = async (): Promise<ExportPayload> => ({
  version: EXPORT_VERSION,
  exportedAt: new Date().toISOString(),
  products: await productsToExportProducts(await productRepository.getAll()),
  compositions: await compositionRepository.getAll(),
  meals: await mealRepository.getAllForExport(),
  globalUnits: await globalUnitRepository.getAll(),
  cookingConversions: await cookingConversionRepository.getAll(),
  preferences: await appPreferencesRepository.get(),
});

export const serializePayload = (payload: ExportPayload): Uint8Array => {
  const json = JSON.stringify(payload);
  return gzipSync(strToU8(json));
};

export const deserializePayload = (data: Uint8Array): ExportPayload => {
  const json = strFromU8(gunzipSync(data));
  const parsed = JSON.parse(json) as ExportPayload;
  if (!SUPPORTED_EXPORT_VERSIONS.includes(parsed.version as 1 | 2 | 3 | 4 | 5 | 6)) {
    throw new Error('Unsupported export version');
  }
  return {
    ...parsed,
    version: EXPORT_VERSION,
    products: parsed.products.map(normalizeExportProduct),
    cookingConversions: parsed.cookingConversions,
  };
};

export const clearUserDataTables = async (db: SQLiteDatabase): Promise<void> => {
  clearProductImagesDirectory();
  await db.execAsync('DELETE FROM meal_items');
  await db.execAsync('DELETE FROM meals');
  await db.execAsync('DELETE FROM composition_items');
  await db.execAsync('DELETE FROM compositions');
  await db.execAsync('DELETE FROM product_eans');
  await db.execAsync('DELETE FROM product_units');
  await db.execAsync('DELETE FROM products');
  await db.execAsync('DELETE FROM global_units');
  await db.execAsync('DELETE FROM cooking_conversions');
};

const serializeTags = (tags: ExportPayload['products'][0]['tags']): string =>
  JSON.stringify(tags ?? []);

const insertProduct = async (db: SQLiteDatabase, product: ExportPayload['products'][0]) => {
  const imageUrl = resolveImportedProductImageUrl(product);
  await db.runAsync(
    `INSERT INTO products (id, ean, name, carbs_per_100g, image_url, tags, custom_cooking_factor, created_at)
     VALUES (?, NULL, ?, ?, ?, ?, ?, ?)`,
    product.id,
    product.name,
    product.carbsPer100g,
    imageUrl,
    serializeTags(product.tags),
    product.customCookingFactor ?? null,
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

const ensureSystemProducts = async (db: SQLiteDatabase): Promise<void> => {
  await db.execAsync(MIGRATION_007_SQL);
};

const normalizeImportedMealItem = async (
  item: MealItem,
): Promise<{
  quantityType: MealItem['quantityType'];
  rawEquivalentQuantity: number;
  carbs: number;
}> => {
  if (
    item.carbs != null &&
    item.rawEquivalentQuantity != null &&
    item.quantityType != null
  ) {
    return {
      quantityType: item.quantityType,
      rawEquivalentQuantity: item.rawEquivalentQuantity,
      carbs: item.carbs,
    };
  }

  const [product, globalUnits, userConversions] = await Promise.all([
    productRepository.getById(item.productId),
    globalUnitRepository.getAll(),
    cookingConversionRepository.getAll(),
  ]);

  if (!product) {
    return {
      quantityType: item.quantityType ?? 'raw',
      rawEquivalentQuantity: item.rawEquivalentQuantity ?? item.quantity,
      carbs: item.carbs ?? 0,
    };
  }

  const computed = computeMealItemCarbsWithCooking(
    {
      quantity: item.quantity,
      unitType: item.unitType,
      unitId: item.unitId,
      quantityType: item.quantityType ?? 'raw',
    },
    product,
    globalUnits,
    userConversions,
  );

  return {
    quantityType: item.quantityType ?? computed.quantityType,
    rawEquivalentQuantity: item.rawEquivalentQuantity ?? computed.rawEquivalentQuantity,
    carbs: item.carbs ?? computed.carbs,
  };
};

const insertMeal = async (db: SQLiteDatabase, meal: ExportPayload['meals'][0]) => {
  await db.runAsync(
    `INSERT INTO meals (id, type, date, created_at, total_carbs, source_composition_id, source_composition_name)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    meal.id,
    meal.type,
    meal.date,
    meal.createdAt,
    meal.totalCarbs,
    meal.sourceCompositionId ?? null,
    meal.sourceCompositionName ?? null,
  );
  for (const item of meal.items) {
    const normalized = await normalizeImportedMealItem(item);
    await db.runAsync(
      `INSERT INTO meal_items (id, meal_id, product_id, quantity, unit_type, unit_id, quantity_type, raw_equivalent_quantity, carbs)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      item.id,
      meal.id,
      item.productId,
      item.quantity,
      item.unitType,
      item.unitId ?? null,
      normalized.quantityType ?? 'raw',
      normalized.rawEquivalentQuantity,
      normalized.carbs,
    );
  }
};

const insertComposition = async (
  db: SQLiteDatabase,
  composition: NonNullable<ExportPayload['compositions']>[number],
) => {
  await db.runAsync(
    `INSERT INTO compositions (id, name, created_at, total_carbs) VALUES (?, ?, ?, ?)`,
    composition.id,
    composition.name,
    composition.createdAt,
    composition.totalCarbs,
  );

  for (const item of composition.items) {
    const normalized = await normalizeImportedMealItem(item);
    await db.runAsync(
      `INSERT INTO composition_items (
        id, composition_id, product_id, quantity, unit_type, unit_id, quantity_type,
        raw_equivalent_quantity, carbs, product_name, image_url, unit_label
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      item.id,
      composition.id,
      item.productId,
      item.quantity,
      item.unitType,
      item.unitId ?? null,
      normalized.quantityType ?? 'raw',
      normalized.rawEquivalentQuantity,
      item.carbs ?? normalized.carbs,
      item.productName ?? '',
      item.imageUrl ?? null,
      item.unitLabel ?? 'g',
    );
  }
};

const importCookingConversions = async (
  payload: ExportPayload,
  mode: ImportMode,
): Promise<void> => {
  if (mode === 'replace') {
    await cookingConversionRepository.seedDefaults();
  }

  if (!payload.cookingConversions?.length) return;

  for (const conversion of payload.cookingConversions) {
    await cookingConversionRepository.upsert(conversion);
  }
};

const insertFullPayload = async (db: SQLiteDatabase, payload: ExportPayload): Promise<void> => {
  await ensureSystemProducts(db);
  for (const product of payload.products) {
    await insertProduct(db, product);
  }
  for (const unit of payload.globalUnits) {
    await insertGlobalUnit(db, unit);
  }
  await importCookingConversions(payload, 'replace');
  for (const composition of payload.compositions ?? []) {
    await insertComposition(db, composition);
  }
  for (const meal of payload.meals) {
    await insertMeal(db, meal);
  }
};

const mergePayload = async (db: SQLiteDatabase, payload: ExportPayload): Promise<void> => {
  await ensureSystemProducts(db);
  for (const product of payload.products) {
    const existing = await productRepository.getById(product.id);
    if (!existing) {
      await insertProduct(db, product);
    } else {
      const imageUrl = resolveImportedProductImageUrl(product);
      await productRepository.update({
        ...product,
        imageUrl,
        tags: product.tags ?? [],
      });
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

  await importCookingConversions(payload, 'merge');

  for (const composition of payload.compositions ?? []) {
    const existing = await compositionRepository.getById(composition.id);
    if (existing) {
      await compositionRepository.delete(composition.id);
    }
    await insertComposition(db, composition);
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

  await useCookingConversionStore.getState().hydrate();
  await flushWidgetSync();
};

export const importFromGsBytes = async (
  bytes: Uint8Array,
  options: ImportOptions = {},
): Promise<void> => {
  const payload = deserializePayload(bytes);
  await importPayload(payload, options);
};
