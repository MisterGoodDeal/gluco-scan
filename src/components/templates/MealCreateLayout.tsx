import { BlurTargetView, BlurView } from 'expo-blur';
import { router, useLocalSearchParams } from 'expo-router';
import { Card, Tabs, useThemeColor } from 'heroui-native';
import { type FC, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { ProgressStep, ProgressStepperBar, ProgressSteps } from '@/components/meal-progress-steps';
import { FONT_FAMILY } from '@/constants/typography';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FaIcon } from '@/components/atoms/FaIcon';
import { BackgroundGradient } from '@/components/atoms/BackgroundGradient';
import { BlurScreenFooter } from '@/components/organisms/BlurScreenFooter';
import { TutorialMealCreateBanner } from '@/components/organisms/TutorialMealCreateBanner';
import { MealCalendarPicker } from '@/components/organisms/MealCalendarPicker';
import { MealTimePickerSheet } from '@/components/organisms/MealTimePickerSheet';
import { ProductSpotlightSearch } from '@/components/organisms/ProductSpotlightSearch';
import { QuantityPickerModal } from '@/components/organisms/QuantityPickerModal';
import { ScannerView } from '@/components/organisms/ScannerView';
import { AppButton } from '@/components/ui/AppButton';
import { AppPressable } from '@/components/ui/AppPressable';
import { useAppToast } from '@/components/ui/useAppToast';
import {
  persistOffProduct,
  useMealProductScan,
  type MealScanResult,
} from '@/hooks/useMealProductScan';
import { getCurrentLocale } from '@/i18n';
import { productRepository } from '@/repositories/product.repository';
import { useSettingsStore } from '@/store/settings.store';
import { useMealStore, type MealDraftItem } from '@/store/meal.store';
import { useTutorialStore } from '@/store/tutorial.store';
import { TutorialStatus } from '@/types/tutorial';
import type { Product } from '@/types/product';
import { combineDateAndTime, formatTimeLabel } from '@/utils/date';
import { generateId } from '@/utils/id';
import { formatDecimal } from '@/utils/format';
import { MealItemConversionLine } from '@/components/molecules/MealItemConversionLine';
import { getMealTypeLabelKey } from '@/utils/mealType';
import { MEAL_TYPES, MealType } from '@/types/mealType';
import { useBlurSettings } from '@/hooks/useBlurSettings';
import { triggerImpactLight } from '@/utils/haptics';
import { hp, topScreenSpace } from '@/utils/screen';

