import { type FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Text } from '@/components/atoms/Text';
import { formatDecimal } from '@/utils/format';

type CarbValueProps = {
  grams: number;
  suffix?: string;
};

export const CarbValue: FC<CarbValueProps> = ({ grams, suffix }) => {
  const { t } = useTranslation();

  return (
    <Text $variant="mono" $color="accent">
      {formatDecimal(grams)} {suffix ?? t('common.gramsUnit')}
    </Text>
  );
};
