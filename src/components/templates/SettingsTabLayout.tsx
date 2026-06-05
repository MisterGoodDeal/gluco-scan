import { BlurTargetView } from 'expo-blur';
import Constants from 'expo-constants';
import * as DocumentPicker from 'expo-document-picker';
import { File } from 'expo-file-system';
import { useFocusEffect } from 'expo-router';
import { type FC, useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Pressable, ScrollView, View } from 'react-native';
import styled from 'styled-components/native';

import { TutorialAnchor } from '@/components/atoms/TutorialAnchor';
import { PickerField } from '@/components/atoms/PickerField';
import { BackgroundGradient } from '@/components/atoms/BackgroundGradient';
import { GlassPanel } from '@/components/atoms/GlassPanel';
import { Text } from '@/components/atoms/Text';
import { ThemePreferencePicker } from '@/components/molecules/ThemePreferencePicker';
import { UnitSystemPicker } from '@/components/molecules/UnitSystemPicker';
import { CookingConversionSettings } from '@/components/molecules/CookingConversionSettings';
import { TabBarHeightReporter } from '@/components/navigation/TabBarHeightReporter';
import { BlurScreenHeader } from '@/components/organisms/BlurScreenHeader';
import { GlobalUnitFormModal } from '@/components/organisms/GlobalUnitFormModal';
import { LanguagePickerSheet } from '@/components/organisms/LanguagePickerSheet';
import { useBlurHeaderInset } from '@/hooks/useBlurHeaderInset';
import { getLanguageLabelKey } from '@/i18n';
import { useMassDisplay } from '@/hooks/useMassDisplay';
import { useTabBarBottomInset } from '@/hooks/useTabBarBottomInset';
import { usePreferencesStore } from '@/store/preferences.store';
import { useSettingsStore } from '@/store/settings.store';
import { useCookingConversionStore } from '@/store/cookingConversion.store';
import type { GlobalUnit } from '@/types/globalUnit';
import { exportToGsFile, importFromGsBytes } from '@/services/export.service';
import { useTutorialStore } from '@/store/tutorial.store';
import { TutorialStatus } from '@/types/tutorial';
import { Screen as AppScreen } from '@/styles/global';
import { triggerNotificationError, triggerNotificationSuccess } from '@/utils/haptics';
import { listRowDivider } from '@/styles/listRow';

const Section = styled.View`
  padding: ${({ theme }) => theme.spacing.md}px;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const SectionTitleRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const UnitRow = styled.View<{ $isLast?: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.sm}px 0;
  ${listRowDivider}
`;

const AddButton = styled.Pressable`
  padding: ${({ theme }) => theme.spacing.xs}px ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme }) => theme.colors.accentMuted};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.glass.border};
`;

const ActionButton = styled.Pressable<{ $primary?: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme, $primary }) =>
    $primary ? theme.colors.accent : theme.colors.glass.background};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.glass.border};
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

