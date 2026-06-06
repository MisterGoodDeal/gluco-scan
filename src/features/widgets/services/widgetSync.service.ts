import { loadEnrichedMeals } from '@/features/statistics/services/statisticsData.service';
import { WidgetBridge } from '@/features/widgets/bridge/widgetBridge';
import { buildWidgetSnapshot } from '@/features/widgets/services/widgetSnapshot.service';

const SYNC_DEBOUNCE_MS = 500;

let syncTimer: ReturnType<typeof setTimeout> | null = null;
let syncInFlight: Promise<void> | null = null;

export const syncWidgetData = async (): Promise<void> => {
  const meals = await loadEnrichedMeals();
  const snapshot = buildWidgetSnapshot(meals);
  await WidgetBridge.saveSnapshot(JSON.stringify(snapshot));
  await WidgetBridge.reloadWidget();
};

export const scheduleWidgetSync = (): void => {
  if (syncTimer != null) {
    clearTimeout(syncTimer);
  }

  syncTimer = setTimeout(() => {
    syncTimer = null;
    if (syncInFlight != null) {
      return;
    }

    syncInFlight = syncWidgetData()
      .catch(() => undefined)
      .finally(() => {
        syncInFlight = null;
      });
  }, SYNC_DEBOUNCE_MS);
};

export const flushWidgetSync = async (): Promise<void> => {
  if (syncTimer != null) {
    clearTimeout(syncTimer);
    syncTimer = null;
  }

  if (syncInFlight != null) {
    await syncInFlight;
    return;
  }

  await syncWidgetData().catch(() => undefined);
};
