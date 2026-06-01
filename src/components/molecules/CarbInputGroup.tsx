import { type FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

import { CarbValue } from '@/components/atoms/CarbValue';
import { InputNumber } from '@/components/atoms/InputNumber';
import { Text } from '@/components/atoms/Text';
import { getDecimalSeparator } from '@/i18n';
import { useMassDisplay } from '@/hooks/useMassDisplay';

type CarbInputGroupProps = {
  grams: number;
  carbs: number;
  onGramsChange: (grams: number) => void;
};

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const Label = styled(Text)`
  flex: 1;
`;

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
  const { t } = useTranslation();
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
    <Row>
      <Label $variant="caption" $color="textSecondary">
        {massLabel}
      </Label>
      <InputNumber value={text} onChangeText={handleChange} onBlur={handleBlur} />
      <CarbValue grams={carbs} />
    </Row>
  );
};
