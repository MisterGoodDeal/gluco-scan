import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { BottomSheet, FieldError, Select, useThemeColor } from 'heroui-native';
import { type FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { InputNumber } from '@/components/atoms/InputNumber';
import { SearchInput } from '@/components/atoms/SearchInput';
import { TagIcon } from '@/components/atoms/TagIcon';
import { AppButton } from '@/components/ui/AppButton';
import { AppPressable } from '@/components/ui/AppPressable';
import { AppSelect } from '@/components/ui/AppSelect';
import type {
  NutritionLabelBasis,
  ParsedNutritionLabel,
} from '@/features/product-ocr/types/ocrDraft';
import {
  buildOcrCookingTags,
  convertCookedCarbsPer100gToRaw,
  OCR_COOKING_TYPE_TAGS,
} from '@/features/product-ocr/utils/ocrCookingBasis';
import { useCookingConversionStore } from '@/store/cookingConversion.store';
import type { ProductTag } from '@/types/productTag';
import { parseManualCarbs } from '@/utils/ean';
import { getCookingFactor } from '@/utils/cooking/getCookingFactor';
import { triggerImpactLight } from '@/utils/haptics';
import { getTagMetadata } from '@/utils/tags/getTagMetadata';

export type OcrReviewContinueValues = {
  name: string;
  /** Always raw-basis carbs for ProductFormSheet. */
  carbsPer100g: number | null;
  tags?: ProductTag[];
};

type OcrLabelReviewSheetProps = {
  visible: boolean;
  imageUri: string | null;
  parsed: ParsedNutritionLabel | null;
  isProcessing: boolean;
  error: string | null;
  onClose: () => void;
  onRetake: () => void;
  onContinue: (values: OcrReviewContinueValues) => void;
};

const formatCarbs = (value: number): string => String(value).replace('.', ',');

export const OcrLabelReviewSheet: FC<OcrLabelReviewSheetProps> = ({
  visible,
  imageUri,
  parsed,
  isProcessing,
  error,
  onClose,
  onRetake,
  onContinue,
}) => {
  const { t } = useTranslation();
  const accentColor = useThemeColor('accent');
  const insets = useSafeAreaInsets();
  const userConversions = useCookingConversionStore((s) => s.conversions);
  const [name, setName] = useState('');
  const [carbsText, setCarbsText] = useState('');
  const [basis, setBasis] = useState<Exclude<NutritionLabelBasis, 'unknown'>>('raw');
  const [cookingType, setCookingType] = useState<ProductTag | null>(null);
  const [rawExpanded, setRawExpanded] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setName(parsed?.name ?? '');
    setCarbsText(
      parsed?.carbsPer100g != null
        ? String(parsed.carbsPer100g).replace('.', ',')
        : '',
    );
    setBasis(parsed?.basis === 'cooked' ? 'cooked' : 'raw');
    setCookingType(null);
    setRawExpanded(false);
  }, [visible, parsed]);

  const cookingOptions = useMemo(
    () =>
      OCR_COOKING_TYPE_TAGS.map((tag) => ({
        value: tag,
        label: t(getTagMetadata(tag).translationKey),
      })),
    [t],
  );

  const selectedCookingOption = useMemo(() => {
    if (!cookingType) return undefined;
    return {
      value: cookingType,
      label: t(getTagMetadata(cookingType).translationKey),
    };
  }, [cookingType, t]);

  const labelCarbs = parseManualCarbs(carbsText);
  const cookingTags = cookingType ? buildOcrCookingTags(cookingType) : [];
  const cookingFactor =
    cookingType != null
      ? getCookingFactor(
          { tags: cookingTags, customCookingFactor: null },
          userConversions,
        )
      : null;

  const savedRawCarbs = useMemo(() => {
    if (labelCarbs == null) return null;
    if (basis === 'raw') return labelCarbs;
    if (cookingType == null) return null;
    return convertCookedCarbsPer100gToRaw(labelCarbs, cookingTags, userConversions);
  }, [basis, cookingTags, cookingType, labelCarbs, userConversions]);

  const handleContinue = () => {
    triggerImpactLight();
    if (savedRawCarbs == null && labelCarbs == null) {
      onContinue({ name: name.trim(), carbsPer100g: null, tags: cookingTags.length ? cookingTags : undefined });
      return;
    }
    if (basis === 'cooked' && (cookingType == null || savedRawCarbs == null)) {
      return;
    }
    onContinue({
      name: name.trim(),
      carbsPer100g: savedRawCarbs ?? labelCarbs,
      tags: cookingTags.length > 0 ? cookingTags : basis === 'raw' ? ['starch'] : undefined,
    });
  };

  const continueDisabled =
    basis === 'cooked' && (cookingType == null || savedRawCarbs == null);

  return (
    <BottomSheet
      isOpen={visible}
      onOpenChange={(open) => {
        if (!open && !isProcessing) onClose();
      }}>
      <BottomSheet.Portal>
        <BottomSheet.Overlay />
        <BottomSheet.Content
          snapPoints={['92%']}
          enableOverDrag={false}
          enableDynamicSizing={false}
          enablePanDownToClose={!isProcessing}
          contentContainerClassName="h-full"
          keyboardBehavior="extend"
          keyboardBlurBehavior="restore"
          android_keyboardInputMode="adjustResize">
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}>
            <BottomSheetScrollView
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingBottom: Math.max(insets.bottom, 16) + 32,
              }}>
            <View className="flex-row items-center justify-between py-4 border-b border-separator">
              <Text className="text-foreground text-lg font-semibold flex-1 pr-2">
                {t('products.ocr.reviewTitle')}
              </Text>
              <AppButton
                variant="tertiary"
                size="sm"
                onPress={onClose}
                isDisabled={isProcessing}>
                {t('common.cancel')}
              </AppButton>
            </View>

            {isProcessing ? (
              <View className="items-center justify-center gap-3 py-16">
                <ActivityIndicator color={accentColor} size="large" />
                <Text className="text-muted text-sm">{t('common.loading')}</Text>
              </View>
            ) : (
              <View className="gap-4 mt-4 pb-2">
                {imageUri ? (
                  <Image
                    source={{ uri: imageUri }}
                    className="w-full h-36 rounded-2xl bg-default"
                    resizeMode="cover"
                    accessibilityLabel={t('products.ocr.reviewTitle')}
                  />
                ) : null}

                {error ? (
                  <FieldError isInvalid={true} className="mt-0">
                    {error}
                  </FieldError>
                ) : null}

                <View className="gap-2">
                  <Text className="text-foreground text-sm font-medium">
                    {t('products.ocr.basisLabel')}
                  </Text>
                  <Text className="text-muted text-xs">{t('products.ocr.basisHint')}</Text>
                  <View className="flex-row gap-2">
                    {(['raw', 'cooked'] as const).map((option) => {
                      const selected = basis === option;
                      return (
                        <AppPressable
                          key={option}
                          onPress={() => setBasis(option)}
                          accessibilityRole="button"
                          accessibilityState={{ selected }}
                          className={`flex-1 items-center rounded-2xl border px-3 py-3 ${
                            selected
                              ? 'border-accent bg-accent/15'
                              : 'border-field-border bg-field'
                          }`}>
                          <Text
                            className={`text-sm font-medium ${
                              selected ? 'text-accent' : 'text-foreground'
                            }`}>
                            {option === 'raw'
                              ? t('products.ocr.basisOptionRaw')
                              : t('products.ocr.basisOptionCooked')}
                          </Text>
                        </AppPressable>
                      );
                    })}
                  </View>
                  {parsed?.sectionHeader ? (
                    <Text className="text-muted text-xs">
                      {t('products.ocr.detectedHeader', { header: parsed.sectionHeader })}
                    </Text>
                  ) : null}
                </View>

                <View>
                  <Text className="text-foreground text-sm font-medium mb-1">
                    {basis === 'cooked'
                      ? t('products.ocr.carbsLabelCooked')
                      : t('products.ocr.carbsLabelRaw')}
                  </Text>
                  <View className="min-h-12 rounded-2xl border border-field-border bg-field px-3 justify-center">
                    <InputNumber
                      value={carbsText}
                      onChangeText={setCarbsText}
                      placeholder="—"
                      align="start"
                      bottomSheet
                    />
                  </View>
                </View>

                <View className="gap-2">
                  <Text className="text-foreground text-sm font-medium">
                    {t('products.ocr.cookingTypeLabel')}
                  </Text>
                  <Text className="text-muted text-xs">
                    {basis === 'cooked'
                      ? t('products.ocr.cookingTypeHintCooked')
                      : t('products.ocr.cookingTypeHintRaw')}
                  </Text>
                  <AppSelect
                    selectionMode="single"
                    value={selectedCookingOption}
                    onValueChange={(next) => {
                      setCookingType((next?.value as ProductTag | undefined) ?? null);
                    }}
                    options={cookingOptions}
                    placeholder={t('products.ocr.cookingTypePlaceholder')}
                    listLabel={t('products.ocr.cookingTypeLabel')}
                    scrollable
                    renderItem={(option, isSelected) => (
                      <>
                        <View className="flex-row items-center gap-2 flex-1">
                          <TagIcon tag={option.value as ProductTag} size={20} />
                          <Select.ItemLabel />
                        </View>
                        {isSelected ? <Select.ItemIndicator /> : null}
                      </>
                    )}
                  />
                </View>

                <View className="rounded-2xl border border-separator bg-default/40 px-3 py-3 gap-1.5">
                  <Text className="text-foreground text-sm font-semibold">
                    {t('products.ocr.summaryTitle')}
                  </Text>
                  {labelCarbs != null ? (
                    <Text className="text-muted text-sm">
                      {t('products.ocr.summaryRead', {
                        value: formatCarbs(labelCarbs),
                        basis:
                          basis === 'cooked'
                            ? t('meals.weighingCooked').toLowerCase()
                            : t('meals.weighingRaw').toLowerCase(),
                      })}
                    </Text>
                  ) : (
                    <Text className="text-muted text-sm">{t('products.ocr.summaryNoValue')}</Text>
                  )}
                  {basis === 'cooked' && cookingType && cookingFactor != null && labelCarbs != null ? (
                    <Text className="text-muted text-sm">
                      {t('products.ocr.summaryConversion', {
                        cooked: formatCarbs(labelCarbs),
                        factor: formatCarbs(cookingFactor),
                        type: t(getTagMetadata(cookingType).translationKey),
                        raw: savedRawCarbs != null ? formatCarbs(savedRawCarbs) : '—',
                      })}
                    </Text>
                  ) : null}
                  {basis === 'cooked' && !cookingType ? (
                    <Text className="text-muted text-sm">
                      {t('products.ocr.summaryPickType')}
                    </Text>
                  ) : null}
                  {savedRawCarbs != null ? (
                    <Text className="text-foreground text-sm font-medium mt-1">
                      {t('products.ocr.summarySaved', {
                        value: formatCarbs(savedRawCarbs),
                      })}
                    </Text>
                  ) : null}
                </View>

                <View>
                  <Text className="text-foreground text-sm font-medium mb-1">
                    {t('products.ocr.nameLabel')}
                  </Text>
                  <View className="min-h-12 rounded-2xl border border-field-border bg-field px-3 justify-center">
                    <SearchInput
                      value={name}
                      onChangeText={setName}
                      placeholder={t('modal.namePlaceholder')}
                      variant="plain"
                      bottomSheet
                    />
                  </View>
                </View>

                {parsed?.rawText ? (
                  <View>
                    <Pressable
                      onPress={() => setRawExpanded((v) => !v)}
                      accessibilityRole="button"
                      accessibilityLabel={t('products.ocr.rawText')}>
                      <Text className="text-accent text-sm font-medium">
                        {t('products.ocr.rawText')}
                      </Text>
                    </Pressable>
                    {rawExpanded ? (
                      <Text className="text-muted text-xs mt-2 leading-5" selectable>
                        {parsed.rawText}
                      </Text>
                    ) : null}
                  </View>
                ) : null}

                <View className="gap-2 mt-2">
                  <AppButton
                    variant="primary"
                    onPress={handleContinue}
                    isDisabled={continueDisabled}>
                    {t('products.ocr.continue')}
                  </AppButton>
                  <AppButton variant="tertiary" onPress={onRetake}>
                    {t('products.ocr.retake')}
                  </AppButton>
                </View>
              </View>
            )}
            </BottomSheetScrollView>
          </KeyboardAvoidingView>
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
};
