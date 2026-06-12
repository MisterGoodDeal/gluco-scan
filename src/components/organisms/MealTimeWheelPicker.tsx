import { Picker } from '@react-native-picker/picker';
import { useThemeColor } from 'heroui-native';
import { type FC, useMemo } from 'react';
import { Platform, Text, View } from 'react-native';

import { getCurrentLocale } from '@/i18n';

type MealTimeWheelPickerProps = {
  hours: number;
  minutes: number;
  onTimeChange: (hours: number, minutes: number) => void;
};

type Period = 'AM' | 'PM';

const pad = (value: number): string => String(value).padStart(2, '0');

const HOURS_24 = Array.from({ length: 24 }, (_, index) => index);
const HOURS_12 = Array.from({ length: 12 }, (_, index) => index + 1);
const MINUTES = Array.from({ length: 60 }, (_, index) => index);

const toHour12 = (hour24: number): number => {
  const hour = hour24 % 12;
  return hour === 0 ? 12 : hour;
};

const toHour24 = (hour12: number, period: Period): number => {
  if (period === 'AM') return hour12 === 12 ? 0 : hour12;
  return hour12 === 12 ? 12 : hour12 + 12;
};

export const MealTimeWheelPicker: FC<MealTimeWheelPickerProps> = ({
  hours,
  minutes,
  onTimeChange,
}) => {
  const foreground = useThemeColor('foreground');
  const use12Hours = getCurrentLocale() === 'en';
  const period: Period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = toHour12(hours);

  const pickerStyle = useMemo(
    () => ({
      flex: 1,
      ...(Platform.OS === 'ios' ? { height: 216 } : {}),
    }),
    [],
  );

  const itemStyle =
    Platform.OS === 'ios'
      ? { color: foreground, fontSize: 22, fontWeight: '600' as const }
      : undefined;

  if (use12Hours) {
    return (
      <View className="flex-row items-center">
        <Picker
          selectedValue={hour12}
          onValueChange={(value) => onTimeChange(toHour24(Number(value), period), minutes)}
          style={pickerStyle}
          itemStyle={itemStyle}>
          {HOURS_12.map((hour) => (
            <Picker.Item key={hour} label={pad(hour)} value={hour} />
          ))}
        </Picker>
        <Text className="text-foreground text-2xl font-semibold">:</Text>
        <Picker
          selectedValue={minutes}
          onValueChange={(value) => onTimeChange(hours, Number(value))}
          style={pickerStyle}
          itemStyle={itemStyle}>
          {MINUTES.map((minute) => (
            <Picker.Item key={minute} label={pad(minute)} value={minute} />
          ))}
        </Picker>
        <Picker
          selectedValue={period}
          onValueChange={(value) =>
            onTimeChange(toHour24(hour12, value as Period), minutes)
          }
          style={pickerStyle}
          itemStyle={itemStyle}>
          <Picker.Item label="AM" value="AM" />
          <Picker.Item label="PM" value="PM" />
        </Picker>
      </View>
    );
  }

  return (
    <View className="flex-row items-center">
      <Picker
        selectedValue={hours}
        onValueChange={(value) => onTimeChange(Number(value), minutes)}
        style={pickerStyle}
        itemStyle={itemStyle}>
        {HOURS_24.map((hour) => (
          <Picker.Item key={hour} label={pad(hour)} value={hour} />
        ))}
      </Picker>
      <Text className="text-foreground text-2xl font-semibold mx-1">:</Text>
      <Picker
        selectedValue={minutes}
        onValueChange={(value) => onTimeChange(hours, Number(value))}
        style={pickerStyle}
        itemStyle={itemStyle}>
        {MINUTES.map((minute) => (
          <Picker.Item key={minute} label={pad(minute)} value={minute} />
        ))}
      </Picker>
    </View>
  );
};
