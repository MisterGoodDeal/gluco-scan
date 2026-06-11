import { type FC } from 'react';
import { Text, View } from 'react-native';

import { TagIcon } from '@/components/atoms/TagIcon';
import type { MealItem } from '@/types/mealItem';
import type { Product } from '@/types/product';
import { formatMealItemConversion, type FormatMealItemConversionParams } from '@/utils/formatMealItemConversion';
import { useMassDisplay } from '@/hooks/useMassDisplay';
import { useTranslation } from 'react-i18next';
import { useCookingConversionStore } from '@/store/cookingConversion.store';
import { sortProductTags } from '@/utils/tags/sortProductTags';
import { textLineClamp } from '@/utils/text';

type MealItemConversionLineProps = {
  item: MealItem;
  product?: Pick<Product, 'tags' | 'customCookingFactor'> | null;
  showName?: boolean;
  compactIcons?: boolean;
};

export const MealItemConversionLine: FC<MealItemConversionLineProps> = ({
  item,
  product,
  showName = true,
  compactIcons = true,
}) => {
  const { t } = useTranslation();
  const { formatMassValue, massUnit } = useMassDisplay();
  const userConversions = useCookingConversionStore((s) => s.conversions);
  const { primaryLine, equivalentLine, carbsLine, productTags } = formatMealItemConversion({
    item,
    product,
    formatMassValue,
    massUnit,
    userConversions,
    t: t as FormatMealItemConversionParams['t'],
  });

  return (
    <View className="gap-1">
      {showName ? (
        <View className="flex-row items-center gap-1 min-w-0">
          {compactIcons ? (
            <View className="flex-row items-center gap-0.5">
              {sortProductTags(productTags).map((tag) => (
                <TagIcon key={tag} tag={tag} size={16} />
              ))}
            </View>
          ) : null}
          <Text className="text-foreground text-base flex-1 min-w-0" {...textLineClamp(2)}>
            {item.productName}
          </Text>
        </View>
      ) : null}
      <Text className="text-muted text-sm">{primaryLine}</Text>
      {equivalentLine ? <Text className="text-muted text-sm">{equivalentLine}</Text> : null}
      <Text className="text-accent text-sm">{carbsLine}</Text>
    </View>
  );
};