export const SettingsTabLayout: FC = () => {
  const { t } = useTranslation();
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
  const [isLanguageSheetOpen, setIsLanguageSheetOpen] = useState(false);
  const currentLocale = usePreferencesStore((s) => s.locale);
  const setLocale = usePreferencesStore((s) => s.setLocale);
  const { formatEquivalentMass } = useMassDisplay();
  const tabBarInset = useTabBarBottomInset();
  const tutorialStatus = useTutorialStore((s) => s.status);
  const startTutorial = useTutorialStore((s) => s.startTutorial);
  const isTutorialRunning = tutorialStatus === TutorialStatus.RUNNING;
  const isTutorialBusy = tutorialStatus === TutorialStatus.STARTING;
  const appVersion = Constants.expoConfig?.version ?? '—';

  useFocusEffect(
    useCallback(() => {
      void hydrate();
      void hydrateCookingConversions();
    }, [hydrate, hydrateCookingConversions]),
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

  const handleExport = async () => {
    if (isTutorialRunning) {
      Alert.alert(t('tutorial.settings.disabledDuringTutorial'));
      return;
    }
    setExporting(true);
    try {
      await exportToGsFile();
      triggerNotificationSuccess();
      Alert.alert(t('settings.exportSuccess'));
    } catch {
      triggerNotificationError();
      Alert.alert(t('settings.importError'));
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async () => {
    if (isTutorialRunning) {
      Alert.alert(t('tutorial.settings.disabledDuringTutorial'));
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
      triggerNotificationSuccess();
      Alert.alert(t('settings.importSuccess'));
    } catch {
      triggerNotificationError();
      Alert.alert(t('settings.importError'));
    } finally {
      setImporting(false);
    }
  };

  return (
    <AppScreen>
      <TabBarHeightReporter />
      <BlurTargetView ref={blurTargetRef} style={{ flex: 1 }}>
        <BackgroundGradient />
        <ScrollView
          contentContainerStyle={{
            paddingTop: headerHeight,
            paddingBottom: tabBarInset,
          }}>
          <Section>
            <Text $variant="body">{t('settings.appearance')}</Text>
            <Text $variant="caption" $color="textSecondary">
              {t('settings.appearanceDescription')}
            </Text>
            <ThemePreferencePicker />
          </Section>

          <Section>
            <Text $variant="body">{t('settings.units')}</Text>
            <Text $variant="caption" $color="textSecondary">
              {t('settings.unitsDescription')}
            </Text>
            <UnitSystemPicker />
          </Section>

          <Section>
            <Text $variant="body">{t('settings.cookingConversions')}</Text>
            <GlassPanel blurTarget={blurTargetRef}>
              <CookingConversionSettings />
            </GlassPanel>
          </Section>

          <Section>
            <Text $variant="body">{t('settings.language')}</Text>
            <PickerField
              value={t(getLanguageLabelKey(currentLocale))}
              onPress={() => setIsLanguageSheetOpen(true)}
              accessibilityLabel={t('settings.language')}
            />
          </Section>

          <Section>
            <Text $variant="body">{t('tutorial.settings.title')}</Text>
            <Text $variant="caption" $color="textSecondary">
              {t('tutorial.settings.relaunchDescription')}
            </Text>
            <ActionButton
              $primary
              onPress={() => void startTutorial()}
              disabled={isTutorialRunning || isTutorialBusy}>
              <Text $variant="caption">{t('tutorial.settings.relaunch')}</Text>
            </ActionButton>
          </Section>

          <TutorialAnchor id="tutorial-settings-units">
          <Section>
            <SectionTitleRow>
              <Text $variant="body">{t('settings.globalUnits')}</Text>
              <AddButton onPress={openAddUnit} accessibilityLabel={t('settings.addUnit')}>
                <Text $variant="caption" $color="accent">
                  {t('settings.addUnit')}
                </Text>
              </AddButton>
            </SectionTitleRow>
            <GlassPanel blurTarget={blurTargetRef}>
              {globalUnits.map((unit, index) => (
                <UnitRow key={unit.id} $isLast={index === globalUnits.length - 1}>
                  <Pressable onPress={() => openEditUnit(unit)}>
                    <Text $variant="body">
                      {unit.name} ({unit.abbreviation}) — {formatEquivalentMass(unit.equivalentInGrams)}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() =>
                      Alert.alert(t('settings.deleteUnitConfirm'), '', [
                        { text: t('common.cancel'), style: 'cancel' },
                        {
                          text: t('common.delete'),
                          style: 'destructive',
                          onPress: () => {
                            void removeUnit(unit.id)
                              .then(() => triggerNotificationSuccess())
                              .catch(() => triggerNotificationError());
                          },
                        },
                      ])
                    }>
                    <Text $color="error">×</Text>
                  </Pressable>
                </UnitRow>
              ))}
            </GlassPanel>
          </Section>
          </TutorialAnchor>

          <TutorialAnchor id="tutorial-settings-data">
          <Section>
            <Text $variant="body">{t('settings.export')}</Text>
            <Text $variant="caption" $color="textSecondary">
              {t('settings.exportDescription')}
            </Text>
            <ActionButton $primary onPress={handleExport} disabled={isTutorialRunning}>
              <Text $variant="caption">{t('settings.export')}</Text>
            </ActionButton>
          </Section>

          <Section>
            <Text $variant="body">{t('settings.import')}</Text>
            <Text $variant="caption" $color="textSecondary">
              {t('settings.importDescription')}
            </Text>
            <ActionButton onPress={handleImport} disabled={isTutorialRunning}>
              <Text $variant="caption">{t('settings.import')}</Text>
            </ActionButton>
          </Section>

          <Section>
            <Text $variant="caption" $color="textSecondary">
              Version {appVersion}
            </Text>
          </Section>
          </TutorialAnchor>
        </ScrollView>
        <BlurScreenHeader blurTarget={blurTargetRef} onLayoutHeight={onHeaderLayout}>
          <Text $variant="subtitle">{t('settings.title')}</Text>
        </BlurScreenHeader>
      </BlurTargetView>
      <GlobalUnitFormModal
        visible={isUnitModalOpen}
        unit={editingUnit}
        onClose={closeUnitModal}
        onSave={handleSaveUnit}
      />
      <LanguagePickerSheet
        visible={isLanguageSheetOpen}
        locale={currentLocale}
        onSelect={(locale) => {
          void setLocale(locale);
          setIsLanguageSheetOpen(false);
        }}
        onClose={() => setIsLanguageSheetOpen(false)}
      />
    </AppScreen>
  );
};
