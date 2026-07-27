import { Card, useThemeColor } from 'heroui-native';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { CompositionImageMosaic } from '@/components/atoms/CompositionImageMosaic';
import { FaIcon } from '@/components/atoms/FaIcon';
import { AppButton } from '@/components/ui/AppButton';
import { AppPressable } from '@/components/ui/AppPressable';
import type { Composition } from '@/types/composition';
import { formatDecimal } from '@/utils/format';

type CompositionRowProps = {
  composition: Composition;
  onEdit: (composition: Composition) => void;
  onCreateMeal: (composition: Composition) => void;
  onDelete: (composition: Composition) => void;
};

export const CompositionRow: FC<CompositionRowProps> = ({
  composition,
  onEdit,
  onCreateMeal,
  onDelete,
}) => {
  const { t } = useTranslation();
  const [mutedColor] = useThemeColor(['muted']);

  return (
    <Card className="p-4">
      <View className="flex-row items-center gap-3">
        <CompositionImageMosaic composition={composition} />
        <AppPressable
          className="flex-1 min-w-0"
          onPress={() => onEdit(composition)}
          accessibilityRole="button"
          accessibilityLabel={t('compositions.editA11y', { name: composition.name })}>
          <View className="gap-1">
            <Text className="text-foreground text-base font-medium" numberOfLines={2}>
              {composition.name}
            </Text>
            <Text className="text-accent text-sm font-medium">
              {t('compositions.totalCarbs', { value: formatDecimal(composition.totalCarbs) })}
            </Text>
            <Text className="text-muted text-xs">
              {t('compositions.itemCount', { count: composition.items.length })}
            </Text>
          </View>
        </AppPressable>
        <View className="items-end gap-1">
          <AppButton
            isIconOnly
            size="sm"
            variant="ghost"
            onPress={() => onEdit(composition)}
            accessibilityLabel={t('compositions.editA11y', { name: composition.name })}>
            <FaIcon name="pen" size={16} color={mutedColor} />
          </AppButton>
          <AppButton
            isIconOnly
            size="sm"
            variant="ghost"
            onPress={() => onDelete(composition)}
            accessibilityLabel={t('compositions.deleteA11y', { name: composition.name })}>
            <FaIcon name="trash-can" size={16} color={mutedColor} />
          </AppButton>
        </View>
      </View>
      <AppButton className="mt-3" variant="tertiary" onPress={() => onCreateMeal(composition)}>
        {t('compositions.createMeal')}
      </AppButton>
    </Card>
  );
};
