import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { InputNumber } from '@/components/atoms/InputNumber';
import { TagChip } from '@/components/molecules/tag-chip/TagChip';
import { DEFAULT_COOKING_CONVERSIONS } from '@/constants/cooking-conversions';
import { useCookingConversionStore } from '@/store/cookingConversion.store';
import type { ProductTag } from '@/types/productTag';
import { parseManualCarbs } from '@/utils/ean';

export const CookingConversionSettings: FC = () => {
  const { t } = useTranslation();
  const conversions = useCookingConversionStore((s) => s.conversions);
  const updateConversion = useCookingConversionStore((s) => s.updateConversion);

  const getFactor = (tag: ProductTag): number => {
    const stored = conversions.find((entry) => entry.tag === tag);
    if (stored) return stored.cookedFactor;
    return DEFAULT_COOKING_CONVERSIONS.find((entry) => entry.tag === tag)?.cookedFactor ?? 1;
  };

  const handleChange = async (tag: ProductTag, value: string) => {
    const parsed = parseManualCarbs(value);
    if (parsed == null || parsed <= 0) return;
    await updateConversion({ tag, cookedFactor: parsed });
  };

  return (
    <View className="gap-2">
      <Text className="text-muted text-sm">{t('settings.cookingConversionsHint')}</Text>
      {DEFAULT_COOKING_CONVERSIONS.map((entry) => (
        <View key={entry.tag} className="flex-row items-center justify-between gap-2">
          <TagChip tag={entry.tag} variant="expanded" />
          <View className="w-[72px]">
            <InputNumber
              value={String(getFactor(entry.tag)).replace('.', ',')}
              onChangeText={(text) => void handleChange(entry.tag, text)}
            />
          </View>
        </View>
      ))}
    </View>
  );
};
