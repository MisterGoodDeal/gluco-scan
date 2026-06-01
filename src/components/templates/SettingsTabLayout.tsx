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
import { SearchInput } from '@/components/atoms/SearchInput';
import { Text } from '@/components/atoms/Text';
import { useSettingsStore } from '@/store/settings.store';
import type { GlobalUnit } from '@/types/globalUnit';
import { exportToGsFile, importFromGsBytes } from '@/services/export.service';
import { Screen as AppScreen } from '@/styles/global';
import { parseManualCarbs } from '@/utils/ean';

const Header = styled.View`
  padding: ${({ theme }) => theme.spacing.md}px;
  padding-top: ${({ theme }) => theme.spacing.lg}px;
`;

const Section = styled.View`
  padding: ${({ theme }) => theme.spacing.md}px;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const UnitRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.sm}px 0;
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

  const [editing, setEditing] = useState<GlobalUnit | null>(null);
  const [name, setName] = useState('');
  const [abbreviation, setAbbreviation] = useState('');
  const [gramsText, setGramsText] = useState('');

  useFocusEffect(
    useCallback(() => {
      void hydrate();
    }, [hydrate]),
  );

  const openNew = () => {
    setEditing(null);
    setName('');
    setAbbreviation('');
    setGramsText('');
  };

  const openEdit = (unit: GlobalUnit) => {
    setEditing(unit);
    setName(unit.name);
    setAbbreviation(unit.abbreviation);
    setGramsText(String(unit.equivalentInGrams));
  };

  const saveUnit = async () => {
    const grams = parseManualCarbs(gramsText);
    if (!name.trim() || !abbreviation.trim() || grams === null) return;
    if (editing) {
      await updateUnit({ ...editing, name: name.trim(), abbreviation: abbreviation.trim(), equivalentInGrams: grams });
    } else {
      await createUnit({ name: name.trim(), abbreviation: abbreviation.trim(), equivalentInGrams: grams });
    }
    openNew();
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
            <Text $variant="body">{t('settings.globalUnits')}</Text>
            <GlassPanel blurTarget={blurTargetRef}>
              {globalUnits.map((unit) => (
                <UnitRow key={unit.id}>
                  <Pressable onPress={() => openEdit(unit)}>
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
            <SearchInput value={name} onChangeText={setName} placeholder={t('products.unitName')} />
            <SearchInput
              value={abbreviation}
              onChangeText={setAbbreviation}
              placeholder={t('products.unitAbbreviation')}
            />
            <SearchInput
              value={gramsText}
              onChangeText={setGramsText}
              placeholder={t('products.unitGrams')}
            />
            <ActionButton $primary onPress={saveUnit}>
              <Text $variant="caption">
                {editing ? t('common.save') : t('settings.addUnit')}
              </Text>
            </ActionButton>
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
    </AppScreen>
  );
};
