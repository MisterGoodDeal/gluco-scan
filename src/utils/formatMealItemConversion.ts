import type { MealItem, MealItemQuantityType } from '@/types/mealItem';
import type { ProductTag } from '@/types/productTag';
import { convertRawToCooked } from '@/utils/cooking/convertRawToCooked';
import { getCookingFactor } from '@/utils/cooking/getCookingFactor';
import { hasCookingConversion } from '@/utils/cooking/hasCookingConversion';
import type { Product } from '@/types/product';
import type { CookingConversion } from '@/types/cookingConversion';

export type FormatMealItemConversionParams = {
  item: Pick<
    MealItem,
    'quantity' | 'unitType' | 'quantityType' | 'rawEquivalentQuantity' | 'carbs'
  >;
  product?: Pick<Product, 'tags' | 'customCookingFactor'> | null;
  formatMassValue: (grams: number) => string;
  massUnit: string;
  userConversions?: CookingConversion[];
  t: (key: 'meals.quantityCooked' | 'meals.quantityRaw' | 'meals.rawEquivalent' | 'meals.cookedEquivalent' | 'common.carbs', options?: Record<string, unknown>) => string;
};

export const formatMealItemConversion = ({
  item,
  product,
  formatMassValue,
  massUnit,
  userConversions = [],
  t,
}: FormatMealItemConversionParams) => {
  const quantityType: MealItemQuantityType = item.quantityType ?? 'raw';
  const showConversion =
    item.unitType === 'grams' &&
    product != null &&
    hasCookingConversion(product, userConversions) &&
    item.rawEquivalentQuantity != null;

  const primaryLine =
    quantityType === 'cooked'
      ? t('meals.quantityCooked', {
          value: formatMassValue(item.quantity),
          unit: massUnit,
        })
      : t('meals.quantityRaw', {
          value: formatMassValue(item.quantity),
          unit: massUnit,
        });

  let equivalentLine: string | null = null;
  if (showConversion && item.rawEquivalentQuantity != null) {
    if (quantityType === 'cooked') {
      equivalentLine = t('meals.rawEquivalent', {
        value: formatMassValue(item.rawEquivalentQuantity),
        unit: massUnit,
      });
    } else {
      const factor = getCookingFactor(product!, userConversions);
      if (factor != null) {
        equivalentLine = t('meals.cookedEquivalent', {
          value: formatMassValue(convertRawToCooked(item.quantity, factor)),
          unit: massUnit,
        });
      }
    }
  }

  const carbsLine = t('common.carbs', {
    value:
      item.carbs != null
        ? item.carbs.toFixed(1).replace('.', ',')
        : '0',
  });

  return {
    primaryLine,
    equivalentLine,
    carbsLine,
    productTags: product?.tags ?? ([] as ProductTag[]),
  };
};
