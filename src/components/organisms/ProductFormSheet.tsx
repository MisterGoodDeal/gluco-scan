import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { SymbolView } from 'expo-symbols';
import { type ComponentProps, type FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Pressable } from 'react-native';
import styled, { useTheme } from 'styled-components/native';

import { ButtonIcon } from '@/components/atoms/ButtonIcon';
import { InputNumber } from '@/components/atoms/InputNumber';
import { ProductImage } from '@/components/atoms/ProductImage';
import { SearchInput } from '@/components/atoms/SearchInput';
import { Text } from '@/components/atoms/Text';
import { ProductEanListEditor } from '@/components/molecules/ProductEanListEditor';
import { ProductUnitFormModal } from '@/components/organisms/ProductUnitFormModal';
import { TagSelector } from '@/components/molecules/TagSelector';
import { TagChipList } from '@/components/molecules/tag-chip/TagChipList';
import { productEanRepository } from '@/repositories/productEan.repository';
import { productUnitRepository } from '@/repositories/productUnit.repository';
import { getErrorMessage } from '@/services/errors';
import {
  fetchOffPartialByEAN,
  type PartialOffProduct,
} from '@/services/openFoodFacts.service';
import { useProductStore } from '@/store/product.store';
import type { Product } from '@/types/product';
import type { ProductTag } from '@/types/productTag';
import type { ProductUnit } from '@/types/productUnit';
import { useMassDisplay } from '@/hooks/useMassDisplay';
import { getBottomSheetProps } from '@/components/navigation/bottomSheet';
import { useTutorialStore } from '@/store/tutorial.store';
import { TutorialStatus } from '@/types/tutorial';
import { getTutorialInlineStepIndex } from '@/components/organisms/TutorialInlineBanner';
import { listRowDivider } from '@/styles/listRow';
import {
  deleteLocalProductImage,
  deleteLocalProductImageById,
  isLocalProductImage,
  isRemoteProductImage,
  addProductPhoto,
  requestProductCameraPermission,
  requestProductPhotoLibraryPermission,
  type ProductPhotoSource,
} from '@/services/productImage.service';
import { isValidEan, parseManualCarbs } from '@/utils/ean';
import { convertRawToCooked } from '@/utils/cooking/convertRawToCooked';
import { getCookingFactor } from '@/utils/cooking/getCookingFactor';
import { hasCookingConversion } from '@/utils/cooking/hasCookingConversion';
import { useCookingConversionStore } from '@/store/cookingConversion.store';
import { generateId } from '@/utils/id';
import { triggerNotificationError, triggerNotificationSuccess } from '@/utils/haptics';

type ProductFormSheetProps = {
  visible: boolean;
  product: Product | null;
  onClose: () => void;
};

const SheetHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md}px ${({ theme }) => theme.spacing.lg}px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.glass.border};
`;

const Field = styled.View`
  gap: ${({ theme }) => theme.spacing.xs}px;
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;

const InputRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const InputWrap = styled.View`
  flex: 1;
`;

const PhotoRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md}px;
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const PhotoActions = styled.View`
  flex: 1;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const PhotoButton = styled(Pressable)`
  align-self: flex-start;
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme }) => theme.colors.accentMuted};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.glass.border};
`;

const UnitsSection = styled.View`
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;

const SectionTitleRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const UnitRow = styled.View<{ $isLast?: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.sm}px 0;
  ${listRowDivider}
`;

const UnitInfo = styled(Pressable)`
  flex: 1;
  padding-right: ${({ theme }) => theme.spacing.sm}px;
`;

const AddUnitButton = styled.Pressable`
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme }) => theme.colors.accentMuted};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.glass.border};
`;

const FooterActions = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-top: ${({ theme }) => theme.spacing.lg}px;
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const ActionButton = styled.Pressable<{ $primary?: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.lg}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme, $primary }) =>
    $primary ? theme.colors.accent : theme.colors.glass.background};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.glass.border};
`;

