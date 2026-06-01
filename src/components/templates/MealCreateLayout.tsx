import { router } from 'expo-router';
import { type FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Pressable, ScrollView, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import styled from 'styled-components/native';

import { BackgroundGradient } from '@/components/atoms/BackgroundGradient';
import { PickerField } from '@/components/atoms/PickerField';
import { Text } from '@/components/atoms/Text';
import {
  MealMetaPickerSheet,
  type MealMetaPickerField,
} from '@/components/organisms/MealMetaPickerSheet';
import { QuantityPickerModal } from '@/components/organisms/QuantityPickerModal';
import { ScanMealModal } from '@/components/organisms/ScanMealModal';
import { getCurrentLocale } from '@/i18n';
import { useSettingsStore } from '@/store/settings.store';
import { useMealStore } from '@/store/meal.store';
import type { Product } from '@/types/product';
import { formatDateLabel } from '@/utils/date';
import { formatDecimal } from '@/utils/format';
import { getMealTypeLabelKey } from '@/utils/mealType';
import { Screen, ScreenHeaderBar } from '@/styles/global';

const Header = styled(ScreenHeaderBar)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const StepIndicator = styled.View`
  flex-direction: row;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const Dot = styled.View<{ $active?: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${({ theme, $active }) =>
    $active ? theme.colors.accent : theme.colors.glass.border};
`;

const Field = styled.View`
  margin: ${({ theme }) => theme.spacing.md}px;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const NavRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md}px;
`;

const ActionButton = styled.Pressable<{ $primary?: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.lg}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme, $primary }) =>
    $primary ? theme.colors.accent : theme.colors.glass.background};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.glass.border};
`;

const ItemRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.sm}px;
  margin-horizontal: ${({ theme }) => theme.spacing.md}px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.glass.border};
`;

export const MealCreateLayout: FC = () => {
  const { t } = useTranslation();
  const locale = getCurrentLocale();
  const step = useMealStore((s) => s.step);
  const setStep = useMealStore((s) => s.setStep);
  const draftMeta = useMealStore((s) => s.draftMeta);
  const setDraftMeta = useMealStore((s) => s.setDraftMeta);
  const draftItems = useMealStore((s) => s.draftItems);
  const removeDraftItem = useMealStore((s) => s.removeDraftItem);
  const addDraftItem = useMealStore((s) => s.addDraftItem);
  const saveMeal = useMealStore((s) => s.saveMeal);
  const hydrateSettings = useSettingsStore((s) => s.hydrate);

  const [scanVisible, setScanVisible] = useState(false);
  const [pickerProduct, setPickerProduct] = useState<Product | null>(null);
  const [openMetaPicker, setOpenMetaPicker] = useState<MealMetaPickerField | null>(null);

  const timeLabel = `${String(draftMeta.hours).padStart(2, '0')}:${String(draftMeta.minutes).padStart(2, '0')}`;

  useEffect(() => {
    void hydrateSettings();
  }, [hydrateSettings]);

  useEffect(() => {
    if (step !== 0) setOpenMetaPicker(null);
  }, [step]);

  const draftTotal = draftItems.reduce((sum, item) => sum + item.carbs, 0);

  const handleSave = async () => {
    if (draftItems.length === 0) {
      Alert.alert(t('meals.noItems'));
      return;
    }
    await saveMeal();
    router.back();
  };

  return (
    <Screen>
      <StatusBar style="light" />
      <BackgroundGradient />
      <Header>
        <Pressable onPress={() => router.back()}>
          <Text $variant="body" $color="accent">
            {t('common.cancel')}
          </Text>
        </Pressable>
        <Text $variant="subtitle">{t('meals.createTitle')}</Text>
        <View style={{ width: 60 }} />
      </Header>

      <StepIndicator>
        {[0, 1, 2].map((i) => (
          <Dot key={i} $active={step === i} />
        ))}
      </StepIndicator>

      <ScrollView style={{ flex: 1 }}>
        {step === 0 && (
          <>
            <Field>
              <Text $variant="caption" $color="textSecondary">
                {t('meals.mealType')}
              </Text>
              <PickerField
                value={t(getMealTypeLabelKey(draftMeta.type))}
                onPress={() => setOpenMetaPicker('mealType')}
                accessibilityLabel={t('meals.mealType')}
              />
            </Field>
            <Field>
              <Text $variant="caption" $color="textSecondary">
                {t('meals.date')}
              </Text>
              <PickerField
                value={formatDateLabel(draftMeta.dateKey, locale)}
                onPress={() => setOpenMetaPicker('date')}
                accessibilityLabel={t('meals.date')}
              />
            </Field>
            <Field>
              <Text $variant="caption" $color="textSecondary">
                {t('meals.time')}
              </Text>
              <PickerField
                value={timeLabel}
                onPress={() => setOpenMetaPicker('time')}
                accessibilityLabel={t('meals.time')}
              />
            </Field>
          </>
        )}

        {step === 1 && (
          <>
            <View style={{ margin: 16, alignSelf: 'center' }}>
              <ActionButton $primary onPress={() => setScanVisible(true)}>
                <Text $variant="caption">{t('meals.scanProduct')}</Text>
              </ActionButton>
            </View>
            {draftItems.map((item) => (
              <ItemRow key={item.id}>
                <Text $variant="body">
                  {t('meals.itemLine', {
                    name: item.productName,
                    quantity: item.quantity,
                    unit: item.unitLabel,
                    carbs: formatDecimal(item.carbs),
                  })}
                </Text>
                <Pressable onPress={() => removeDraftItem(item.id)}>
                  <Text $color="error">×</Text>
                </Pressable>
              </ItemRow>
            ))}
          </>
        )}

        {step === 2 && (
          <>
            {draftItems.map((item) => (
              <ItemRow key={item.id}>
                <Text $variant="body">{item.productName}</Text>
                <Text $variant="caption" $color="accent">
                  {formatDecimal(item.carbs)} g
                </Text>
              </ItemRow>
            ))}
            <Text $variant="title" $color="accent" style={{ textAlign: 'center', marginTop: 24 }}>
              {t('meals.mealTotal')}: {formatDecimal(draftTotal)} g
            </Text>
            <View style={{ margin: 24, alignSelf: 'center' }}>
              <ActionButton $primary onPress={handleSave}>
                <Text $variant="caption">{t('meals.saveMeal')}</Text>
              </ActionButton>
            </View>
          </>
        )}
      </ScrollView>

      <NavRow>
        {step > 0 ? (
          <ActionButton onPress={() => setStep(step - 1)}>
            <Text $variant="caption">{t('common.previous')}</Text>
          </ActionButton>
        ) : (
          <View />
        )}
        {step < 2 && (
          <ActionButton $primary onPress={() => setStep(step + 1)}>
            <Text $variant="caption">{t('common.next')}</Text>
          </ActionButton>
        )}
      </NavRow>

      <ScanMealModal
        visible={scanVisible}
        onClose={() => setScanVisible(false)}
        onProductScanned={setPickerProduct}
      />
      <QuantityPickerModal
        visible={pickerProduct !== null}
        product={pickerProduct}
        onClose={() => setPickerProduct(null)}
        onConfirm={(item) => {
          addDraftItem(item);
          setPickerProduct(null);
        }}
      />
      <MealMetaPickerSheet
        field={openMetaPicker}
        draftMeta={draftMeta}
        onChange={setDraftMeta}
        onClose={() => setOpenMetaPicker(null)}
      />
    </Screen>
  );
};
