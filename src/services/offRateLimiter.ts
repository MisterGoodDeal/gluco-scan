import { OFF_RATE_LIMIT, OFF_RATE_WINDOW_MS } from '@/constants/api';
import { OffRateLimitError } from '@/services/errors';

const callTimestamps: number[] = [];

const pruneExpiredCalls = (now: number): void => {
  const windowStart = now - OFF_RATE_WINDOW_MS;
  while (callTimestamps.length > 0 && callTimestamps[0] < windowStart) {
    callTimestamps.shift();
  }
};

const getRetryAfterSeconds = (now: number): number => {
  if (callTimestamps.length === 0) return 1;
  const waitMs = callTimestamps[0] + OFF_RATE_WINDOW_MS - now;
  return Math.max(1, Math.ceil(waitMs / 1000));
};

export const consumeOffApiCall = (): void => {
  const now = Date.now();
  pruneExpiredCalls(now);

  if (callTimestamps.length >= OFF_RATE_LIMIT) {
    throw new OffRateLimitError(getRetryAfterSeconds(now));
  }

  callTimestamps.push(now);
};