export const ProductFormSheet: FC<ProductFormSheetProps> = ({
  visible,
  product,
  onClose,
}) => {
  const { t } = useTranslation();
  const { formatEquivalentMass } = useMassDisplay();
  const theme = useTheme();
  const snapPoints = useMemo(() => ['88%'], []);
  const tutorialStatus = useTutorialStore((s) => s.status);
  const tutorialStep = useTutorialStore((s) => s.currentStep);
  const productFormStepIndex = getTutorialInlineStepIndex('product-form');
  const showTutorialBanner =
    visible &&
    tutorialStatus === TutorialStatus.RUNNING &&
    tutorialStep === productFormStepIndex;

  const create = useProductStore((s) => s.create);
  const update = useProductStore((s) => s.update);

  const [eans, setEans] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [carbsText, setCarbsText] = useState('');
  const [units, setUnits] = useState<ProductUnit[]>([]);
  const [tags, setTags] = useState<ProductTag[]>([]);
  const [tagsTouched, setTagsTouched] = useState(false);
  const [cookingFactorText, setCookingFactorText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const userConversions = useCookingConversionStore((s) => s.conversions);

  const showError = useCallback((message: string) => {
    setError(message);
    triggerNotificationError();
  }, []);
  const [isSaving, setIsSaving] = useState(false);
  const [isLookupLoading, setIsLookupLoading] = useState(false);

  const [unitModalVisible, setUnitModalVisible] = useState(false);
  const [editingUnit, setEditingUnit] = useState<ProductUnit | null>(null);
  const draftProductIdRef = useRef<string | null>(null);

  const getFormProductId = useCallback(
    () => product?.id ?? (draftProductIdRef.current ??= generateId()),
    [product?.id],
  );

  const renderBackdrop = useCallback(
    (props: ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
    ),
    [],
  );

  useEffect(() => {
    if (!visible) {
      draftProductIdRef.current = null;
      return;
    }
    setEans(product?.eans ?? []);
    setName(product?.name ?? '');
    setImageUrl(product?.imageUrl ?? null);
    setCarbsText(
      product?.carbsPer100g != null ? String(product.carbsPer100g).replace('.', ',') : '',
    );
    setUnits(product?.customUnits ?? []);
    setTags(product?.tags ?? []);
    setTagsTouched(false);
    setCookingFactorText(
      product?.customCookingFactor != null ? String(product.customCookingFactor).replace('.', ',') : '',
    );
    setError(null);
    setUnitModalVisible(false);
    setEditingUnit(null);
  }, [visible, product]);

  const handleDismiss = useCallback(() => {
    if (!product) {
      const draftId = draftProductIdRef.current;
      if (draftId) deleteLocalProductImageById(draftId);
    }
    onClose();
  }, [onClose, product]);

  const applyOffPartial = useCallback((partial: PartialOffProduct) => {
    if (partial.name) setName(partial.name);
    if (partial.carbsPer100g != null) {
      setCarbsText(String(partial.carbsPer100g).replace('.', ','));
    }
    if (partial.imageUrl) {
      setImageUrl((current) => {
        if (current && isLocalProductImage(current)) {
          deleteLocalProductImage(current);
        }
        return partial.imageUrl!;
      });
    }
    if (!tagsTouched && partial.tags && partial.tags.length > 0) {
      setTags(partial.tags);
    }
  }, [tagsTouched]);

  const applyPickedPhoto = useCallback(
    (path: string) => {
      setImageUrl((current) => {
        if (current && isLocalProductImage(current)) {
          deleteLocalProductImage(current);
        }
        return path;
      });
      triggerNotificationSuccess();
    },
    [],
  );

  const pickPhotoFromSource = useCallback(
    async (source: ProductPhotoSource) => {
      const granted =
        source === 'camera'
          ? await requestProductCameraPermission()
          : await requestProductPhotoLibraryPermission();
      if (!granted) {
        showError(
          source === 'camera'
            ? t('products.photoCameraPermissionDenied')
            : t('products.photoPermissionDenied'),
        );
        return;
      }
      const path = await addProductPhoto(getFormProductId(), source);
      if (!path) return;
      applyPickedPhoto(path);
    },
    [applyPickedPhoto, getFormProductId, showError, t],
  );

  const handlePickPhoto = useCallback(() => {
    Alert.alert(t('products.photoSourceTitle'), undefined, [
      {
        text: t('products.photoFromCamera'),
        onPress: () => void pickPhotoFromSource('camera'),
      },
      {
        text: t('products.photoFromGallery'),
        onPress: () => void pickPhotoFromSource('library'),
      },
      { text: t('common.cancel'), style: 'cancel' },
    ]);
  }, [pickPhotoFromSource, t]);

  const handleRemovePhoto = useCallback(() => {
    setImageUrl((current) => {
      if (current && isLocalProductImage(current)) {
        deleteLocalProductImage(current);
      }
      return null;
    });
  }, []);

  const fetchFromOff = useCallback(
    async (ean: string): Promise<boolean> => {
      setIsLookupLoading(true);
      setError(null);
      try {
        const partial = await fetchOffPartialByEAN(ean);
        const hasData =
          Boolean(partial.name) ||
          partial.carbsPer100g != null ||
          Boolean(partial.imageUrl);
        if (!hasData) {
          showError(t('products.refreshNoData'));
          return false;
        }
        applyOffPartial(partial);
        triggerNotificationSuccess();
        return true;
      } catch (err) {
        showError(getErrorMessage(err));
        return false;
      } finally {
        setIsLookupLoading(false);
      }
    },
    [applyOffPartial, showError, t],
  );

  const handleLookup = async (scannedEan: string) => {
    await fetchFromOff(scannedEan);
  };

  const handleRefreshFromOff = async () => {
    const ean = eans.find((code) => isValidEan(code));
    if (!ean) {
      showError(t('products.refreshNoEan'));
      return;
    }
    await fetchFromOff(ean);
  };

  const canRefreshFromOff = eans.some((code) => isValidEan(code));

  const previewProduct = useMemo(
    (): Product => ({
      id: getFormProductId(),
      eans,
      name,
      carbsPer100g: parseManualCarbs(carbsText) ?? 0,
      imageUrl,
      tags,
      customCookingFactor: parseManualCarbs(cookingFactorText),
      customUnits: units,
    }),
    [carbsText, cookingFactorText, eans, getFormProductId, imageUrl, name, tags, units],
  );

  const showCookingSection = hasCookingConversion(previewProduct, userConversions);
  const resolvedCookingFactor = getCookingFactor(previewProduct, userConversions);

  const openAddUnit = () => {
    setEditingUnit(null);
    setUnitModalVisible(true);
  };

  const openEditUnit = (unit: ProductUnit) => {
    setEditingUnit(unit);
    setUnitModalVisible(true);
  };

  const handleUnitSave = (saved: ProductUnit) => {
    setUnits((prev) => {
      const exists = prev.some((u) => u.id === saved.id);
      if (exists) {
        return prev.map((u) => (u.id === saved.id ? saved : u));
      }
      return [...prev, saved];
    });
    setEditingUnit(null);
  };

  const removeUnit = (id: string) => {
    setUnits((prev) => prev.filter((u) => u.id !== id));
  };

  const handleSave = async () => {
    const trimmedName = name.trim();
    const carbs = parseManualCarbs(carbsText);
    if (!trimmedName) {
      showError(t('modal.nameRequired'));
      return;
    }
    if (carbs === null) {
      showError(t('modal.invalidCarbs'));
      return;
    }
    for (const code of eans) {
      if (!isValidEan(code)) {
        showError(t('modal.invalidEan'));
        return;
      }
    }
    const conflict = await productEanRepository.findConflicts(eans, product?.id);
    if (conflict) {
      showError(t('products.eanTaken', { ean: conflict }));
      return;
    }

    setIsSaving(true);
    const productId = getFormProductId();
    try {
      if (product) {
        const updated: Product = {
          ...product,
          eans,
          name: trimmedName,
          carbsPer100g: carbs,
          imageUrl,
          tags,
          customCookingFactor: parseManualCarbs(cookingFactorText),
          customUnits: units,
        };
        await update(updated);
        const existingIds = new Set(product.customUnits.map((u) => u.id));
        for (const unit of units) {
          if (existingIds.has(unit.id)) {
            await productUnitRepository.update(unit, product.id);
          } else {
            await productUnitRepository.create(product.id, unit);
          }
        }
        for (const old of product.customUnits) {
          if (!units.find((u) => u.id === old.id)) {
            await productUnitRepository.delete(old.id);
          }
        }
      } else {
        const created = await create({
          id: productId,
          name: trimmedName,
          carbsPer100g: carbs,
          eans,
          imageUrl,
          tags,
          customCookingFactor: parseManualCarbs(cookingFactorText),
        });
        for (const unit of units) {
          await productUnitRepository.create(created.id, unit);
        }
      }
      triggerNotificationSuccess();
      onClose();
    } catch (err) {
      showError(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  if (!visible) return null;

  return (
    <>
      <BottomSheet
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose={!showTutorialBanner}
        onClose={handleDismiss}
        backdropComponent={renderBackdrop}
        {...getBottomSheetProps(theme)}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize">
        <BottomSheetScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingHorizontal: theme.spacing.lg,
          }}>
          <SheetHeader>
            <Text $variant="subtitle">
              {product ? t('products.editProduct') : t('products.addProduct')}
            </Text>
            <Pressable onPress={handleDismiss} hitSlop={8}>
              <Text $variant="body" $color="accent">
                {t('common.cancel')}
              </Text>
            </Pressable>
          </SheetHeader>

          <Field>
            <Text $variant="caption" $color="textSecondary">
              {t('modal.eanLabel')}
            </Text>
            <ProductEanListEditor eans={eans} onChange={setEans} onScan={handleLookup} />
          </Field>

          <Field>
            <Text $variant="caption" $color="textSecondary">
              {t('modal.nameLabel')}
            </Text>
            <InputRow>
              <InputWrap>
                <SearchInput
                  value={name}
                  onChangeText={setName}
                  placeholder={t('modal.namePlaceholder')}
                  flex
                />
              </InputWrap>
              <ButtonIcon
                onPress={() => {
                  if (!canRefreshFromOff || isLookupLoading) return;
                  void handleRefreshFromOff();
                }}
                accessibilityLabel={t('products.refreshFromOffA11y')}
                accessibilityState={{ disabled: !canRefreshFromOff || isLookupLoading }}>
                {isLookupLoading ? (
                  <ActivityIndicator color={theme.colors.accent} size="small" />
                ) : (
                  <SymbolView
                    name={{ ios: 'arrow.clockwise', android: 'refresh' }}
                    size={18}
                    tintColor={
                      canRefreshFromOff ? theme.colors.accent : theme.colors.textSecondary
                    }
                  />
                )}
              </ButtonIcon>
            </InputRow>
          </Field>

          <Field>
            <Text $variant="caption" $color="textSecondary">
              {t('modal.carbsLabel')}
            </Text>
            <InputNumber value={carbsText} onChangeText={setCarbsText} />
          </Field>

          <Field>
            <Text $variant="caption" $color="textSecondary">
              {t('products.tagsSection')}
            </Text>
            <TagSelector
              value={tags}
              onChange={(nextTags) => {
                setTagsTouched(true);
                setTags(nextTags);
              }}
            />
          </Field>

          {showCookingSection && resolvedCookingFactor != null ? (
            <Field>
              <Text $variant="caption" $color="textSecondary">
                {t('products.cookingConversion')}
              </Text>
              <TagChipList tags={tags} variant="expanded" />
              <Text $variant="caption" $color="textSecondary" style={{ marginTop: 8 }}>
                {t('products.cookingFactor')}
              </Text>
              <InputNumber value={cookingFactorText} onChangeText={setCookingFactorText} />
              <Text $variant="caption" $color="textSecondary" style={{ marginTop: 8 }}>
                {t('products.cookingConversionPreview', {
                  raw: '100',
                  rawUnit: t('common.gramsUnit'),
                  cooked: String(convertRawToCooked(100, resolvedCookingFactor)).replace('.', ','),
                  cookedUnit: t('common.gramsUnit'),
                })}
              </Text>
            </Field>
          ) : null}

          <Field>
            <Text $variant="caption" $color="textSecondary">
              {t('products.photo')}
            </Text>
            <PhotoRow>
              {imageUrl ? <ProductImage uri={imageUrl} size={64} /> : null}
              <PhotoActions>
                <PhotoButton
                  onPress={handlePickPhoto}
                  accessibilityLabel={imageUrl ? t('products.changePhoto') : t('products.addPhoto')}>
                  <Text $variant="caption" $color="accent">
                    {imageUrl ? t('products.changePhoto') : t('products.addPhoto')}
                  </Text>
                </PhotoButton>
                {imageUrl ? (
                  <PhotoButton
                    onPress={handleRemovePhoto}
                    accessibilityLabel={t('products.removePhotoA11y')}>
                    <Text $variant="caption" $color="error">
                      {t('products.removePhoto')}
                    </Text>
                  </PhotoButton>
                ) : null}
                {imageUrl ? (
                  <Text $variant="caption" $color="textSecondary">
                    {isRemoteProductImage(imageUrl)
                      ? t('products.photoFromOff')
                      : t('products.photoCustom')}
                  </Text>
                ) : null}
              </PhotoActions>
            </PhotoRow>
          </Field>

          <UnitsSection>
            <SectionTitleRow>
              <Text $variant="body">{t('products.customUnits')}</Text>
              <AddUnitButton onPress={openAddUnit} accessibilityLabel={t('products.addUnit')}>
                <Text $variant="caption" $color="accent">
                  {t('products.addUnit')}
                </Text>
              </AddUnitButton>
            </SectionTitleRow>
            {units.length === 0 ? (
              <Text $variant="caption" $color="textSecondary">
                {t('products.noCustomUnits')}
              </Text>
            ) : (
              units.map((unit, index) => (
                <UnitRow key={unit.id} $isLast={index === units.length - 1}>
                  <UnitInfo onPress={() => openEditUnit(unit)}>
                    <Text $variant="caption">
                      1 {unit.abbreviation} = {formatEquivalentMass(unit.equivalentInGrams)} ({unit.name})
                    </Text>
                  </UnitInfo>
                  <Pressable onPress={() => removeUnit(unit.id)} hitSlop={8}>
                    <Text $color="error">×</Text>
                  </Pressable>
                </UnitRow>
              ))
            )}
          </UnitsSection>

          {error && (
            <Text $variant="caption" $color="error" style={{ marginTop: 8 }}>
              {error}
            </Text>
          )}

          <FooterActions>
            <ActionButton onPress={handleDismiss} disabled={isSaving}>
              <Text $variant="caption">{t('common.cancel')}</Text>
            </ActionButton>
            <ActionButton $primary onPress={handleSave} disabled={isSaving}>
              {isSaving ? (
                <ActivityIndicator color={theme.colors.onAccent} size="small" />
              ) : (
                <Text $variant="caption" style={{ color: theme.colors.onAccent }}>
                  {t('common.save')}
                </Text>
              )}
            </ActionButton>
          </FooterActions>
        </BottomSheetScrollView>
      </BottomSheet>

      <ProductUnitFormModal
        visible={unitModalVisible}
        unit={editingUnit}
        onClose={() => {
          setUnitModalVisible(false);
          setEditingUnit(null);
        }}
        onSave={handleUnitSave}
      />
    </>
  );
};
