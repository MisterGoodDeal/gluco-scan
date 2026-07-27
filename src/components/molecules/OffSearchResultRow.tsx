import { Card } from 'heroui-native';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { ProductImage } from '@/components/atoms/ProductImage';
import { ProductNameInlineTags } from '@/components/molecules/ProductNameInlineTags';
import { AppPressable } from '@/components/ui/AppPressable';
import type { OffSearchHit } from '@/services/openFoodFacts.service';
import { formatDecimal } from '@/utils/format';

type OffSearchResultRowProps = {
  hit: OffSearchHit;
  onPress: (hit: OffSearchHit) => void;
};

export const OffSearchResultRow: FC<OffSearchResultRowProps> = ({ hit, onPress }) => {
  const { t } = useTranslation();
  const hasCarbs = hit.carbsPer100g != null;
  const carbsLabel = hasCarbs
    ? t('common.carbsPer100g', { value: formatDecimal(hit.carbsPer100g!) })
    : t('products.searchOffMissingCarbs');

  return (
    <Card className="p-4">
      <AppPressable onPress={() => onPress(hit)}>
        <View className="flex-row items-center gap-2">
          {hit.imageUrl ? <ProductImage uri={hit.imageUrl} /> : null}
          <View className="flex-1 min-w-0 gap-1">
            <ProductNameInlineTags name={hit.name} tags={hit.tags} lines={2} />
            <Text className={`text-xs ${hasCarbs ? 'text-muted' : 'text-warning'}`}>
              {carbsLabel}
            </Text>
          </View>
        </View>
      </AppPressable>
    </Card>
  );
};
