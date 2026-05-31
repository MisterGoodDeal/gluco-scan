import { type FC } from 'react';

import { Text } from '@/components/atoms/Text';
import { formatDecimal } from '@/utils/format';

type CarbValueProps = {
  grams: number;
  suffix?: string;
};

export const CarbValue: FC<CarbValueProps> = ({ grams, suffix = 'g' }) => (
  <Text $variant="mono" $color="accent">
    {formatDecimal(grams)} {suffix}
  </Text>
);
