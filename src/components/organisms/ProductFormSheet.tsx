import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { BottomSheet, Card, FieldError, useThemeColor } from "heroui-native";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FC,
} from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Alert, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FaIcon } from "@/components/atoms/FaIcon";
import { InputNumber } from "@/components/atoms/InputNumber";
import { ProductImage } from "@/components/atoms/ProductImage";
import { SearchInput } from "@/components/atoms/SearchInput";
import { ProductEanListEditor } from "@/components/molecules/ProductEanListEditor";
import { ProductTagPicker } from "@/components/molecules/ProductTagPicker";
import { TagChipList } from "@/components/molecules/tag-chip/TagChipList";
import { ProductUnitFormModal } from "@/components/organisms/ProductUnitFormModal";
import {
  getTutorialInlineStepIndex,
  TutorialInlineBanner,
} from "@/components/organisms/TutorialInlineBanner";
import { AppButton } from "@/components/ui/AppButton";
import { AppPressable } from "@/components/ui/AppPressable";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useAppToast } from "@/components/ui/useAppToast";
import { ProductStatisticsSection } from "@/features/statistics/components/ProductStatisticsSection";
import { useMassDisplay } from "@/hooks/useMassDisplay";
import { productEanRepository } from "@/repositories/productEan.repository";
import { productUnitRepository } from "@/repositories/productUnit.repository";
import { getErrorMessage } from "@/services/errors";
import {
  fetchOffPartialByEAN,
  type PartialOffProduct,
} from "@/services/openFoodFacts.service";
import {
  addProductPhoto,
  deleteLocalProductImage,
  deleteLocalProductImageById,
  isLocalProductImage,
  isRemoteProductImage,
  requestProductCameraPermission,
  requestProductPhotoLibraryPermission,
  type ProductPhotoSource,
} from "@/services/productImage.service";
import { useCookingConversionStore } from "@/store/cookingConversion.store";
import { useProductStore } from "@/store/product.store";
import { useTutorialStore } from "@/store/tutorial.store";
import type { Product } from "@/types/product";
import type { ProductTag } from "@/types/productTag";
import type { ProductUnit } from "@/types/productUnit";
import { TutorialStatus } from "@/types/tutorial";
import { convertRawToCooked } from "@/utils/cooking/convertRawToCooked";
import { getCookingFactor } from "@/utils/cooking/getCookingFactor";
import { hasCookingConversion } from "@/utils/cooking/hasCookingConversion";
import { isValidEan, parseManualCarbs } from "@/utils/ean";
import {
  triggerNotificationError,
  triggerNotificationSuccess,
} from "@/utils/haptics";
import { generateId } from "@/utils/id";

type ProductFormSheetProps = {
  visible: boolean;
  product: Product | null;
  onClose: () => void;
};

