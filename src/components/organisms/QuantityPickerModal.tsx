import { BlurView } from 'expo-blur';
import { type FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, StyleSheet } from 'react-native';
import styled, { useTheme } from 'styled-components/native';

import { ButtonIcon } from '@/components/atoms/ButtonIcon';
import { GlassPanel } from '@/components/atoms/GlassPanel';
import { InputNumber } from '@/components/atoms/InputNumber';
import { Text } from '@/components/atoms/Text';
import { useSettingsStore } from '@/store/settings.store';
import type { Product } from '@/types/product';
import { computeItemCarbs } from '@/utils/carbs';
import { useMassDisplay } from '@/hooks/useMassDisplay';
import { defaultDisplayMassQuantity } from '@/utils/mass';
import { formatDecimal } from '@/utils/format';

export type QuantityPickerConfirm = {
  quantity: number;
  unitType: 'grams' | 'custom';
  unitId?: string;
  productName: string;
  carbsPer100g: number;
  carbs: number;
  unitLabel: string;
};

type QuantityPickerModalProps = {
  visible: boolean;
  product: Product | null;
  onClose: () => void;
  onConfirm: (payload: QuantityPickerConfirm) => void;
};

type UnitOption = {
  id: string;
  label: string;
  abbreviation: string;
  equivalentInGrams: number;
  unitType: 'grams' | 'custom';
};

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md}px;
  margin: ${({ theme }) => theme.spacing.lg}px 0;
`;

const UnitChip = styled.Pressable<{ $selected?: boolean }>`
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  border-width: 1px;
  border-color: ${({ theme, $selected }) =>
    $selected ? theme.colors.accent : theme.colors.glass.border};
  background-color: ${({ theme, $selected }) =>
    $selected ? theme.colors.accentMuted : theme.colors.glass.background};
  margin: ${({ theme }) => theme.spacing.xs}px;
`;

const Chips = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`;

const ActionButton = styled.Pressable`
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.lg}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme }) => theme.colors.accent};
  align-self: center;
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;

export const QuantityPickerModal: FC<QuantityPickerModalProps> = ({
  visible,
  product,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const globalUnits = useSettingsStore((s) => s.globalUnits);
  const { unitSystem, massUnit, massLabel, displayToGrams } = useMassDisplay();

  const unitOptions: UnitOption[] = useMemo(() => {
    if (!product) return [];
    const productOpts: UnitOption[] = product.customUnits.map((u) => ({
      id: u.id,
      label: u.name,
      abbreviation: u.abbreviation,
      equivalentInGrams: u.equivalentInGrams,
      unitType: 'custom' as const,
    }));
    const globalOpts: UnitOption[] = globalUnits.map((u) => ({
      id: u.id,
      label: u.name,
      abbreviation: u.abbreviation,
      equivalentInGrams: u.equivalentInGrams,
      unitType: 'custom' as const,
    }));
    const gramsOpt: UnitOption = {
      id: 'grams',
      label: massLabel,
      abbreviation: massUnit,
      equivalentInGrams: 1,
      unitType: 'grams',
    };
    return [...productOpts, ...globalOpts, gramsOpt];
  }, [product, globalUnits, massLabel, massUnit]);

  const [selectedUnit, setSelectedUnit] = useState<UnitOption | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [gramsText, setGramsText] = useState(() => String(defaultDisplayMassQuantity(unitSystem)));

  useEffect(() => {
    if (unitOptions.length > 0) {
      setSelectedUnit((current) => current ?? unitOptions[0]);
    }
  }, [unitOptions]);

  useEffect(() => {
    setGramsText(String(defaultDisplayMassQuantity(unitSystem)));
  }, [unitSystem]);

  if (!product) return null;

  const isGrams = selectedUnit?.unitType === 'grams';
  const parsedDisplay = parseFloat(gramsText.replace(',', '.')) || 0;
  const qty = isGrams ? displayToGrams(parsedDisplay) : quantity;

  const carbs = selectedUnit
    ? computeItemCarbs(
        qty,
        selectedUnit.unitType,
        product.carbsPer100g,
        selectedUnit.equivalentInGrams,
      )
    : 0;

  const handleConfirm = () => {
    if (!selectedUnit) return;
    onConfirm({
      quantity: qty,
      unitType: selectedUnit.unitType,
      unitId: selectedUnit.unitType === 'custom' ? selectedUnit.id : undefined,
      productName: product.name,
      carbsPer100g: product.carbsPer100g,
      carbs,
      unitLabel: selectedUnit.abbreviation,
    });
    onClose();
    setQuantity(1);
    setGramsText(String(defaultDisplayMassQuantity(unitSystem)));
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <BlurView
        intensity={50}
        tint={theme.blur.tint}
        blurMethod={theme.blur.androidMethod}
        style={StyleSheet.absoluteFill}>
        <Pressable style={{ flex: 1, justifyContent: 'center', padding: 24 }} onPress={onClose}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <GlassPanel padding={theme.spacing.lg}>
              <Text $variant="subtitle">{product.name}</Text>
              <Text $variant="caption" $color="textSecondary">
                {t('meals.selectQuantity')}
              </Text>

              <Chips>
                {unitOptions.map((opt) => (
                  <UnitChip
                    key={opt.id}
                    $selected={selectedUnit?.id === opt.id}
                    onPress={() => setSelectedUnit(opt)}>
                    <Text $variant="caption">{opt.abbreviation}</Text>
                  </UnitChip>
                ))}
              </Chips>

              {isGrams ? (
                <InputNumber
                  value={gramsText}
                  onChangeText={setGramsText}
                  placeholder={String(defaultDisplayMassQuantity(unitSystem))}
                />
              ) : (
                <Row>
                  <ButtonIcon
                    onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                    accessibilityLabel="-">
                    <Text $variant="subtitle">−</Text>
                  </ButtonIcon>
                  <Text $variant="title">
                    {quantity} {selectedUnit?.abbreviation}
                  </Text>
                  <ButtonIcon
                    onPress={() => setQuantity((q) => q + 1)}
                    accessibilityLabel="+">
                    <Text $variant="subtitle">+</Text>
                  </ButtonIcon>
                </Row>
              )}

              <Text $variant="body" $color="accent" style={{ textAlign: 'center' }}>
                {formatDecimal(carbs)} g
              </Text>

              <ActionButton onPress={handleConfirm}>
                <Text $variant="caption">{t('common.add')}</Text>
              </ActionButton>
            </GlassPanel>
          </Pressable>
        </Pressable>
      </BlurView>
    </Modal>
  );
};
