import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

const runNotification = (type: Haptics.NotificationFeedbackType): void => {
  if (Platform.OS === 'web') return;
  void Haptics.notificationAsync(type);
};

export const triggerImpactLight = (): void => {
  if (Platform.OS === 'web') return;
  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};

export const triggerNotificationSuccess = (): void => {
  runNotification(Haptics.NotificationFeedbackType.Success);
};

export const triggerNotificationError = (): void => {
  runNotification(Haptics.NotificationFeedbackType.Error);
};

export const triggerNotificationWarning = (): void => {
  runNotification(Haptics.NotificationFeedbackType.Warning);
};
