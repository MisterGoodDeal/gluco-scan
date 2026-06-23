export const toDateKey = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const parseDateKey = (dateKey: string): Date => {
  const [y, m, d] = dateKey.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const addDays = (dateKey: string, days: number): string => {
  const date = parseDateKey(dateKey);
  date.setDate(date.getDate() + days);
  return toDateKey(date);
};

const getLocaleTag = (locale: string): string =>
  locale === 'fr' ? 'fr-FR' : 'en-US';

export const formatChartDayLabel = (dateKey: string, locale: string): string => {
  const date = parseDateKey(dateKey);
  const weekday = date.toLocaleDateString(getLocaleTag(locale), { weekday: 'long' });
  const dayLetter = weekday.charAt(0).toUpperCase();
  const dayOfMonth = String(date.getDate()).padStart(2, '0');
  return `${dayLetter} - ${dayOfMonth}`;
};

export const formatDateLabel = (dateKey: string, locale: string): string => {
  const date = parseDateKey(dateKey);
  return date.toLocaleDateString(getLocaleTag(locale), {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
};

export const formatTimeLabel = (iso: string, locale: string): string => {
  const date = new Date(iso);
  return date.toLocaleTimeString(getLocaleTag(locale), {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const combineDateAndTime = (dateKey: string, hours: number, minutes: number): string => {
  const date = parseDateKey(dateKey);
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
};

export const getMonthDateBounds = (
  year: number,
  monthIndex: number,
): { start: string; end: string } => {
  const start = new Date(year, monthIndex, 1);
  const end = new Date(year, monthIndex + 1, 0);
  return { start: toDateKey(start), end: toDateKey(end) };
};

export const getNowParts = (): { dateKey: string; hours: number; minutes: number } => {
  const now = new Date();
  return {
    dateKey: toDateKey(now),
    hours: now.getHours(),
    minutes: now.getMinutes(),
  };
};
