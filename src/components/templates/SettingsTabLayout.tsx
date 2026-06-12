import { BlurTargetView } from 'expo-blur';
import * as DocumentPicker from 'expo-document-picker';
import { File } from 'expo-file-system';
import { useFocusEffect } from 'expo-router';
import { Accordion, useThemeColor } from 'heroui-native';
import { type FC, useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';

import { FaIcon } from '@/components/atoms/FaIcon';
import { TutorialAnchor } from '@/components/atoms/TutorialAnchor';
import { BackgroundGradient } from '@/components/atoms/BackgroundGradient';
import { ThemePreferencePicker } from '@/components/molecules/ThemePreferencePicker';
import { UnitSystemPicker } from '@/components/molecules/UnitSystemPicker';
import { CookingConversionSettings } from '@/components/molecules/CookingConversionSettings';
import { MealTypeScheduleSettings } from '@/components/molecules/MealTypeScheduleSettings';
import { TabBarHeightReporter } from '@/components/navigation/TabBarHeightReporter';
import { BlurScreenHeader } from '@/components/organisms/BlurScreenHeader';
import { GlobalUnitFormModal } from '@/components/organisms/GlobalUnitFormModal';
import { AppButton } from '@/components/ui/AppButton';
import { AppSelect } from '@/components/ui/AppSelect';
import { AppPressable } from '@/components/ui/AppPressable';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useAppToast } from '@/components/ui/useAppToast';
import { APP_VERSION } from '@/constants/appVersion';
import { useBlurHeaderInset } from '@/hooks/useBlurHeaderInset';
import { getLanguageLabelKey, supportedLocales, type SupportedLocale } from '@/i18n';
import { useMassDisplay } from '@/hooks/useMassDisplay';
import { useTabBarBottomInset } from '@/hooks/useTabBarBottomInset';
import { usePreferencesStore } from '@/store/preferences.store';
import { useSettingsStore } from '@/store/settings.store';
import { useCookingConversionStore } from '@/store/cookingConversion.store';
import type { GlobalUnit } from '@/types/globalUnit';
import { exportToGsFile, importFromGsBytes } from '@/services/export.service';
import { useTutorialStore } from '@/store/tutorial.store';
import { TutorialStatus } from '@/types/tutorial';
import { triggerNotificationError, triggerNotificationSuccess } from '@/utils/haptics';

type SectionItemProps = {
  value: string;
  title: string;
  children: React.ReactNode;
};

const SectionItem: FC<SectionItemProps> = ({ value, title, children }) => (
  <Accordion.Item value={value}>
    <Accordion.Trigger>
      <Text className="text-foreground text-base font-medium flex-1">{title}</Text>
      <Accordion.Indicator />
    </Accordion.Trigger>
    <Accordion.Content>
      <View className="gap-2 pb-2">{children}</View>
    </Accordion.Content>
  </Accordion.Item>
);

