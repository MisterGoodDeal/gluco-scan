import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { type FC } from 'react';
import { type ColorValue } from 'react-native';

type TabBarIconProps = {
  name: SymbolViewProps['name'];
  color: ColorValue;
  size?: number;
};

export const TabBarIcon: FC<TabBarIconProps> = ({ name, color, size = 22 }) => (
  <SymbolView name={name} size={size} tintColor={color} />
);
