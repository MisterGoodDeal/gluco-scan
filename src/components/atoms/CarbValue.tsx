import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';

import { formatDecimal } from '@/utils/format';

type CarbValueProps = {
  grams: number;
  suffix?: string;
};

export const CarbValue: FC<CarbValueProps> = ({ grams, suffix }) => {
  const { t } = useTranslation();

  return (
    <Text className="text-accent font-mono text-sm font-semibold">
      {formatDecimal(grams)} {suffix ?? t('common.gramsUnit')}
    </Text>
  );
};
