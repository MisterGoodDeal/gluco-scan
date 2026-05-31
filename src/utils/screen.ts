import { Platform, StatusBar } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const hasNotchOrDynamicIsland = (): boolean => {
  if (Platform.OS === 'web') return false;
  const DeviceInfo = require('react-native-device-info').default as {
    hasDynamicIsland: () => boolean;
    hasNotch: () => boolean;
  };
  return DeviceInfo.hasDynamicIsland() || DeviceInfo.hasNotch();
};

export const topScreenSpace = hasNotchOrDynamicIsland()
  ? hp('4%')
  : (StatusBar.currentHeight ?? 0) + hp('1.5%');

export const scannerHeight = hp('15%');
export const scannerMinHeight = hp('20%');
export const scannerPermissionHeight = hp('22%');
export const footerBottomSpace = hp('2%');

export { hp, wp };