export const SettingsTabLayout: FC = () => {
  const { t } = useTranslation();
  const toast = useAppToast();
  const dangerColor = useThemeColor('danger');
  const blurTargetRef = useRef<View>(null);
  const { headerHeight, onHeaderLayout } = useBlurHeaderInset(0);
  const hydrate = useSettingsStore((s) => s.hydrate);
  const hydrateCookingConversions = useCookingConversionStore((s) => s.hydrate);
  const globalUnits = useSettingsStore((s) => s.globalUnits);
  const createUnit = useSettingsStore((s) => s.createUnit);
  const updateUnit = useSettingsStore((s) => s.updateUnit);
  const removeUnit = useSettingsStore((s) => s.removeUnit);
  const setExporting = useSettingsStore((s) => s.setExporting);
  const setImporting = useSettingsStore((s) => s.setImporting);

  const [editingUnit, setEditingUnit] = useState<GlobalUnit | null>(null);
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [unitIdToDelete, setUnitIdToDelete] = useState<string | null>(null);
  const currentLocale = usePreferencesStore((s) => s.locale);
  const setLocale = usePreferencesStore((s) => s.setLocale);
  const hydratePreferences = usePreferencesStore((s) => s.hydrate);
  const { formatEquivalentMass } = useMassDisplay();
  const tabBarInset = useTabBarBottomInset();
  const tutorialStatus = useTutorialStore((s) => s.status);
  const startTutorial = useTutorialStore((s) => s.startTutorial);
  const isTutorialRunning = tutorialStatus === TutorialStatus.RUNNING;
  const isTutorialBusy = tutorialStatus === TutorialStatus.STARTING;
  const languageOptions = useMemo(
    () =>
      supportedLocales.map((locale) => ({
        value: locale,
        label: t(getLanguageLabelKey(locale)),
      })),
    [t],
  );
  const selectedLanguage = languageOptions.find((option) => option.value === currentLocale);

  useFocusEffect(
    useCallback(() => {
      void hydrate();
      void hydrateCookingConversions();
      void hydratePreferences();
    }, [hydrate, hydrateCookingConversions, hydratePreferences]),
  );

  const openAddUnit = () => {
    setEditingUnit(null);
    setIsUnitModalOpen(true);
  };

  const openEditUnit = (unit: GlobalUnit) => {
    setEditingUnit(unit);
    setIsUnitModalOpen(true);
  };

  const closeUnitModal = () => {
    setIsUnitModalOpen(false);
    setEditingUnit(null);
  };

  const handleSaveUnit = async (data: Omit<GlobalUnit, 'id'> | GlobalUnit) => {
    try {
      if ('id' in data) {
        await updateUnit(data);
      } else {
        await createUnit(data);
      }
      triggerNotificationSuccess();
    } catch (error) {
      triggerNotificationError();
      throw error;
    }
  };

  const handleDeleteUnitConfirmed = useCallback(() => {
    if (!unitIdToDelete) return;
    void removeUnit(unitIdToDelete)
      .then(() => toast.success(t('settings.unitDeleted')))
      .catch(() => toast.error(t('settings.unitDeleteError')));
    setUnitIdToDelete(null);
  }, [unitIdToDelete, removeUnit, t, toast]);

  const handleExport = async () => {
    if (isTutorialRunning) {
      toast.warning(t('tutorial.settings.disabledDuringTutorial'));
      return;
    }
    setExporting(true);
    try {
      await exportToGsFile();
      toast.success(t('settings.exportSuccess'));
    } catch {
      toast.error(t('settings.importError'));
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async () => {
    if (isTutorialRunning) {
      toast.warning(t('tutorial.settings.disabledDuringTutorial'));
      return;
    }
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });
      if (result.canceled || !result.assets[0]) return;
      setImporting(true);
      const uri = result.assets[0].uri;
      const file = new File(uri);
      const bytes = await file.bytes();
      await importFromGsBytes(bytes, { mode: 'merge' });
      await hydrate();
      await hydrateCookingConversions();
      toast.success(t('settings.importSuccess'));
    } catch {
      toast.error(t('settings.importError'));
    } finally {
      setImporting(false);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <TabBarHeightReporter />
      <BlurTargetView ref={blurTargetRef} style={{ flex: 1 }}>
        <BackgroundGradient />
        <ScrollView
          contentContainerStyle={{
            paddingTop: headerHeight + 8,
            paddingBottom: tabBarInset,
            paddingHorizontal: 16,
          }}>
          <Accordion
            selectionMode="multiple"
            variant="surface"
            defaultValue={['appearance']}>
            <SectionItem value="appearance" title={t('settings.appearance')}>
              <Text className="text-muted text-sm">{t('settings.appearanceDescription')}</Text>
              <ThemePreferencePicker />
            </SectionItem>

            <SectionItem value="units" title={t('settings.units')}>
              <Text className="text-muted text-sm">{t('settings.unitsDescription')}</Text>
              <UnitSystemPicker />
            </SectionItem>

            <SectionItem value="mealSchedule" title={t('settings.mealTypeSchedule')}>
              <MealTypeScheduleSettings />
            </SectionItem>

            <SectionItem value="cooking" title={t('settings.cookingConversions')}>
              <CookingConversionSettings />
            </SectionItem>

            <SectionItem value="language" title={t('settings.language')}>
              <AppSelect
                value={selectedLanguage}
                onValueChange={(option) => {
                  if (option) void setLocale(option.value as SupportedLocale);
                }}
                options={languageOptions}
                placeholder={t('settings.language')}
                listLabel={t('settings.language')}
              />
            </SectionItem>

            <SectionItem value="tutorial" title={t('tutorial.settings.title')}>
              <Text className="text-muted text-sm">
                {t('tutorial.settings.relaunchDescription')}
              </Text>
              <AppButton
                size="sm"
                variant="primary"
                onPress={() => void startTutorial()}
                isDisabled={isTutorialRunning || isTutorialBusy}>
                {t('tutorial.settings.relaunch')}
              </AppButton>
            </SectionItem>
          </Accordion>

          <TutorialAnchor id="tutorial-settings-units">
            <View className="mt-4">
              <Accordion selectionMode="multiple" variant="surface">
                <SectionItem value="globalUnits" title={t('settings.globalUnits')}>
                  {globalUnits.map((unit, index) => (
                    <View
                      key={unit.id}
                      className={`flex-row items-center justify-between py-2 ${
                        index === globalUnits.length - 1 ? '' : 'border-b border-separator'
                      }`}>
                      <AppPressable onPress={() => openEditUnit(unit)} className="flex-1">
                        <Text className="text-foreground text-base">
                          {unit.name} ({unit.abbreviation}) —{' '}
                          {formatEquivalentMass(unit.equivalentInGrams)}
                        </Text>
                      </AppPressable>
                      <AppButton
                        isIconOnly
                        size="sm"
                        variant="ghost"
                        onPress={() => setUnitIdToDelete(unit.id)}
                        accessibilityLabel={t('common.delete')}>
                        <FaIcon name="xmark" size={16} color={dangerColor} />
                      </AppButton>
                    </View>
                  ))}
                  <AppButton
                    size="sm"
                    variant="tertiary"
                    onPress={openAddUnit}
                    accessibilityLabel={t('settings.addUnit')}>
                    {t('settings.addUnit')}
                  </AppButton>
                </SectionItem>
              </Accordion>
            </View>
          </TutorialAnchor>

          <TutorialAnchor id="tutorial-settings-data">
            <View className="mt-4">
              <Accordion selectionMode="multiple" variant="surface">
                <SectionItem value="export" title={t('settings.export')}>
                  <Text className="text-muted text-sm">{t('settings.exportDescription')}</Text>
                  <AppButton
                    size="sm"
                    variant="primary"
                    onPress={() => void handleExport()}
                    isDisabled={isTutorialRunning}>
                    {t('settings.export')}
                  </AppButton>
                </SectionItem>

                <SectionItem value="import" title={t('settings.import')}>
                  <Text className="text-muted text-sm">{t('settings.importDescription')}</Text>
                  <AppButton
                    size="sm"
                    variant="secondary"
                    onPress={() => void handleImport()}
                    isDisabled={isTutorialRunning}>
                    {t('settings.import')}
                  </AppButton>
                </SectionItem>
              </Accordion>

              <Text className="text-muted text-xs text-center mt-4">
                Version {APP_VERSION}
              </Text>
            </View>
          </TutorialAnchor>
        </ScrollView>
        <BlurScreenHeader blurTarget={blurTargetRef} onLayoutHeight={onHeaderLayout}>
          <Text className="text-foreground text-lg font-bold">{t('settings.title')}</Text>
        </BlurScreenHeader>
      </BlurTargetView>
      <GlobalUnitFormModal
        visible={isUnitModalOpen}
        unit={editingUnit}
        onClose={closeUnitModal}
        onSave={handleSaveUnit}
      />
      <ConfirmDialog
        isOpen={unitIdToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setUnitIdToDelete(null);
        }}
        title={t('settings.deleteUnitConfirm')}
        confirmLabel={t('common.delete')}
        destructive
        onConfirm={handleDeleteUnitConfirmed}
      />
    </View>
  );
};
