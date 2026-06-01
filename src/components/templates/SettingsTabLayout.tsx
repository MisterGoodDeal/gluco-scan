import { BlurTargetView } from 'expo-blur';
import * as DocumentPicker from 'expo-document-picker';
import { File } from 'expo-file-system';
import { useFocusEffect } from 'expo-router';
import { type FC, useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Pressable, ScrollView, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import styled from 'styled-components/native';

import { BackgroundGradient } from '@/components/atoms/BackgroundGradient';
import { GlassPanel } from '@/components/atoms/GlassPanel';
import { Text } from '@/components/atoms/Text';
import { GlobalUnitFormModal } from '@/components/organisms/GlobalUnitFormModal';
import { useSettingsStore } from '@/store/settings.store';
import type { GlobalUnit } from '@/types/globalUnit';
import { exportToGsFile, importFromGsBytes } from '@/services/export.service';
import { Screen as AppScreen, ScreenHeaderBar } from '@/styles/global';

const Header = styled(ScreenHeaderBar)``;

const Section = styled.View`
  padding: ${({ theme }) => theme.spacing.md}px;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const SectionTitleRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const UnitRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.sm}px 0;
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
  const hydrate = useSettingsStore((s) => s.hydrate);
  const globalUnits = useSettingsStore((s) => s.globalUnits);
  const createUnit = useSettingsStore((s) => s.createUnit);
  const updateUnit = useSettingsStore((s) => s.updateUnit);
  const removeUnit = useSettingsStore((s) => s.removeUnit);
  const setExporting = useSettingsStore((s) => s.setExporting);
  const setImporting = useSettingsStore((s) => s.setImporting);

  const [editingUnit, setEditingUnit] = useState<GlobalUnit | null>(null);
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);

  useFocusEffect(
    useCallback(() => {
      void hydrate();
    }, [hydrate]),
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
    if ('id' in data) {
      await updateUnit(data);
    } else {
      await createUnit(data);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportToGsFile();
      Alert.alert(t('settings.exportSuccess'));
    } catch {
      Alert.alert(t('settings.importError'));
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async () => {
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
      await importFromGsBytes(bytes);
      await hydrate();
      Alert.alert(t('settings.importSuccess'));
    } catch {
      Alert.alert(t('settings.importError'));
    } finally {
      setImporting(false);
    }
  };

  return (
    <AppScreen>
      <StatusBar style="light" />
      <BlurTargetView ref={blurTargetRef} style={{ flex: 1 }}>
        <BackgroundGradient />
        <ScrollView>
          <Header>
            <Text $variant="subtitle">{t('settings.title')}</Text>
          </Header>

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
              {globalUnits.map((unit) => (
                <UnitRow key={unit.id}>
                  <Pressable onPress={() => openEditUnit(unit)}>
                    <Text $variant="body">
                      {unit.name} ({unit.abbreviation}) — {unit.equivalentInGrams}g
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() =>
                      Alert.alert(t('settings.deleteUnitConfirm'), '', [
                        { text: t('common.cancel'), style: 'cancel' },
                        {
                          text: t('common.delete'),
                          style: 'destructive',
                          onPress: () => void removeUnit(unit.id),
                        },
                      ])
                    }>
                    <Text $color="error">×</Text>
                  </Pressable>
                </UnitRow>
              ))}
            </GlassPanel>
          </Section>

          <Section>
            <Text $variant="body">{t('settings.export')}</Text>
            <Text $variant="caption" $color="textSecondary">
              {t('settings.exportDescription')}
            </Text>
            <ActionButton $primary onPress={handleExport}>
              <Text $variant="caption">{t('settings.export')}</Text>
            </ActionButton>
          </Section>

          <Section>
            <Text $variant="body">{t('settings.import')}</Text>
            <Text $variant="caption" $color="textSecondary">
              {t('settings.importDescription')}
            </Text>
            <ActionButton onPress={handleImport}>
              <Text $variant="caption">{t('settings.import')}</Text>
            </ActionButton>
          </Section>
        </ScrollView>
      </BlurTargetView>
      <GlobalUnitFormModal
        visible={isUnitModalOpen}
        unit={editingUnit}
        onClose={closeUnitModal}
        onSave={handleSaveUnit}
      />
    </AppScreen>
  );
};
