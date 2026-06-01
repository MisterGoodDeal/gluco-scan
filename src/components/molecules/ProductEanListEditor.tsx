import { type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';
import styled from 'styled-components/native';

import { SearchInput } from '@/components/atoms/SearchInput';
import { Text } from '@/components/atoms/Text';
import { EanScanField } from '@/components/molecules/EanScanField';
import { listRowDivider } from '@/styles/listRow';
import { isValidEan } from '@/utils/ean';

type ProductEanListEditorProps = {
  eans: string[];
  onChange: (eans: string[]) => void;
  onScan: (ean: string) => void;
};

const EanRow = styled.View<{ $isLast?: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.xs}px 0;
  ${listRowDivider}
`;

const ManualRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

const AddManualButton = styled.Pressable`
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  background-color: ${({ theme }) => theme.colors.accentMuted};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.glass.border};
`;

export const ProductEanListEditor: FC<ProductEanListEditorProps> = ({
  eans,
  onChange,
  onScan,
}) => {
  const { t } = useTranslation();
  const [manualEan, setManualEan] = useState('');
  const [manualError, setManualError] = useState<string | null>(null);

  const removeEan = (ean: string) => {
    onChange(eans.filter((e) => e !== ean));
  };

  const addEan = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return false;
    if (!isValidEan(trimmed)) {
      setManualError(t('modal.invalidEan'));
      return false;
    }
    if (eans.includes(trimmed)) {
      setManualError(t('products.duplicateEan'));
      return false;
    }
    onChange([...eans, trimmed]);
    setManualError(null);
    return true;
  };

  const handleManualAdd = () => {
    if (addEan(manualEan)) {
      setManualEan('');
    }
  };

  const handleScan = (ean: string) => {
    if (eans.includes(ean)) {
      setManualError(t('products.duplicateEan'));
      return;
    }
    setManualError(null);
    onChange([...eans, ean]);
    onScan(ean);
  };

  return (
    <>
      {eans.length > 0 ? (
        eans.map((ean, index) => (
          <EanRow key={ean} $isLast={index === eans.length - 1}>
            <Text $variant="mono" style={{ flex: 1 }}>
              {ean}
            </Text>
            <Pressable onPress={() => removeEan(ean)} hitSlop={8} accessibilityLabel={t('common.delete')}>
              <Text $color="error">×</Text>
            </Pressable>
          </EanRow>
        ))
      ) : (
        <Text $variant="caption" $color="textSecondary">
          {t('products.noEans')}
        </Text>
      )}

      <EanScanField onScan={handleScan} />

      <ManualRow>
        <SearchInput
          value={manualEan}
          onChangeText={(text) => {
            setManualEan(text);
            setManualError(null);
          }}
          placeholder={t('modal.scanPlaceholder')}
          mono
          flex
          keyboardType="number-pad"
        />
        <AddManualButton onPress={handleManualAdd} accessibilityLabel={t('products.addEan')}>
          <Text $variant="caption" $color="accent">
            {t('common.add')}
          </Text>
        </AddManualButton>
      </ManualRow>

      {manualError && (
        <Text $variant="caption" $color="error" style={{ marginTop: 4 }}>
          {manualError}
        </Text>
      )}
    </>
  );
};
