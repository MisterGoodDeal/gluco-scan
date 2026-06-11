import { APP_VERSION } from '@/constants/appVersion';

export const OFF_BASE_URL = 'https://world.openfoodfacts.net/api/v2/product';
export const OFF_USER_AGENT = `gluco-scan/${APP_VERSION}`;
export const SCAN_COOLDOWN_MS = 2500;
export const DEFAULT_GRAMS = 100;
export const OFF_RATE_LIMIT = 15;
export const OFF_RATE_WINDOW_MS = 60_000;