export const ProductFormSheet: FC<ProductFormSheetProps> = ({
  visible,
  product,
  onClose,
}) => {
  const { t } = useTranslation();
  const toast = useAppToast();
  const { formatEquivalentMass } = useMassDisplay();
  const [accentColor, mutedColor, dangerColor, accentForeground] =
    useThemeColor(["accent", "muted", "danger", "accent-foreground"]);
  const insets = useSafeAreaInsets();
  const tutorialStatus = useTutorialStore((s) => s.status);
  const tutorialStep = useTutorialStore((s) => s.currentStep);
  const productFormStepIndex = getTutorialInlineStepIndex("product-form");
  const showTutorialBanner =
    visible &&
    tutorialStatus === TutorialStatus.RUNNING &&
    tutorialStep === productFormStepIndex;

  const isEditing = product != null;
  const sheetTitle = isEditing
    ? t("products.editProduct")
    : t("products.addProduct");

  const create = useProductStore((s) => s.create);
  const update = useProductStore((s) => s.update);
  const remove = useProductStore((s) => s.remove);

  const [eans, setEans] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [carbsText, setCarbsText] = useState("");
  const [units, setUnits] = useState<ProductUnit[]>([]);
  const [tags, setTags] = useState<ProductTag[]>([]);
  const [tagsTouched, setTagsTouched] = useState(false);
  const [cookingFactorText, setCookingFactorText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const userConversions = useCookingConversionStore((s) => s.conversions);

  const showError = useCallback(
    (message: string) => {
      toast.error(message);
    },
    [toast],
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isLookupLoading, setIsLookupLoading] = useState(false);

  const [unitModalVisible, setUnitModalVisible] = useState(false);
  const [editingUnit, setEditingUnit] = useState<ProductUnit | null>(null);
  const [isSheetSuppressed, setIsSheetSuppressed] = useState(false);
  const isSheetSuppressedRef = useRef(false);
  const draftProductIdRef = useRef<string | null>(null);

  const setSheetSuppressed = useCallback((suppressed: boolean) => {
    isSheetSuppressedRef.current = suppressed;
    setIsSheetSuppressed(suppressed);
  }, []);

  const getFormProductId = useCallback(
    () => product?.id ?? (draftProductIdRef.current ??= generateId()),
    [product?.id],
  );

  useEffect(() => {
    if (!visible) {
      draftProductIdRef.current = null;
      isSheetSuppressedRef.current = false;
      setIsSheetSuppressed(false);
      return;
    }
    setEans(product?.eans ?? []);
    setName(product?.name ?? "");
    setImageUrl(product?.imageUrl ?? null);
    setCarbsText(
      product?.carbsPer100g != null
        ? String(product.carbsPer100g).replace(".", ",")
        : "",
    );
    setUnits(product?.customUnits ?? []);
    setTags(product?.tags ?? []);
    setTagsTouched(false);
    setCookingFactorText(
      product?.customCookingFactor != null
        ? String(product.customCookingFactor).replace(".", ",")
        : "",
    );
    setSubmitted(false);
    setDeleteConfirmOpen(false);
    setIsDeleting(false);
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

  const applyOffPartial = useCallback(
    (partial: PartialOffProduct) => {
      if (partial.name) setName(partial.name);
      if (partial.carbsPer100g != null) {
        setCarbsText(String(partial.carbsPer100g).replace(".", ","));
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
    },
    [tagsTouched],
  );

  const applyPickedPhoto = useCallback((path: string) => {
    setImageUrl((current) => {
      if (current && isLocalProductImage(current)) {
        deleteLocalProductImage(current);
      }
      return path;
    });
    triggerNotificationSuccess();
  }, []);

  const pickPhotoFromSource = useCallback(
    async (source: ProductPhotoSource) => {
      try {
        const granted =
          source === "camera"
            ? await requestProductCameraPermission()
            : await requestProductPhotoLibraryPermission();
        if (!granted) {
          showError(
            source === "camera"
              ? t("products.photoCameraPermissionDenied")
              : t("products.photoPermissionDenied"),
          );
          return;
        }
        const path = await addProductPhoto(getFormProductId(), source);
        if (!path) return;
        applyPickedPhoto(path);
      } finally {
        setSheetSuppressed(false);
      }
    },
    [applyPickedPhoto, getFormProductId, setSheetSuppressed, showError, t],
  );

  const handlePickPhoto = useCallback(() => {
    void (async () => {
      setSheetSuppressed(true);
      await new Promise((resolve) => setTimeout(resolve, 350));
      Alert.alert(t("products.photoSourceTitle"), undefined, [
        {
          text: t("products.photoFromCamera"),
          onPress: () => void pickPhotoFromSource("camera"),
        },
        {
          text: t("products.photoFromGallery"),
          onPress: () => void pickPhotoFromSource("library"),
        },
        {
          text: t("common.cancel"),
          style: "cancel",
          onPress: () => setSheetSuppressed(false),
        },
      ]);
    })();
  }, [pickPhotoFromSource, setSheetSuppressed, t]);

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
      try {
        const partial = await fetchOffPartialByEAN(ean);
        const hasData =
          Boolean(partial.name) ||
          partial.carbsPer100g != null ||
          Boolean(partial.imageUrl);
        if (!hasData) {
          showError(t("products.refreshNoData"));
          return false;
        }
        applyOffPartial(partial);
        toast.success(t("products.refreshSuccess"));
        return true;
      } catch (err) {
        showError(getErrorMessage(err));
        return false;
      } finally {
        setIsLookupLoading(false);
      }
    },
    [applyOffPartial, showError, t, toast],
  );

  const handleLookup = async (scannedEan: string) => {
    await fetchFromOff(scannedEan);
  };

  const handleRefreshFromOff = async () => {
    const ean = eans.find((code) => isValidEan(code));
    if (!ean) {
      showError(t("products.refreshNoEan"));
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
    [
      carbsText,
      cookingFactorText,
      eans,
      getFormProductId,
      imageUrl,
      name,
      tags,
      units,
    ],
  );

  const showCookingSection = hasCookingConversion(
    previewProduct,
    userConversions,
  );
  const resolvedCookingFactor = getCookingFactor(
    previewProduct,
    userConversions,
  );

  const nameInvalid = submitted && name.trim().length === 0;
  const carbsInvalid = submitted && parseManualCarbs(carbsText) === null;
  const eansInvalid = submitted && eans.some((code) => !isValidEan(code));

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
    setSubmitted(true);
    const trimmedName = name.trim();
    const carbs = parseManualCarbs(carbsText);
    const hasInvalidEan = eans.some((code) => !isValidEan(code));
    if (!trimmedName || carbs === null || hasInvalidEan) {
      triggerNotificationError();
      return;
    }
    const conflict = await productEanRepository.findConflicts(
      eans,
      product?.id,
    );
    if (conflict) {
      showError(t("products.eanTaken", { ean: conflict }));
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
      handleDismiss();
    } catch (err) {
      showError(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirmed = useCallback(async () => {
    if (!product?.id) return;
    setIsDeleting(true);
    try {
      await remove(product.id);
      triggerNotificationSuccess();
      toast.success(t("products.deleteSuccess"));
      onClose();
    } catch (err) {
      triggerNotificationError();
      showError(getErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  }, [onClose, product?.id, remove, showError, t, toast]);

  return (
    <>
      <BottomSheet
        isOpen={visible && !isSheetSuppressed}
        onOpenChange={(open) => {
          if (!open && !isSheetSuppressedRef.current) {
            handleDismiss();
          }
        }}
      >
        <BottomSheet.Portal>
          <BottomSheet.Overlay />
          <BottomSheet.Content
            snapPoints={["90%"]}
            enableOverDrag={false}
            enableDynamicSizing={false}
            enablePanDownToClose={!showTutorialBanner}
            contentContainerClassName="h-full"
            keyboardBehavior="interactive"
            keyboardBlurBehavior="restore"
            android_keyboardInputMode="adjustResize"
          >
            <BottomSheetScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{
                paddingHorizontal: 24,
                paddingBottom: insets.bottom + 24,
              }}
            >
              <View className="flex-row items-center justify-between py-4 border-b border-separator">
                <Text className="text-foreground text-lg font-semibold">
                  {sheetTitle}
                </Text>
                <AppButton variant="tertiary" size="sm" onPress={handleDismiss}>
                  {t("common.cancel")}
                </AppButton>
              </View>

              <View className="gap-1 mt-4">
                <Text className="text-muted text-sm">
                  {t("modal.eanLabel")}
                </Text>
                <ProductEanListEditor
                  eans={eans}
                  onChange={setEans}
                  onScan={handleLookup}
                />
                <FieldError isInvalid={eansInvalid}>
                  {t("modal.invalidEan")}
                </FieldError>
              </View>

              <View className="gap-1 mt-4">
                <Text className="text-muted text-sm">
                  {t("modal.nameLabel")}
                </Text>
                <View className="flex-row items-center gap-2">
                  <SearchInput
                    value={name}
                    onChangeText={setName}
                    placeholder={t("modal.namePlaceholder")}
                    flex
                  />
                </View>
                <FieldError isInvalid={nameInvalid}>
                  {t("modal.nameRequired")}
                </FieldError>
              </View>

              <View className="gap-1 mt-4">
                <Text className="text-muted text-sm">
                  {t("modal.carbsLabel")}
                </Text>
                <InputNumber value={carbsText} onChangeText={setCarbsText} />
                <FieldError isInvalid={carbsInvalid}>
                  {t("modal.invalidCarbs")}
                </FieldError>
              </View>

              <View className="gap-1 mt-4">
                <Text className="text-muted text-sm">
                  {t("products.tagsSection")}
                </Text>
                <ProductTagPicker
                  value={tags}
                  onChange={(nextTags) => {
                    setTagsTouched(true);
                    setTags(nextTags);
                  }}
                />
              </View>

              {showCookingSection && resolvedCookingFactor != null ? (
                <View className="gap-1 mt-4">
                  <Text className="text-muted text-sm">
                    {t("products.cookingConversion")}
                  </Text>
                  <TagChipList tags={tags} variant="expanded" />
                  <Text className="text-muted text-sm mt-2">
                    {t("products.cookingFactor")}
                  </Text>
                  <InputNumber
                    value={cookingFactorText}
                    onChangeText={setCookingFactorText}
                  />
                  <Text className="text-muted text-sm mt-2">
                    {t("products.cookingConversionPreview", {
                      raw: "100",
                      rawUnit: t("common.gramsUnit"),
                      cooked: String(
                        convertRawToCooked(100, resolvedCookingFactor),
                      ).replace(".", ","),
                      cookedUnit: t("common.gramsUnit"),
                    })}
                  </Text>
                </View>
              ) : null}

              <Card className="mt-4">
                <Card.Header>
                  <Card.Title>{t("products.photo")}</Card.Title>
                </Card.Header>
                <Card.Body className="items-center gap-2 py-2">
                  {imageUrl ? (
                    <>
                      <ProductImage uri={imageUrl} size={96} />
                      <Card.Description className="text-center">
                        {isRemoteProductImage(imageUrl)
                          ? t("products.photoFromOff")
                          : t("products.photoCustom")}
                      </Card.Description>
                    </>
                  ) : (
                    <View className="h-32 w-32 items-center justify-center rounded-2xl border border-dashed border-separator bg-default" />
                  )}
                </Card.Body>
                <Card.Footer className="flex-row gap-2">
                  <AppButton
                    variant="tertiary"
                    className="flex-1"
                    onPress={handlePickPhoto}
                    accessibilityLabel={
                      imageUrl
                        ? t("products.changePhoto")
                        : t("products.addPhoto")
                    }
                  >
                    {imageUrl
                      ? t("products.changePhoto")
                      : t("products.addPhoto")}
                  </AppButton>
                  {imageUrl ? (
                    <AppButton
                      variant="danger-soft"
                      className="flex-1"
                      onPress={handleRemovePhoto}
                      accessibilityLabel={t("products.removePhotoA11y")}
                    >
                      {t("products.removePhoto")}
                    </AppButton>
                  ) : null}
                </Card.Footer>
              </Card>

              <View className="mt-4">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-foreground text-base font-medium">
                    {t("products.customUnits")}
                  </Text>
                  <AppButton
                    size="sm"
                    variant="tertiary"
                    onPress={openAddUnit}
                    accessibilityLabel={t("products.addUnit")}
                  >
                    {t("products.addUnit")}
                  </AppButton>
                </View>
                {units.length === 0 ? (
                  <Text className="text-muted text-sm">
                    {t("products.noCustomUnits")}
                  </Text>
                ) : (
                  units.map((unit, index) => (
                    <View
                      key={unit.id}
                      className={`flex-row items-center justify-between py-2 ${
                        index === units.length - 1
                          ? ""
                          : "border-b border-separator"
                      }`}
                    >
                      <AppPressable
                        className="flex-1 pr-2"
                        onPress={() => openEditUnit(unit)}
                      >
                        <Text className="text-foreground text-sm">
                          1 {unit.abbreviation} ={" "}
                          {formatEquivalentMass(unit.equivalentInGrams)} (
                          {unit.name})
                        </Text>
                      </AppPressable>
                      <AppPressable
                        onPress={() => removeUnit(unit.id)}
                        hitSlop={8}
                      >
                        <FaIcon name="xmark" size={16} color={dangerColor} />
                      </AppPressable>
                    </View>
                  ))
                )}
              </View>

              {product?.id ? (
                <ProductStatisticsSection productId={product.id} />
              ) : null}

              <View className="flex-row items-center justify-end gap-2 mt-6 mb-8">
                {isEditing ? (
                  <AppButton
                    variant="danger-soft"
                    onPress={() => setDeleteConfirmOpen(true)}
                    isDisabled={isSaving || isDeleting}
                    accessibilityLabel={t("products.deleteA11y")}
                  >
                    {t("common.delete")}
                  </AppButton>
                ) : null}
                <AppButton
                  variant="primary"
                  onPress={() => void handleSave()}
                  isDisabled={isSaving || isDeleting}
                >
                  {isSaving ? (
                    <ActivityIndicator color={accentForeground} size="small" />
                  ) : (
                    t("common.save")
                  )}
                </AppButton>
              </View>
            </BottomSheetScrollView>
          </BottomSheet.Content>
          {showTutorialBanner ? (
            <View
              pointerEvents="box-none"
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 10,
              }}
            >
              <TutorialInlineBanner
                stepId="product-form"
                includeTabBarInset={false}
                sheetBottom
              />
            </View>
          ) : null}
        </BottomSheet.Portal>
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

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title={t("products.deleteConfirmTitle")}
        description={t("products.deleteConfirmMessage")}
        confirmLabel={t("common.delete")}
        destructive
        onConfirm={() => void handleDeleteConfirmed()}
      />
    </>
  );
};
