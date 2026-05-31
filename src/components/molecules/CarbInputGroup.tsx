import { type FC } from 'react';
import styled from 'styled-components/native';

import { CarbValue } from '@/components/atoms/CarbValue';
import { InputNumber } from '@/components/atoms/InputNumber';
import { Text } from '@/components/atoms/Text';

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

export const CarbInputGroup: FC<CarbInputGroupProps> = ({
  grams,
  carbs,
  onGramsChange,
}) => {
  const handleChange = (text: string) => {
    const normalized = text.replace(',', '.');
    const parsed = parseFloat(normalized);
    if (!Number.isNaN(parsed) && parsed >= 0) {
      onGramsChange(parsed);
    } else if (text === '' || text === '0') {
      onGramsChange(0);
    }
  };

  return (
    <Row>
      <Label $variant="caption" $color="textSecondary">
        Grammes
      </Label>
      <InputNumber value={grams > 0 ? String(grams) : ''} onChangeText={handleChange} />
      <CarbValue grams={carbs} />
    </Row>
  );
};
