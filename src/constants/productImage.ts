export const PRODUCT_IMAGES_DIR = 'product-images';
export const PRODUCT_IMAGE_EXTENSION = '.jpg';
export const PRODUCT_IMAGE_MIME = 'image/jpeg' as const;
export const PRODUCT_IMAGE_MAX_WIDTH = 256;
export const PRODUCT_IMAGE_JPEG_QUALITY = 0.78;

export const getProductImageStoredPath = (productId: string): string =>
  `${PRODUCT_IMAGES_DIR}/${productId}${PRODUCT_IMAGE_EXTENSION}`;
