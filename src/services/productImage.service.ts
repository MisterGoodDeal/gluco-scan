import { Directory, File, Paths } from 'expo-file-system';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

import {
  getProductImageStoredPath,
  PRODUCT_IMAGE_JPEG_QUALITY,
  PRODUCT_IMAGE_MAX_WIDTH,
  PRODUCT_IMAGES_DIR,
} from '@/constants/productImage';
import type { Product } from '@/types/product';
import type { ExportProduct } from '@/types/exportPayload';
import { base64ToBytes, bytesToBase64 } from '@/utils/base64';

export const isRemoteProductImage = (stored: string | null | undefined): boolean =>
  stored != null && (stored.startsWith('https://') || stored.startsWith('http://'));

export const isLocalProductImage = (stored: string | null | undefined): boolean =>
  stored != null && !isRemoteProductImage(stored);

export type ResolvedProductImage = {
  uri: string;
  cacheKey: string;
};

export const resolveProductImage = (
  stored: string | null | undefined,
): ResolvedProductImage | null => {
  if (!stored) return null;
  if (isRemoteProductImage(stored)) {
    return { uri: stored, cacheKey: stored };
  }
  const file = getProductImageFileFromStored(stored);
  if (!file.exists) return null;
  const mtime = file.lastModified ?? 0;
  return {
    uri: file.uri,
    cacheKey: `${stored}:${mtime}`,
  };
};

export const resolveProductImageUri = (stored: string | null | undefined): string | null =>
  resolveProductImage(stored)?.uri ?? null;

const ensureProductImagesDirectory = (): void => {
  const dir = new Directory(Paths.document, PRODUCT_IMAGES_DIR);
  if (!dir.exists) {
    dir.create({ idempotent: true, intermediates: true });
  }
};

export const getProductImageFile = (productId: string): File =>
  new File(Paths.document, PRODUCT_IMAGES_DIR, `${productId}.jpg`);

const getProductImageFileFromStored = (stored: string): File => {
  if (stored.startsWith(`${PRODUCT_IMAGES_DIR}/`)) {
    const name = stored.slice(PRODUCT_IMAGES_DIR.length + 1);
    return new File(Paths.document, PRODUCT_IMAGES_DIR, name);
  }
  return new File(Paths.document, stored);
};

export const deleteLocalProductImage = (stored: string | null | undefined): void => {
  if (!isLocalProductImage(stored)) return;
  const file = getProductImageFileFromStored(stored!);
  if (file.exists) file.delete();
};

export const deleteLocalProductImageById = (productId: string): void => {
  const file = getProductImageFile(productId);
  if (file.exists) file.delete();
};

export const clearProductImagesDirectory = (): void => {
  const dir = new Directory(Paths.document, PRODUCT_IMAGES_DIR);
  if (dir.exists) dir.delete();
};

export const saveCompressedProductImage = async (
  productId: string,
  sourceUri: string,
): Promise<string> => {
  const manipulated = await manipulateAsync(
    sourceUri,
    [{ resize: { width: PRODUCT_IMAGE_MAX_WIDTH } }],
    { compress: PRODUCT_IMAGE_JPEG_QUALITY, format: SaveFormat.JPEG },
  );

  ensureProductImagesDirectory();
  const dest = getProductImageFile(productId);
  if (dest.exists) dest.delete();

  const temp = new File(manipulated.uri);
  await temp.copy(dest);

  return getProductImageStoredPath(productId);
};

export const readLocalProductImageBase64 = async (stored: string): Promise<string | null> => {
  const file = getProductImageFileFromStored(stored);
  if (!file.exists) return null;
  return bytesToBase64(await file.bytes());
};

export const writeLocalProductImageFromBase64 = (
  productId: string,
  base64: string,
): string => {
  ensureProductImagesDirectory();
  const dest = getProductImageFile(productId);
  if (dest.exists) dest.delete();
  dest.write(base64ToBytes(base64));
  return getProductImageStoredPath(productId);
};

export type ProductPhotoSource = 'camera' | 'library';

const imagePickerOptions: ImagePicker.ImagePickerOptions = {
  mediaTypes: ['images'],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 1,
};

export const requestProductPhotoLibraryPermission = async (): Promise<boolean> => {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  return permission.granted;
};

export const requestProductCameraPermission = async (): Promise<boolean> => {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  return permission.granted;
};

const pickImageUri = async (source: ProductPhotoSource): Promise<string | null> => {
  const result =
    source === 'camera'
      ? await ImagePicker.launchCameraAsync(imagePickerOptions)
      : await ImagePicker.launchImageLibraryAsync(imagePickerOptions);

  if (result.canceled || !result.assets[0]?.uri) return null;
  return result.assets[0].uri;
};

export const addProductPhoto = async (
  productId: string,
  source: ProductPhotoSource,
): Promise<string | null> => {
  const uri = await pickImageUri(source);
  if (!uri) return null;
  return saveCompressedProductImage(productId, uri);
};

export const productsToExportProducts = async (products: Product[]): Promise<ExportProduct[]> =>
  Promise.all(
    products.map(async (product): Promise<ExportProduct> => {
      if (!isLocalProductImage(product.imageUrl) || !product.imageUrl) {
        return product;
      }

      const imageData = await readLocalProductImageBase64(product.imageUrl);
      if (!imageData) {
        return { ...product, imageUrl: null };
      }

      return {
        ...product,
        imageUrl: null,
        imageData,
        imageMime: 'image/jpeg',
      };
    }),
  );

export const resolveImportedProductImageUrl = (product: ExportProduct): string | null => {
  if (product.imageData) {
    return writeLocalProductImageFromBase64(product.id, product.imageData);
  }
  return product.imageUrl ?? null;
};
