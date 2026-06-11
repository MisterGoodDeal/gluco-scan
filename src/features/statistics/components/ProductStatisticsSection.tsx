import { type FC, type ReactNode } from 'react';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useProductStatistics } from '@/features/statistics/hooks/useStatistics';
import { formatDecimal } from '@/utils/format';
import { formatDateLabel } from '@/utils/date';
import { getCurrentLocale } from '@/i18n';
import { getMealTypeLabelKey } from '@/utils/mealType';

type ProductStatisticsSectionProps = {
  productId: string;
};

const StatRow: FC<{ children: ReactNode }> = ({ children }) => (
  <View className="py-1 border-b border-separator">{children}</View>
);

export const ProductStatisticsSection: FC<ProductStatisticsSectionProps> = ({ productId }) => {
  const { t } = useTranslation();
  const locale = getCurrentLocale();
  const stats = useProductStatistics(productId);

  if (!stats || stats.timesConsumed === 0) return null;

  return (
    <View className="mt-6 gap-2">
      <Text className="text-foreground text-base font-medium">
        {t('statistics.productDetail.title')}
      </Text>
      <StatRow>
        <Text className="text-muted text-sm">{t('statistics.productDetail.timesConsumed')}</Text>
        <Text className="text-foreground text-sm">{stats.timesConsumed}</Text>
      </StatRow>
      <StatRow>
        <Text className="text-muted text-sm">{t('statistics.productDetail.lastConsumed')}</Text>
        <Text className="text-foreground text-sm">
          {stats.lastConsumedDate
            ? formatDateLabel(stats.lastConsumedDate, locale)
            : t('statistics.productDetail.never')}
        </Text>
      </StatRow>
      <StatRow>
        <Text className="text-muted text-sm">{t('statistics.productDetail.totalCarbs')}</Text>
        <Text className="text-foreground text-sm">{formatDecimal(stats.totalCarbs)} g</Text>
      </StatRow>
      {stats.averagePortion != null ? (
        <StatRow>
          <Text className="text-muted text-sm">{t('statistics.productDetail.averagePortion')}</Text>
          <Text className="text-foreground text-sm">
            {formatDecimal(stats.averagePortion)} {t('common.gramsUnit')}
          </Text>
        </StatRow>
      ) : null}
      {stats.averageCookedPortion != null ? (
        <StatRow>
          <Text className="text-muted text-sm">
            {t('statistics.productDetail.averageCookedPortion')}
          </Text>
          <Text className="text-foreground text-sm">
            {formatDecimal(stats.averageCookedPortion)} {t('common.gramsUnit')}
          </Text>
        </StatRow>
      ) : null}
      {stats.averageRawPortion != null ? (
        <StatRow>
          <Text className="text-muted text-sm">
            {t('statistics.productDetail.averageRawPortion')}
          </Text>
          <Text className="text-foreground text-sm">
            {formatDecimal(stats.averageRawPortion)} {t('common.gramsUnit')}
          </Text>
        </StatRow>
      ) : null}
      {stats.favoriteMealType ? (
        <StatRow>
          <Text className="text-muted text-sm">
            {t('statistics.productDetail.favoriteMealType')}
          </Text>
          <Text className="text-foreground text-sm">
            {t(getMealTypeLabelKey(stats.favoriteMealType))}
          </Text>
        </StatRow>
      ) : null}
    </View>
  );
};
