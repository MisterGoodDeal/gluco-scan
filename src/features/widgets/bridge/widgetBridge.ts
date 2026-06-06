import GlucoWidgetBridge from 'gluco-widget-bridge';
import { Platform } from 'react-native';

export const WidgetBridge = {
  async saveSnapshot(json: string): Promise<void> {
    if (Platform.OS !== 'ios') return;
    await GlucoWidgetBridge.saveSnapshot(json);
  },

  async loadSnapshot(): Promise<string | null> {
    if (Platform.OS !== 'ios') return null;
    return GlucoWidgetBridge.loadSnapshot();
  },

  async reloadWidget(): Promise<void> {
    if (Platform.OS !== 'ios') return;
    await GlucoWidgetBridge.reloadWidget();
  },
};
