import { OFF_BASE_URL, OFF_USER_AGENT } from '@/constants/api';
import {
  MissingNutrimentsError,
  NetworkError,
  ProductNotFoundError,
} from '@/services/errors';
import type { Product } from '@/types/product';

type OffNutriments = {
  carbohydrates_100g?: number;
  carbohydrates?: number;
};

type OffProduct = {
  product_name?: string;
  nutriments?: OffNutriments;
};

type OffResponse = {
  status: number;
  product?: OffProduct;
};

const parseCarbs = (nutriments?: OffNutriments): number | null => {
  const carbs = nutriments?.carbohydrates_100g ?? nutriments?.carbohydrates;
  if (carbs === undefined || carbs === null || Number.isNaN(carbs)) return null;
  return carbs;
};

export const fetchProductByEAN = async (ean: string): Promise<Product> => {
  const url = `${OFF_BASE_URL}/${ean}?product_type=all&cc=fr&lc=fr&fields=product_name,nutriments`;

  let response: Response;
  try {
    response = await fetch(url, {
      headers: { 'User-Agent': OFF_USER_AGENT },
    });
  } catch {
    throw new NetworkError();
  }

  if (!response.ok) {
    throw new NetworkError(`Erreur réseau (${response.status})`);
  }

  let data: OffResponse;
  try {
    data = (await response.json()) as OffResponse;
  } catch {
    throw new NetworkError('Réponse invalide du serveur');
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
    name: data.product.product_name?.trim() || 'Produit inconnu',
    carbsPer100g,
  };
};

export type PartialOffProduct = {
  ean: string;
  name?: string;
  carbsPer100g?: number;
};

export const fetchOffPartialByEAN = async (ean: string): Promise<PartialOffProduct> => {
  const url = `${OFF_BASE_URL}/${ean}?product_type=all&cc=fr&lc=fr&fields=product_name,nutriments`;

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
    };
  } catch {
    return { ean };
  }
};
