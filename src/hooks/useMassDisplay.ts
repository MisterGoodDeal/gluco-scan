import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { usePreferencesStore } from '@/store/preferences.store';
import { displayMassToGrams, gramsToDisplayMass } from '@/utils/mass';
import { formatDecimal, formatDecimalForInput } from '@/utils/format';

export const useMassDisplay = () => {
  const { t } = useTranslation();
  const unitSystem = usePreferencesStore((s) => s.unitSystem);

  const massUnit = unitSystem === 'metric' ? t('common.gramsUnit') : t('common.ouncesUnit');
  const massLabel = unitSystem === 'metric' ? t('common.grams') : t('common.ounces');

  const formatMassValue = useCallback(
    (grams: number, decimals = 1) => formatDecimal(gramsToDisplayMass(grams, unitSystem), decimals),
    [unitSystem],
  );

  const formatMassForInput = useCallback(
    (grams: number) => formatDecimalForInput(gramsToDisplayMass(grams, unitSystem)),
    [unitSystem],
  );

  const formatMassWithUnit = useCallback(
    (grams: number, decimals = 1) => `${formatMassValue(grams, decimals)} ${massUnit}`,
    [formatMassValue, massUnit],
  );

  const parseDisplayMass = useCallback(
    (value: number) => displayMassToGrams(value, unitSystem),
    [unitSystem],
  );

  const formatEquivalentMass = useCallback(
    (grams: number) => formatMassWithUnit(grams, grams % 1 === 0 ? 0 : 1),
    [formatMassWithUnit],
  );

  return {
    unitSystem,
    massUnit,
    massLabel,
    formatMassValue,
    formatMassForInput,
    formatMassWithUnit,
    formatEquivalentMass,
    parseDisplayMass,
    gramsToDisplay: (grams: number) => gramsToDisplayMass(grams, unitSystem),
    displayToGrams: (value: number) => displayMassToGrams(value, unitSystem),
  };
};
