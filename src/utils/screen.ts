import { StatusBar } from "react-native";
import DeviceInfo from "react-native-device-info";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

export const topScreenSpace =
  DeviceInfo.hasDynamicIsland() || DeviceInfo.hasNotch()
    ? hp("7%")
    : (StatusBar.currentHeight ?? 0) + hp("2.5%");

export { hp, wp };
