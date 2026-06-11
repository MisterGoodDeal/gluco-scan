import { type FC } from 'react';
import { type ColorValue } from 'react-native';

import { FaIcon } from '@/components/atoms/FaIcon';
import type { FaIconName } from '@/constants/fontAwesome';

type TabBarIconProps = {
  name: FaIconName;
  color: ColorValue;
  size?: number;
};

export const TabBarIcon: FC<TabBarIconProps> = ({ name, color, size = 20 }) => (
  <FaIcon name={name} size={size} color={color} />
);
