import dayjs from 'dayjs';
import { type FC, useCallback, useEffect, useMemo, useState } from 'react';
import DateTimePicker, {
  type CalendarComponents,
  type CalendarDay,
  type DateType,
  useDefaultClassNames,
} from 'react-native-ui-datepicker';
import { Text, View } from 'react-native';

import { getCurrentLocale } from '@/i18n';
import { mealRepository } from '@/repositories/meal.repository';
import { getMonthDateBounds, parseDateKey } from '@/utils/date';
import { formatDecimal } from '@/utils/format';

export const dateKeyFromPicker = (value: DateType): string | null => {
  if (value == null) return null;
  if (typeof value === 'string') return value.slice(0, 10);
  return dayjs(value).format('YYYY-MM-DD');
};

type MealCalendarDayProps = {
  day: CalendarDay;
  carbs?: number;
  showCarbs?: boolean;
};

const MealCalendarDay: FC<MealCalendarDayProps> = ({ day, carbs = 0, showCarbs = false }) => {
  const { text, isSelected, isToday, isCurrentMonth, isDisabled } = day;
  const showCarbsLabel = showCarbs && isCurrentMonth && carbs > 0;

  return (
    <View
      className={[
        showCarbs ? 'min-h-[42px]' : 'min-h-[36px]',
        'w-full items-center justify-center rounded-xl px-0.5 py-0.5',
        isSelected ? 'bg-accent' : '',
        isToday && !isSelected ? 'border border-accent bg-accent/10' : '',
        isDisabled ? 'opacity-40' : '',
        !isCurrentMonth ? 'opacity-35' : '',
      ]
        .filter(Boolean)
        .join(' ')}>
      <Text
        className={[
          'text-sm',
          isSelected ? 'font-semibold text-accent-foreground' : 'text-foreground',
        ].join(' ')}>
        {text}
      </Text>
      {showCarbsLabel ? (
        <Text
          className={[
            'text-[10px] leading-3',
            isSelected ? 'text-accent-foreground' : 'text-accent font-medium',
          ].join(' ')}
          numberOfLines={1}>
          {formatDecimal(carbs, carbs % 1 === 0 ? 0 : 1)}
        </Text>
      ) : showCarbs ? (
        <View className="h-3" />
      ) : null}
    </View>
  );
};

type MealCalendarPickerProps = {
  selectedDate: string;
  onSelectDate: (dateKey: string) => void;
  showDayCarbs?: boolean;
  containerHeight?: number;
  className?: string;
};

export const MealCalendarPicker: FC<MealCalendarPickerProps> = ({
  selectedDate,
  onSelectDate,
  showDayCarbs = true,
  containerHeight = 320,
  className = 'w-full',
}) => {
  const locale = getCurrentLocale();
  const defaultClassNames = useDefaultClassNames();
  const selectedParts = parseDateKey(selectedDate);
  const [visibleYear, setVisibleYear] = useState(selectedParts.getFullYear());
  const [visibleMonth, setVisibleMonth] = useState(selectedParts.getMonth());
  const [carbsByDate, setCarbsByDate] = useState<Record<string, number>>({});

  const loadMonthTotals = useCallback(async (year: number, month: number) => {
    const { start, end } = getMonthDateBounds(year, month);
    const totals = await mealRepository.getDayTotalsBetween(start, end);
    setCarbsByDate((prev) => ({ ...prev, ...totals }));
  }, []);

  useEffect(() => {
    const parts = parseDateKey(selectedDate);
    const year = parts.getFullYear();
    const month = parts.getMonth();
    setVisibleYear(year);
    setVisibleMonth(month);
    if (showDayCarbs) void loadMonthTotals(year, month);
  }, [loadMonthTotals, selectedDate, showDayCarbs]);

  const handleMonthChange = useCallback(
    (month: number) => {
      setVisibleMonth(month);
      if (showDayCarbs) void loadMonthTotals(visibleYear, month);
    },
    [loadMonthTotals, showDayCarbs, visibleYear],
  );

  const handleYearChange = useCallback(
    (year: number) => {
      setVisibleYear(year);
      if (showDayCarbs) void loadMonthTotals(year, visibleMonth);
    },
    [loadMonthTotals, showDayCarbs, visibleMonth],
  );

  const calendarComponents = useMemo<CalendarComponents>(
    () => ({
      Day: (day) => {
        const dateKey = dateKeyFromPicker(day.date) ?? '';
        return (
          <MealCalendarDay
            day={day}
            showCarbs={showDayCarbs}
            carbs={dateKey ? (carbsByDate[dateKey] ?? 0) : 0}
          />
        );
      },
    }),
    [carbsByDate, showDayCarbs],
  );

  const classNames = useMemo(
    () => ({
      ...defaultClassNames,
      today: 'border border-accent bg-accent/10',
      today_label: 'text-foreground font-medium',
      selected: 'bg-accent',
      selected_label: 'text-accent-foreground font-semibold',
      day_cell: 'p-0.5',
      weekday_label: 'text-muted text-xs uppercase',
      month_selector_label: 'text-foreground text-base font-semibold',
      year_selector_label: 'text-foreground text-base font-semibold',
    }),
    [defaultClassNames],
  );

  return (
    <DateTimePicker
      mode="single"
      calendar="gregory"
      locale={locale}
      numerals="latn"
      firstDayOfWeek={locale === 'fr' ? 1 : 0}
      date={selectedDate}
      month={visibleMonth}
      year={visibleYear}
      onMonthChange={handleMonthChange}
      onYearChange={handleYearChange}
      showOutsideDays
      weekdaysFormat="min"
      navigationPosition="around"
      containerHeight={containerHeight}
      className={className}
      classNames={classNames}
      components={calendarComponents}
      onChange={({ date }) => {
        const dateKey = dateKeyFromPicker(date);
        if (!dateKey) return;
        onSelectDate(dateKey);
      }}
    />
  );
};
