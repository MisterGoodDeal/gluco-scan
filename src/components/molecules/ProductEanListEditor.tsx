import { FaIcon } from '@/components/atoms/FaIcon';
import { type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';
import styled, { useTheme } from 'styled-components/native';

import { Text } from '@/components/atoms/Text';
import { EanScanField } from '@/components/molecules/EanScanField';
import { listRowDivider } from '@/styles/listRow';
import { triggerNotificationError, triggerNotificationSuccess } from '@/utils/haptics';

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

export const ProductEanListEditor: FC<ProductEanListEditorProps> = ({
  eans,
  onChange,
  onScan,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [error, setError] = useState<string | null>(null);

  const removeEan = (ean: string) => {
    onChange(eans.filter((e) => e !== ean));
  };

  const handleScan = (ean: string) => {
    if (eans.includes(ean)) {
      setError(t('products.duplicateEan'));
      triggerNotificationError();
      return;
    }
    setError(null);
    onChange([...eans, ean]);
    onScan(ean);
    triggerNotificationSuccess();
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
              <FaIcon name="xmark" size={16} color={theme.colors.error} />
            </Pressable>
          </EanRow>
        ))
      ) : (
        <Text $variant="caption" $color="textSecondary">
          {t('products.noEans')}
        </Text>
      )}

      <EanScanField onScan={handleScan} />

      {error && (
        <Text $variant="caption" $color="error" style={{ marginTop: 4 }}>
          {error}
        </Text>
      )}
    </>
  );
};
