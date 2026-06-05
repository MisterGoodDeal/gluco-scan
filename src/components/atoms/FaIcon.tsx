import { type FC } from 'react';
import { Text, type ColorValue, type TextStyle } from 'react-native';

import { FA_FONT_FAMILY, faIconChar, type FaIconName } from '@/constants/fontAwesome';

type FaIconProps = {
  name: FaIconName;
  size?: number;
  color?: ColorValue;
  style?: TextStyle;
};

export const FaIcon: FC<FaIconProps> = ({ name, size = 16, color, style }) => (
  <Text
    accessibilityElementsHidden
    importantForAccessibility="no-hide-descendants"
    style={[
      {
        fontFamily: FA_FONT_FAMILY,
        fontSize: size,
        color,
        lineHeight: size,
      },
      style,
    ]}>
    {faIconChar(name)}
  </Text>
);
