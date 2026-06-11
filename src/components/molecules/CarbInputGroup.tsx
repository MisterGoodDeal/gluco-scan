import { type FC, useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { CarbValue } from '@/components/atoms/CarbValue';
import { InputNumber } from '@/components/atoms/InputNumber';
import { getDecimalSeparator } from '@/i18n';
import { useMassDisplay } from '@/hooks/useMassDisplay';

type CarbInputGroupProps = {
  grams: number;
  carbs: number;
  onGramsChange: (grams: number) => void;
};

const isValidPartialDecimal = (text: string): boolean => /^\d*[,.]?\d*$/.test(text);

const parseGramsInput = (text: string): number => {
  const normalized = text.replace(',', '.');
  const parsed = parseFloat(normalized);
  return Number.isNaN(parsed) ? 0 : parsed;
};

export const CarbInputGroup: FC<CarbInputGroupProps> = ({
  grams,
  carbs,
  onGramsChange,
}) => {
  const decimalSeparator = getDecimalSeparator();
  const { massLabel, formatMassForInput, displayToGrams } = useMassDisplay();
  const [text, setText] = useState(() => formatMassForInput(grams));

  useEffect(() => {
    setText(formatMassForInput(grams));
  }, [grams, formatMassForInput]);

  const handleChange = (input: string) => {
    if (input === '') {
      setText('');
      onGramsChange(0);
      return;
    }

    if (!isValidPartialDecimal(input)) return;

    setText(input);

    if (new RegExp(`[${decimalSeparator === ',' ? ',' : '.'}]$`).test(input)) {
      onGramsChange(displayToGrams(parseGramsInput(input.slice(0, -1))));
      return;
    }

    onGramsChange(displayToGrams(parseGramsInput(input)));
  };

  const handleBlur = () => {
    if (text === '' || text === ',' || text === '.') {
      setText('');
      onGramsChange(0);
      return;
    }

    const parsed = displayToGrams(parseGramsInput(text));
    setText(formatMassForInput(parsed));
    onGramsChange(parsed);
  };

  return (
    <View className="flex-row items-center gap-2">
      <Text className="flex-1 text-muted text-sm">{massLabel}</Text>
      <InputNumber value={text} onChangeText={handleChange} onBlur={handleBlur} />
      <CarbValue grams={carbs} />
    </View>
  );
};
