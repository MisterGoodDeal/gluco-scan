import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

import { Text } from '@/components/atoms/Text';
import { usePreferencesStore } from '@/store/preferences.store';
import { unitSystems, type UnitSystem } from '@/types/unitSystem';

const Row = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const Option = styled.Pressable<{ $selected?: boolean }>`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  align-items: center;
  background-color: ${({ theme, $selected }) =>
    $selected ? theme.colors.accentMuted : theme.colors.glass.background};
  border-width: 1px;
  border-color: ${({ theme, $selected }) =>
    $selected ? theme.colors.accent : theme.colors.glass.border};
`;

export const UnitSystemPicker: FC = () => {
  const { t } = useTranslation();
  const unitSystem = usePreferencesStore((s) => s.unitSystem);
  const setUnitSystem = usePreferencesStore((s) => s.setUnitSystem);

  const labels: Record<UnitSystem, string> = {
    metric: t('settings.unitMetric'),
    imperial: t('settings.unitImperial'),
  };

  return (
    <Row>
      {unitSystems.map((option) => (
        <Option
          key={option}
          $selected={unitSystem === option}
          onPress={() => void setUnitSystem(option)}
          accessibilityRole="button"
          accessibilityState={{ selected: unitSystem === option }}
          accessibilityLabel={labels[option]}>
          <Text
            $variant="caption"
            $color={unitSystem === option ? 'accent' : 'textSecondary'}
            style={{ fontWeight: unitSystem === option ? '600' : '500' }}>
            {labels[option]}
          </Text>
        </Option>
      ))}
    </Row>
  );
};
