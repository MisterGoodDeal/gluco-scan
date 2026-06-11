import { FieldError, useThemeColor } from 'heroui-native';
import { type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { FaIcon } from '@/components/atoms/FaIcon';
import { EanScanField } from '@/components/molecules/EanScanField';
import { AppPressable } from '@/components/ui/AppPressable';
import { triggerNotificationError, triggerNotificationSuccess } from '@/utils/haptics';

type ProductEanListEditorProps = {
  eans: string[];
  onChange: (eans: string[]) => void;
  onScan: (ean: string) => void;
};

export const ProductEanListEditor: FC<ProductEanListEditorProps> = ({
  eans,
  onChange,
  onScan,
}) => {
  const { t } = useTranslation();
  const dangerColor = useThemeColor('danger');
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
          <View
            key={ean}
            className={`flex-row items-center justify-between py-1 ${
              index === eans.length - 1 ? '' : 'border-b border-separator'
            }`}>
            <Text className="flex-1 text-foreground font-mono text-sm font-semibold">{ean}</Text>
            <AppPressable
              onPress={() => removeEan(ean)}
              hitSlop={8}
              accessibilityLabel={t('common.delete')}>
              <FaIcon name="xmark" size={16} color={dangerColor} />
            </AppPressable>
          </View>
        ))
      ) : (
        <Text className="text-muted text-sm">{t('products.noEans')}</Text>
      )}

      <EanScanField onScan={handleScan} />

      <FieldError isInvalid={error !== null} className="mt-1">
        {error ?? ''}
      </FieldError>
    </>
  );
};
