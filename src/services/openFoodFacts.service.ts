import { OFF_BASE_URL, OFF_USER_AGENT } from '@/constants/api';
import i18n, { getOffLocaleParams } from '@/i18n';
import {
  MissingNutrimentsError,
  NetworkError,
  OffRateLimitError,
  ProductNotFoundError,
} from '@/services/errors';
import { consumeOffApiCall } from '@/services/offRateLimiter';

export type OffProductResult = {
  ean: string;
  name: string;
  carbsPer100g: number;
  imageUrl?: string;
};

type OffNutriments = {
  carbohydrates_100g?: number;
  carbohydrates?: number;
};

type OffProduct = {
  product_name?: string;
  nutriments?: OffNutriments;
  image_front_small_url?: string;
};

type OffResponse = {
  status: number;
  product?: OffProduct;
};

const OFF_FIELDS = 'product_name,nutriments,image_front_small_url';

const parseCarbs = (nutriments?: OffNutriments): number | null => {
  const carbs = nutriments?.carbohydrates_100g ?? nutriments?.carbohydrates;
  if (carbs === undefined || carbs === null || Number.isNaN(carbs)) return null;
  return carbs;
};

const parseImageUrl = (product: OffProduct): string | undefined => {
  const url = product.image_front_small_url?.trim();
  return url || undefined;
};

export const fetchProductByEAN = async (ean: string): Promise<OffProductResult> => {
  consumeOffApiCall();

  const { cc, lc } = getOffLocaleParams();
  const url = `${OFF_BASE_URL}/${ean}?product_type=all&cc=${cc}&lc=${lc}&fields=${OFF_FIELDS}`;

  let response: Response;
  try {
    response = await fetch(url, {
      headers: { 'User-Agent': OFF_USER_AGENT },
    });
  } catch {
    throw new NetworkError();
  }

  if (!response.ok) {
    throw new NetworkError('errors.networkStatus', { status: response.status });
  }

  let data: OffResponse;
  try {
    data = (await response.json()) as OffResponse;
  } catch {
    throw new NetworkError('errors.invalidResponse');
  }

  if (data.status !== 1 || !data.product) {
    throw new ProductNotFoundError(ean);
  }

  const carbsPer100g = parseCarbs(data.product.nutriments);
  if (carbsPer100g === null) {
    throw new MissingNutrimentsError(ean);
  }

  return {
    ean,
    name: data.product.product_name?.trim() || i18n.t('products.unknownProduct'),
    carbsPer100g,
    imageUrl: parseImageUrl(data.product),
  };
};

export type PartialOffProduct = {
  ean: string;
  name?: string;
  carbsPer100g?: number;
  imageUrl?: string;
};

export const fetchOffPartialByEAN = async (ean: string): Promise<PartialOffProduct> => {
  consumeOffApiCall();

  const { cc, lc } = getOffLocaleParams();
  const url = `${OFF_BASE_URL}/${ean}?product_type=all&cc=${cc}&lc=${lc}&fields=${OFF_FIELDS}`;

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': OFF_USER_AGENT },
    });

    if (!response.ok) return { ean };

    const data = (await response.json()) as OffResponse;
    if (data.status !== 1 || !data.product) return { ean };

    const carbsPer100g = parseCarbs(data.product.nutriments);
    const name = data.product.product_name?.trim();

    return {
      ean,
      name: name || undefined,
      carbsPer100g: carbsPer100g ?? undefined,
      imageUrl: parseImageUrl(data.product),
    };
  } catch (error) {
    if (error instanceof OffRateLimitError) throw error;
    return { ean };
  }
};