export const MealCreateLayout: FC = () => {
  const { mealId } = useLocalSearchParams<{ mealId?: string }>();
  const isEditing = Boolean(mealId);
  const { t } = useTranslation();
  const toast = useAppToast();
  const [mutedColor, dangerColor, accentColor, accentForeground, borderColor, foregroundColor] =
    useThemeColor(['muted', 'danger', 'accent', 'accent-foreground', 'border', 'foreground']);
  const step = useMealStore((s) => s.step);
  const setStep = useMealStore((s) => s.setStep);
  const draftMeta = useMealStore((s) => s.draftMeta);
  const setDraftMeta = useMealStore((s) => s.setDraftMeta);
  const draftItems = useMealStore((s) => s.draftItems);
  const removeDraftItem = useMealStore((s) => s.removeDraftItem);
  const addDraftItem = useMealStore((s) => s.addDraftItem);
  const updateDraftItem = useMealStore((s) => s.updateDraftItem);
  const beginEditMeal = useMealStore((s) => s.beginEditMeal);
  const resetDraft = useMealStore((s) => s.resetDraft);
  const saveMeal = useMealStore((s) => s.saveMeal);
  const setMealCreateValidated = useTutorialStore((s) => s.setMealCreateValidated);
  const tutorialStatus = useTutorialStore((s) => s.status);
  const tutorialNextStep = useTutorialStore((s) => s.nextStep);
  const getTutorialStepId = useTutorialStore((s) => s.getCurrentStepId);
  const hydrateSettings = useSettingsStore((s) => s.hydrate);
  const insets = useSafeAreaInsets();

  const showTutorialBanner =
    !isEditing &&
    tutorialStatus === TutorialStatus.RUNNING &&
    getTutorialStepId() === 'meal-create';
  const navBottomInset = insets.bottom + 8;
  const blur = useBlurSettings();
  const chromeBlurIntensity = Math.round(blur.intensity * 0.5);
  const chromeContentGap = 24;
  const mealCreateHeaderEstimate = topScreenSpace + 132;
  const mealCreateFooterEstimate = 64;
  const blurTargetRef = useRef<View>(null);
  const [headerHeight, setHeaderHeight] = useState(mealCreateHeaderEstimate);
  const [footerHeight, setFooterHeight] = useState(mealCreateFooterEstimate);
  const [pickerProduct, setPickerProduct] = useState<Product | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [pendingOffScan, setPendingOffScan] = useState<MealScanResult | null>(null);
  const [searchVisible, setSearchVisible] = useState(false);
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const locale = getCurrentLocale();
  const { handleScan, isLoading, error, warning, clearMessages } = useMealProductScan();

  const scannerActive = step === 1 && pickerProduct === null && !searchVisible;

  const stepLabels = useMemo(
    () => [t('meals.stepInfo'), t('meals.stepFoods'), t('meals.stepSummary')],
    [t],
  );
  const mealTypeOptions = useMemo(
    () =>
      MEAL_TYPES.map((type) => ({
        value: type,
        label: t(getMealTypeLabelKey(type)),
      })),
    [t],
  );
  const timeLabel = formatTimeLabel(
    combineDateAndTime(draftMeta.dateKey, draftMeta.hours, draftMeta.minutes),
    locale,
  );

  useEffect(() => {
    if (error) {
      toast.error(error, { haptic: false });
      clearMessages();
    } else if (warning) {
      toast.warning(warning, { haptic: false });
      clearMessages();
    }
  }, [error, warning, toast, clearMessages]);

  const openProductPicker = (result: MealScanResult) => {
    if (result.kind === 'existing') {
      setPendingOffScan(null);
      setPickerProduct(result.product);
      return;
    }
    setPendingOffScan(result);
    setPickerProduct({
      id: '',
      eans: [result.off.ean],
      name: result.off.name,
      carbsPer100g: result.off.carbsPer100g,
      imageUrl: result.off.imageUrl ?? null,
      tags: result.off.tags,
      customUnits: [],
    });
  };

  const closeProductPicker = () => {
    setPickerProduct(null);
    setPendingOffScan(null);
    setEditingItemId(null);
  };

  const pickerInitialItem =
    editingItemId != null
      ? (draftItems.find((item) => item.id === editingItemId) ?? null)
      : null;

  useEffect(() => {
    if (mealId) {
      void beginEditMeal(mealId).then((ok) => {
        if (!ok) router.back();
      });
      return () => resetDraft();
    }
    resetDraft();
    return () => resetDraft();
  }, [mealId, beginEditMeal, resetDraft]);

  useEffect(() => {
    void hydrateSettings();
  }, [hydrateSettings]);

  const draftTotal = draftItems.reduce((sum, item) => sum + item.carbs, 0);
  const canGoNext = step !== 1 || draftItems.length > 0;

  const progressStepScrollProps = useMemo(
    () => ({
      showsVerticalScrollIndicator: false as const,
      keyboardShouldPersistTaps: 'handled' as const,
      contentContainerStyle: {
        paddingTop: chromeContentGap,
        paddingBottom: chromeContentGap + 8,
        paddingHorizontal: 0,
      },
    }),
    [chromeContentGap],
  );

  const stepperVisualTheme = useMemo(
    () => ({
      activeStepIconBorderColor: accentColor,
      activeStepIconColor: 'transparent',
      activeStepNumColor: accentColor,
      completedStepIconColor: accentColor,
      completedStepNumColor: accentForeground,
      completedCheckColor: accentForeground,
      progressBarColor: borderColor,
      completedProgressBarColor: accentColor,
      disabledStepIconColor: borderColor,
      labelColor: mutedColor,
      activeLabelColor: foregroundColor,
      completedLabelColor: foregroundColor,
      labelFontFamily: FONT_FAMILY.medium,
      labelFontSize: 13,
      activeLabelFontSize: 13,
    }),
    [accentColor, accentForeground, borderColor, foregroundColor, mutedColor],
  );

  const onBarcodeScan = async (ean: string) => {
    const result = await handleScan(ean);
    if (result) openProductPicker(result);
  };

  const openEditItem = async (item: MealDraftItem) => {
    const product = await productRepository.getById(item.productId);
    if (!product) return;
    setEditingItemId(item.id);
    setPendingOffScan(null);
    setPickerProduct(product);
  };

  const handleSave = async () => {
    if (draftItems.length === 0) {
      toast.warning(t('meals.noItems'));
      return;
    }
    try {
      await saveMeal();
      toast.mealSaved({
        isEditing,
        mealType: t(getMealTypeLabelKey(draftMeta.type)),
        carbs: draftTotal,
      });
    } catch {
      toast.error(t('meals.saveError'));
      return;
    }
    if (!isEditing) {
      setMealCreateValidated(true);
      if (tutorialStatus === TutorialStatus.RUNNING && getTutorialStepId() === 'meal-create') {
        tutorialNextStep();
      }
    }
    router.back();
  };

  const renderDraftItem = (item: MealDraftItem, isLast: boolean) => (
    <View
      key={item.id}
      className={`flex-row items-center justify-between py-2 ${
        isLast ? '' : 'border-b border-separator'
      }`}>
      <AppPressable
        className="flex-1 mr-2 py-1 rounded-lg"
        accessibilityRole="button"
        accessibilityLabel={t('meals.editItemA11y', { name: item.productName })}
        onPress={() => void openEditItem(item)}>
        <MealItemConversionLine
          item={{
            ...item,
            productName: item.productName,
          }}
          product={{ tags: item.productTags, customCookingFactor: null }}
        />
      </AppPressable>
      <AppPressable onPress={() => removeDraftItem(item.id)} hitSlop={8}>
        <FaIcon name="xmark" size={18} color={dangerColor} />
      </AppPressable>
    </View>
  );

  return (
    <View className="flex-1 bg-background">
      <BackgroundGradient />
      <BlurTargetView ref={blurTargetRef} style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            paddingTop: headerHeight,
            paddingBottom: footerHeight,
          }}>
          <ProgressSteps activeStep={step} {...stepperVisualTheme} hideStepper>
        <ProgressStep
          label={t('meals.stepInfo')}
          removeBtnRow
          scrollable
          scrollViewProps={progressStepScrollProps}>
          <Card className="gap-4 p-4">
            <View className="gap-1.5">
              <Text className="text-foreground text-sm font-medium">{t('meals.mealType')}</Text>
              <Tabs
                value={draftMeta.type}
                onValueChange={(value) => {
                  triggerImpactLight();
                  setDraftMeta({ type: value as MealType });
                }}
                variant="primary">
                <Tabs.List className="w-full self-stretch">
                  <Tabs.ScrollView scrollAlign="center" contentContainerClassName="gap-1">
                    <Tabs.Indicator />
                    {mealTypeOptions.map((option) => (
                      <Tabs.Trigger key={option.value} value={option.value}>
                        <Tabs.Label>{option.label}</Tabs.Label>
                      </Tabs.Trigger>
                    ))}
                  </Tabs.ScrollView>
                </Tabs.List>
              </Tabs>
            </View>
            <View className="gap-1.5">
              <Text className="text-foreground text-sm font-medium">{t('meals.date')}</Text>
              <MealCalendarPicker
                selectedDate={draftMeta.dateKey}
                onSelectDate={(dateKey) => setDraftMeta({ dateKey })}
                showDayCarbs={false}
                containerHeight={280}
              />
            </View>
            <View className="gap-1.5">
              <Text className="text-foreground text-sm font-medium">{t('meals.time')}</Text>
              <AppPressable
                className="min-h-12 flex-row items-center justify-between gap-3 px-3 rounded-2xl bg-surface border border-border"
                onPress={() => setTimePickerOpen(true)}
                accessibilityRole="button"
                accessibilityLabel={t('meals.time')}>
                <Text className="text-foreground text-base tabular-nums">{timeLabel}</Text>
                <FaIcon name="chevron-right" size={14} color={mutedColor} />
              </AppPressable>
            </View>
          </Card>
        </ProgressStep>

        <ProgressStep
          label={t('meals.stepFoods')}
          removeBtnRow
          scrollable
          scrollViewProps={progressStepScrollProps}>
          <View className="rounded-3xl overflow-hidden" style={{ height: hp('30%') }}>
            <ScannerView
              fill
              onScan={onBarcodeScan}
              isLoadingProduct={isLoading}
              scanError={null}
              scanWarning={null}
              scanSuccessFlash={false}
              isScanning={!isLoading && scannerActive}
              enabled={scannerActive}
              onClearError={clearMessages}
            />
          </View>

          <AppPressable
            className="mt-4 flex-row items-center gap-2 rounded-2xl border border-border bg-surface p-4"
            onPress={() => setSearchVisible(true)}
            accessibilityLabel={t('meals.searchProduct')}>
            <FaIcon name="magnifying-glass" size={18} color={mutedColor} />
            <Text className="flex-1 text-muted text-base">
              {t('meals.searchSpotlightPlaceholder')}
            </Text>
          </AppPressable>

          <View className="mt-4 gap-2">
            {draftItems.length > 0 ? (
              <Text className="text-muted text-sm">{t('meals.editItemHint')}</Text>
            ) : null}
            {draftItems.length === 0 ? (
              <Text className="text-muted text-sm">{t('scanner.scanProduct')}</Text>
            ) : (
              draftItems.map((item, index) =>
                renderDraftItem(item, index === draftItems.length - 1),
              )
            )}
          </View>
        </ProgressStep>

        <ProgressStep
          label={t('meals.stepSummary')}
          removeBtnRow
          scrollable
          scrollViewProps={progressStepScrollProps}>
          {draftItems.map((item, index) => (
            <View key={item.id}>{renderDraftItem(item, index === draftItems.length - 1)}</View>
          ))}
          <Text className="text-accent text-2xl font-bold text-center mt-6">
            {t('meals.mealTotal')}: {formatDecimal(draftTotal)} g
          </Text>
          <View className="mt-6 self-center">
            <AppButton variant="primary" onPress={() => void handleSave()}>
              {t('meals.saveMeal')}
            </AppButton>
          </View>
        </ProgressStep>
          </ProgressSteps>
        </View>

        <View
          className="absolute top-0 left-0 right-0 z-10"
          onLayout={(event) => {
            setHeaderHeight(event.nativeEvent.layout.height);
          }}>
          <BlurView
            blurTarget={blurTargetRef}
            intensity={chromeBlurIntensity}
            tint={blur.tint}
            blurMethod={blur.androidMethod}
            style={{
              borderBottomWidth: 1,
              borderBottomColor: borderColor,
              overflow: 'hidden',
            }}>
            <View className="px-4 pb-2" style={{ paddingTop: topScreenSpace }}>
              <View className="flex-row items-center justify-between pb-1">
                <AppPressable
                  onPress={() => {
                    resetDraft();
                    router.back();
                  }}>
                  <Text className="text-accent text-base">{t('common.cancel')}</Text>
                </AppPressable>
                <Text className="text-foreground text-lg font-bold">
                  {isEditing ? t('meals.editTitle') : t('meals.createTitle')}
                </Text>
                <View className="w-[60px]" />
              </View>
              <ProgressStepperBar
                {...stepperVisualTheme}
                activeStep={step}
                labels={stepLabels}
                marginBottom={0}
              />
            </View>
          </BlurView>
        </View>

        <BlurScreenFooter
          blurTarget={blurTargetRef}
          intensity={chromeBlurIntensity}
          onLayoutHeight={setFooterHeight}>
          <View
            className="flex-row items-center justify-between gap-3 px-4 py-2"
            style={{ paddingBottom: navBottomInset }}>
            {step > 0 ? (
              <AppButton size="sm" variant="secondary" onPress={() => setStep(step - 1)}>
                {t('common.previous')}
              </AppButton>
            ) : (
              <View />
            )}
            {step < 2 ? (
              <AppButton
                size="sm"
                variant="primary"
                onPress={() => setStep(step + 1)}
                isDisabled={!canGoNext}>
                {t('common.next')}
              </AppButton>
            ) : (
              <View />
            )}
          </View>
        </BlurScreenFooter>
      </BlurTargetView>

      {showTutorialBanner ? <TutorialMealCreateBanner /> : null}

      <QuantityPickerModal
        visible={pickerProduct !== null}
        product={pickerProduct}
        initialItem={pickerInitialItem}
        onClose={closeProductPicker}
        onConfirm={async (payload) => {
          const product =
            pendingOffScan?.kind === 'off'
              ? await persistOffProduct(pendingOffScan.off)
              : pickerProduct;
          if (!product) return;

          if (editingItemId) {
            const existing = draftItems.find((item) => item.id === editingItemId);
            if (!existing) return;
            updateDraftItem(editingItemId, {
              ...existing,
              productId: product.id,
              ...payload,
            });
          } else {
            addDraftItem({
              id: generateId(),
              productId: product.id,
              ...payload,
            });
          }
          closeProductPicker();
        }}
      />
      <ProductSpotlightSearch
        visible={searchVisible}
        onClose={() => setSearchVisible(false)}
        onSelect={(product) => {
          setPendingOffScan(null);
          setPickerProduct(product);
        }}
      />
      <MealTimePickerSheet
        isOpen={timePickerOpen}
        hours={draftMeta.hours}
        minutes={draftMeta.minutes}
        onClose={() => setTimePickerOpen(false)}
        onTimeChange={(hours, minutes) => setDraftMeta({ hours, minutes })}
      />
    </View>
  );
};
