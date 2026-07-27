import {
  OFF_BASE_URL,
  OFF_SEARCH_BASE_URL,
  OFF_SEARCH_PAGE_SIZE,
  OFF_USER_AGENT,
} from '@/constants/api';
import i18n, { getOffLocaleParams } from '@/i18n';
import {
  MissingNutrimentsError,
  NetworkError,
  OffRateLimitError,
  ProductNotFoundError,
} from '@/services/errors';
import { consumeOffApiCall, consumeOffSearchApiCall } from '@/services/offRateLimiter';
import { mapOffCategoriesToTags } from '@/utils/tag-mapper/mapOffCategoriesToTags';
import type { ProductTag } from '@/types/productTag';

export type OffProductResult = {
  ean: string;
  name: string;
  carbsPer100g: number;
  imageUrl?: string;
  categoriesTags?: string[];
  tags: ProductTag[];
};

type OffNutriments = {
  carbohydrates_100g?: number;
  carbohydrates?: number;
};

type OffImages = {
  front?: {
    small?: {
      url?: string;
    };
  };
};

type OffProduct = {
  product_name?: string;
  nutriments?: OffNutriments;
  image_front_small_url?: string;
  images?: OffImages;
  categories_tags?: string[];
};

type OffResponse = {
  status: number;
  product?: OffProduct;
};

const OFF_FIELDS = 'product_name,nutriments,images,categories_tags,image_front_small_url';
const OFF_SEARCH_FIELDS =
  'code,product_name,nutriments,image_front_small_url,categories_tags';

const parseCarbs = (nutriments?: OffNutriments): number | null => {
  const carbs = nutriments?.carbohydrates_100g ?? nutriments?.carbohydrates;
  if (carbs === undefined || carbs === null || Number.isNaN(carbs)) return null;
  return carbs;
};

const parseImageUrl = (product: OffProduct): string | undefined => {
  const fromImages = product.images?.front?.small?.url?.trim();
  if (fromImages) return fromImages;
  const url = product.image_front_small_url?.trim();
  return url || undefined;
};

const buildOffResult = (ean: string, product: OffProduct): OffProductResult => {
  const categoriesTags = product.categories_tags ?? [];
  return {
    ean,
    name: product.product_name?.trim() || i18n.t('products.unknownProduct'),
    carbsPer100g: parseCarbs(product.nutriments)!,
    imageUrl: parseImageUrl(product),
    categoriesTags,
    tags: mapOffCategoriesToTags(categoriesTags),
  };
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

  return buildOffResult(ean, data.product);
};

export type PartialOffProduct = {
  ean: string;
  name?: string;
  carbsPer100g?: number;
  imageUrl?: string;
  categoriesTags?: string[];
  tags?: ProductTag[];
};

export type OffSearchHit = {
  code: string;
  name: string;
  carbsPer100g?: number;
  imageUrl?: string;
  tags: ProductTag[];
};

type OffSearchRawHit = {
  code?: string;
  product_name?: string;
  nutriments?: OffNutriments;
  image_front_small_url?: string;
  categories_tags?: string[];
};

type OffSearchResponse = {
  hits?: OffSearchRawHit[];
  count?: number;
  page?: number;
};

const mapSearchHit = (hit: OffSearchRawHit): OffSearchHit | null => {
  const code = hit.code?.trim();
  const name = hit.product_name?.trim();
  if (!code || !name) return null;

  const carbsPer100g = parseCarbs(hit.nutriments);
  const categoriesTags = hit.categories_tags ?? [];

  return {
    code,
    name,
    carbsPer100g: carbsPer100g ?? undefined,
    imageUrl: parseImageUrl(hit),
    tags: mapOffCategoriesToTags(categoriesTags),
  };
};

export const searchOffProducts = async (
  query: string,
  page = 1,
  pageSize = OFF_SEARCH_PAGE_SIZE,
  signal?: AbortSignal,
): Promise<{ hits: OffSearchHit[]; count: number; page: number }> => {
  consumeOffSearchApiCall();

  const params = new URLSearchParams({
    q: query.trim(),
    page: String(page),
    page_size: String(pageSize),
    fields: OFF_SEARCH_FIELDS,
  });
  const url = `${OFF_SEARCH_BASE_URL}?${params.toString()}`;

  let response: Response;
  try {
    response = await fetch(url, {
      headers: { 'User-Agent': OFF_USER_AGENT },
      signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') throw error;
    throw new NetworkError();
  }

  if (!response.ok) {
    throw new NetworkError('errors.networkStatus', { status: response.status });
  }

  let data: OffSearchResponse;
  try {
    data = (await response.json()) as OffSearchResponse;
  } catch {
    throw new NetworkError('errors.invalidResponse');
  }

  const hits = (data.hits ?? [])
    .map(mapSearchHit)
    .filter((hit): hit is OffSearchHit => hit != null);

  return {
    hits,
    count: data.count ?? hits.length,
    page: data.page ?? page,
  };
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
    const categoriesTags = data.product.categories_tags ?? [];

    return {
      ean,
      name: name || undefined,
      carbsPer100g: carbsPer100g ?? undefined,
      imageUrl: parseImageUrl(data.product),
      categoriesTags,
      tags: mapOffCategoriesToTags(categoriesTags),
    };
  } catch (error) {
    if (error instanceof OffRateLimitError) throw error;
    return { ean };
  }
};
