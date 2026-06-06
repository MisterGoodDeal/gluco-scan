import { requireNativeModule } from 'expo-modules-core';

type GlucoWidgetBridgeNativeModule = {
  saveSnapshot: (json: string) => Promise<void>;
  loadSnapshot: () => Promise<string | null>;
  reloadWidget: () => Promise<void>;
};

export default requireNativeModule<GlucoWidgetBridgeNativeModule>('GlucoWidgetBridge');
