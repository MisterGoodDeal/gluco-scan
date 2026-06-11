import { Dialog, Switch, Tabs } from 'heroui-native';
import { type FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';

import { InputNumber } from '@/components/atoms/InputNumber';
import { AppButton } from '@/components/ui/AppButton';
import { useSettingsStore } from '@/store/settings.store';
import { useCookingConversionStore } from '@/store/cookingConversion.store';
import type { MealDraftItem } from '@/store/meal.store';
import type { Product } from '@/types/product';
import type { MealItemQuantityType } from '@/types/mealItem';
import { computeMealItemCarbsWithCooking } from '@/utils/carbs';
import { hasCookingConversion } from '@/utils/cooking/hasCookingConversion';
import { useMassDisplay } from '@/hooks/useMassDisplay';
import { defaultDisplayMassQuantity } from '@/utils/mass';
import { formatDecimal } from '@/utils/format';
import { triggerImpactLight, triggerNotificationSuccess } from '@/utils/haptics';

export type QuantityPickerConfirm = {
  quantity: number;
  unitType: 'grams' | 'custom';
  unitId?: string;
  quantityType?: MealItemQuantityType;
  rawEquivalentQuantity: number;
  productName: string;
  carbsPer100g: number;
  carbs: number;
  unitLabel: string;
  productTags: Product['tags'];
};

type QuantityPickerModalProps = {
  visible: boolean;
  product: Product | null;
  initialItem?: MealDraftItem | null;
  onClose: () => void;
  onConfirm: (payload: QuantityPickerConfirm) => void;
};

const resolveUnitFromItem = (item: MealDraftItem, options: UnitOption[]): UnitOption | null => {
  if (item.unitType === 'grams') {
    return options.find((opt) => opt.unitType === 'grams') ?? null;
  }
  return (
    options.find((opt) => opt.unitType === 'custom' && opt.id === item.unitId) ?? null
  );
};

type UnitOption = {
  id: string;
  label: string;
  abbreviation: string;
  equivalentInGrams: number;
  unitType: 'grams' | 'custom';
};

const getUnitTabValue = (opt: UnitOption): string => `${opt.unitType}-${opt.id}`;

const UNIT_TABS_SCROLL_THRESHOLD = 4;

export const QuantityPickerModal: FC<QuantityPickerModalProps> = ({
  visible,
  product,
  initialItem = null,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation();
  const globalUnits = useSettingsStore((s) => s.globalUnits);
  const userConversions = useCookingConversionStore((s) => s.conversions);
  const { unitSystem, massUnit, massLabel, displayToGrams, formatMassForInput } =
    useMassDisplay();

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

  const defaultUnit = useMemo((): UnitOption | null => {
    if (!product || unitOptions.length === 0) return null;
    if (product.customUnits.length > 0) return unitOptions[0];
    return unitOptions.find((opt) => opt.unitType === 'grams') ?? unitOptions[0];
  }, [product, unitOptions]);

  const [selectedUnit, setSelectedUnit] = useState<UnitOption | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [quantityType, setQuantityType] = useState<MealItemQuantityType>('cooked');
  const [gramsText, setGramsText] = useState(() => String(defaultDisplayMassQuantity(unitSystem)));

  const productKey = product
    ? product.id || product.eans[0] || product.name
    : null;
  const initialItemKey = initialItem?.id ?? null;

  useEffect(() => {
    if (!visible) {
      setSelectedUnit(null);
      setQuantity(1);
      setQuantityType('cooked');
      return;
    }
    if (!product || !defaultUnit) return;

    if (initialItem && initialItem.productId === product.id) {
      const unit = resolveUnitFromItem(initialItem, unitOptions) ?? defaultUnit;
      setSelectedUnit(unit);
      if (unit.unitType === 'grams') {
        setGramsText(formatMassForInput(initialItem.quantity));
        setQuantity(1);
      } else {
        setQuantity(Math.max(1, initialItem.quantity));
        setGramsText(String(defaultDisplayMassQuantity(unitSystem)));
      }
      setQuantityType(initialItem.quantityType ?? 'raw');
      return;
    }

    setSelectedUnit(defaultUnit);
    setQuantity(1);
    setQuantityType('cooked');
    setGramsText(String(defaultDisplayMassQuantity(unitSystem)));
  }, [
    visible,
    productKey,
    initialItemKey,
    defaultUnit,
    unitSystem,
    unitOptions,
    product,
    initialItem,
    formatMassForInput,
  ]);

  if (!product) return null;

  const activeUnit =
    selectedUnit &&
    unitOptions.some(
      (opt) => opt.id === selectedUnit.id && opt.unitType === selectedUnit.unitType,
    )
      ? selectedUnit
      : defaultUnit;

  const isGrams = activeUnit?.unitType === 'grams';
  const parsedDisplay = parseFloat(gramsText.replace(',', '.')) || 0;
  const qty = isGrams ? displayToGrams(parsedDisplay) : quantity;
  const cookingEligible =
    isGrams && hasCookingConversion(product, userConversions);
  const isCooked = quantityType === 'cooked';

  const carbsResult = activeUnit
    ? computeMealItemCarbsWithCooking(
        {
          quantity: qty,
          unitType: activeUnit.unitType,
          unitId: activeUnit.unitType === 'custom' ? activeUnit.id : undefined,
          quantityType: cookingEligible ? quantityType : 'raw',
        },
        product,
        globalUnits,
        userConversions,
      )
    : { carbs: 0, rawEquivalentQuantity: 0, quantityType: 'raw' as const };

  const handleConfirm = () => {
    if (!activeUnit) return;
    onConfirm({
      quantity: qty,
      unitType: activeUnit.unitType,
      unitId: activeUnit.unitType === 'custom' ? activeUnit.id : undefined,
      quantityType: carbsResult.quantityType,
      rawEquivalentQuantity: carbsResult.rawEquivalentQuantity,
      productName: product.name,
      carbsPer100g: product.carbsPer100g,
      carbs: carbsResult.carbs,
      unitLabel: activeUnit.abbreviation,
      productTags: product.tags,
    });
    triggerNotificationSuccess();
    onClose();
  };

  return (
    <Dialog isOpen={visible} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          pointerEvents="box-none"
          style={{ flex: 1, justifyContent: 'center' }}>
          <Dialog.Content>
            <Dialog.Close />
            <View className="gap-1 mb-3 pr-8">
              <Dialog.Title>{product.name}</Dialog.Title>
              <Dialog.Description>{t('meals.selectQuantity')}</Dialog.Description>
            </View>

            {activeUnit ? (
              <Tabs
                value={getUnitTabValue(activeUnit)}
                onValueChange={(value) => {
                  const opt = unitOptions.find((o) => getUnitTabValue(o) === value);
                  if (!opt) return;
                  triggerImpactLight();
                  setSelectedUnit(opt);
                }}
                variant="primary">
                <Tabs.List className="w-full self-stretch">
                  {unitOptions.length > UNIT_TABS_SCROLL_THRESHOLD ? (
                    <Tabs.ScrollView scrollAlign="center" contentContainerClassName="gap-1">
                      <Tabs.Indicator />
                      {unitOptions.map((opt) => (
                        <Tabs.Trigger key={getUnitTabValue(opt)} value={getUnitTabValue(opt)}>
                          <Tabs.Label>{opt.abbreviation}</Tabs.Label>
                        </Tabs.Trigger>
                      ))}
                    </Tabs.ScrollView>
                  ) : (
                    <>
                      <Tabs.Indicator />
                      {unitOptions.map((opt) => (
                        <Tabs.Trigger
                          key={getUnitTabValue(opt)}
                          value={getUnitTabValue(opt)}
                          className="flex-1">
                          <Tabs.Label className="text-center">{opt.abbreviation}</Tabs.Label>
                        </Tabs.Trigger>
                      ))}
                    </>
                  )}
                </Tabs.List>

                {unitOptions.map((opt) => {
                  const tabIsGrams = opt.unitType === 'grams';
                  const tabCookingEligible =
                    tabIsGrams && product && hasCookingConversion(product, userConversions);

                  return (
                    <Tabs.Content key={getUnitTabValue(opt)} value={getUnitTabValue(opt)}>
                      {tabCookingEligible ? (
                        <View className="flex-row items-center justify-between mt-4">
                          <Text className="text-muted text-sm">{t('meals.weighingType')}</Text>
                          <View className="flex-row items-center gap-2">
                            <Text className="text-foreground text-sm font-medium">
                              {isCooked ? t('meals.weighingCooked') : t('meals.weighingRaw')}
                            </Text>
                            <Switch
                              isSelected={isCooked}
                              onSelectedChange={(selected) => {
                                triggerImpactLight();
                                setQuantityType(selected ? 'cooked' : 'raw');
                              }}
                              accessibilityLabel={t('meals.weighingType')}
                            />
                          </View>
                        </View>
                      ) : null}

                      {tabIsGrams ? (
                        <View className="mt-4">
                          <InputNumber
                            value={gramsText}
                            onChangeText={setGramsText}
                            placeholder={String(defaultDisplayMassQuantity(unitSystem))}
                          />
                        </View>
                      ) : (
                        <View className="flex-row items-center justify-center gap-4 my-5">
                          <AppButton
                            isIconOnly
                            size="sm"
                            variant="tertiary"
                            onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                            accessibilityLabel="-">
                            <Text className="text-foreground text-lg font-semibold">−</Text>
                          </AppButton>
                          <Text className="text-foreground text-2xl font-bold">
                            {quantity} {opt.abbreviation}
                          </Text>
                          <AppButton
                            isIconOnly
                            size="sm"
                            variant="tertiary"
                            onPress={() => setQuantity((q) => q + 1)}
                            accessibilityLabel="+">
                            <Text className="text-foreground text-lg font-semibold">+</Text>
                          </AppButton>
                        </View>
                      )}
                    </Tabs.Content>
                  );
                })}
              </Tabs>
            ) : null}

            <Text className="text-accent text-base font-semibold text-center mt-3">
              {formatDecimal(carbsResult.carbs)} g
            </Text>

            <AppButton
              variant="primary"
              className="mt-4"
              haptic={false}
              onPress={handleConfirm}>
              {initialItem ? t('common.save') : t('common.add')}
            </AppButton>
          </Dialog.Content>
        </KeyboardAvoidingView>
      </Dialog.Portal>
    </Dialog>
  );
};
