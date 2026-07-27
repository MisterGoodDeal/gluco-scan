import {
  OFF_RATE_LIMIT,
  OFF_RATE_WINDOW_MS,
  OFF_SEARCH_RATE_LIMIT,
  OFF_SEARCH_RATE_WINDOW_MS,
} from '@/constants/api';
import { OffRateLimitError } from '@/services/errors';

const callTimestamps: number[] = [];
const searchCallTimestamps: number[] = [];

const pruneExpiredCalls = (timestamps: number[], windowMs: number, now: number): void => {
  const windowStart = now - windowMs;
  while (timestamps.length > 0 && timestamps[0] < windowStart) {
    timestamps.shift();
  }
};

const getRetryAfterSeconds = (
  timestamps: number[],
  windowMs: number,
  now: number,
): number => {
  if (timestamps.length === 0) return 1;
  const waitMs = timestamps[0] + windowMs - now;
  return Math.max(1, Math.ceil(waitMs / 1000));
};

const consumeApiCall = (
  timestamps: number[],
  limit: number,
  windowMs: number,
): void => {
  const now = Date.now();
  pruneExpiredCalls(timestamps, windowMs, now);

  if (timestamps.length >= limit) {
    throw new OffRateLimitError(getRetryAfterSeconds(timestamps, windowMs, now));
  }

  timestamps.push(now);
};

export const consumeOffApiCall = (): void => {
  consumeApiCall(callTimestamps, OFF_RATE_LIMIT, OFF_RATE_WINDOW_MS);
};

export const consumeOffSearchApiCall = (): void => {
  consumeApiCall(searchCallTimestamps, OFF_SEARCH_RATE_LIMIT, OFF_SEARCH_RATE_WINDOW_MS);
};
