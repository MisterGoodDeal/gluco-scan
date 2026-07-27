import type { MealItem, MealItemQuantityType } from '@/types/mealItem';
import type { ProductTag } from '@/types/productTag';
import { convertRawToCooked } from '@/utils/cooking/convertRawToCooked';
import { getCookingFactor } from '@/utils/cooking/getCookingFactor';
import { hasCookingConversion } from '@/utils/cooking/hasCookingConversion';
import { formatMealItemQuantity } from '@/utils/formatMealItemQuantity';
import type { Product } from '@/types/product';
import type { CookingConversion } from '@/types/cookingConversion';

export type FormatMealItemConversionParams = {
  item: Pick<
    MealItem,
    | 'quantity'
    | 'unitType'
    | 'unitLabel'
    | 'quantityType'
    | 'rawEquivalentQuantity'
    | 'carbs'
  >;
  product?: Pick<Product, 'tags' | 'customCookingFactor'> | null;
  formatMassValue: (grams: number) => string;
  massUnit: string;
  userConversions?: CookingConversion[];
  isManualCarbs?: boolean;
  t: (key: 'meals.quantityCooked' | 'meals.quantityRaw' | 'meals.rawEquivalent' | 'meals.cookedEquivalent' | 'common.carbs', options?: Record<string, unknown>) => string;
};

export const formatMealItemConversion = ({
  item,
  product,
  formatMassValue,
  massUnit,
  userConversions = [],
  isManualCarbs = false,
  t,
}: FormatMealItemConversionParams) => {
  const carbsLine = t('common.carbs', {
    value:
      item.carbs != null
        ? item.carbs.toFixed(1).replace('.', ',')
        : '0',
  });

  if (isManualCarbs) {
    return {
      primaryLine: null,
      equivalentLine: null,
      carbsLine,
      productTags: [] as ProductTag[],
    };
  }

  if (item.unitType === 'custom') {
    const quantityPart = formatMealItemQuantity(
      item.quantity,
      item.unitType,
      item.unitLabel,
      formatMassValue,
      massUnit,
    );
    const primaryLine =
      item.rawEquivalentQuantity != null && item.rawEquivalentQuantity > 0
        ? `${quantityPart} (${formatMassValue(item.rawEquivalentQuantity)} ${massUnit})`
        : quantityPart;

    return {
      primaryLine,
      equivalentLine: null,
      carbsLine,
      productTags: product?.tags ?? ([] as ProductTag[]),
    };
  }

  const quantityType: MealItemQuantityType = item.quantityType ?? 'raw';
  const cookingEligible =
    item.unitType === 'grams' &&
    product != null &&
    hasCookingConversion(product, userConversions);

  const primaryLine = cookingEligible
    ? quantityType === 'cooked'
      ? t('meals.quantityCooked', {
          value: formatMassValue(item.quantity),
          unit: massUnit,
        })
      : t('meals.quantityRaw', {
          value: formatMassValue(item.quantity),
          unit: massUnit,
        })
    : formatMealItemQuantity(
        item.quantity,
        'grams',
        undefined,
        formatMassValue,
        massUnit,
      );

  let equivalentLine: string | null = null;
  if (
    cookingEligible &&
    item.rawEquivalentQuantity != null
  ) {
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

  return {
    primaryLine,
    equivalentLine,
    carbsLine,
    productTags: product?.tags ?? ([] as ProductTag[]),
  };
};
