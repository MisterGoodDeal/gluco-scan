import { BlurView } from 'expo-blur';
import { FaIcon } from '@/components/atoms/FaIcon';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import styled, { useTheme } from 'styled-components/native';

import { GlassPanel } from '@/components/atoms/GlassPanel';
import { TagIcon } from '@/components/atoms/TagIcon';
import { Text } from '@/components/atoms/Text';
import { ALL_PRODUCT_TAGS, type ProductTag } from '@/types/productTag';
import { getTagMetadata } from '@/utils/tags/getTagMetadata';
import { listRowDivider } from '@/styles/listRow';

type TagPickerSheetProps = {
  visible: boolean;
  value: ProductTag[];
  onChange: (tags: ProductTag[]) => void;
  onClose: () => void;
};

const TagRow = styled.Pressable<{ $isLast?: boolean }>`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding: ${({ theme }) => theme.spacing.sm}px 0;
  ${listRowDivider}
`;

const TagLabel = styled.View`
  flex: 1;
`;

const List = styled(ScrollView)`
  max-height: 360px;
`;

export const TagPickerSheet: FC<TagPickerSheetProps> = ({
  visible,
  value,
  onChange,
  onClose,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const toggleTag = (tag: ProductTag) => {
    if (value.includes(tag)) {
      onChange(value.filter((entry) => entry !== tag));
      return;
    }
    onChange([...value, tag]);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <BlurView
        intensity={50}
        tint={theme.blur.tint}
        blurMethod={theme.blur.androidMethod}
        style={StyleSheet.absoluteFill}>
        <Pressable style={{ flex: 1, justifyContent: 'center', padding: 24 }} onPress={onClose}>
          <Pressable onPress={(event) => event.stopPropagation()}>
            <GlassPanel padding={theme.spacing.lg}>
              <Text $variant="subtitle" style={{ marginBottom: theme.spacing.sm }}>
                {t('products.tagsSection')}
              </Text>
              <List showsVerticalScrollIndicator={false}>
                {ALL_PRODUCT_TAGS.map((tag, index) => {
                  const metadata = getTagMetadata(tag);
                  const selected = value.includes(tag);
                  const label = t(metadata.translationKey);

                  return (
                    <TagRow
                      key={tag}
                      $isLast={index === ALL_PRODUCT_TAGS.length - 1}
                      onPress={() => toggleTag(tag)}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: selected }}
                      accessibilityLabel={label}>
                      <TagIcon tag={tag} size={20} />
                      <TagLabel>
                        <Text $variant="body">{label}</Text>
                      </TagLabel>
                      {selected ? (
                        <View pointerEvents="none">
                          <FaIcon name="check" size={18} color={theme.colors.accent} />
                        </View>
                      ) : null}
                    </TagRow>
                  );
                })}
              </List>
            </GlassPanel>
          </Pressable>
        </Pressable>
      </BlurView>
    </Modal>
  );
};
