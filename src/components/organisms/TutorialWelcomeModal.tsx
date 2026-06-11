import { useThemeColor } from 'heroui-native';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Modal, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { useTutorialStore } from '@/store/tutorial.store';
import { TutorialStatus } from '@/types/tutorial';

export const TutorialWelcomeModal: FC = () => {
  const { t } = useTranslation();
  const accentForeground = useThemeColor('accent-foreground');
  const visible = useTutorialStore((s) => s.welcomeVisible);
  const status = useTutorialStore((s) => s.status);
  const startTutorial = useTutorialStore((s) => s.startTutorial);
  const dismissWelcome = useTutorialStore((s) => s.dismissWelcome);

  const isStarting = status === TutorialStatus.STARTING;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/55 items-center justify-center p-6">
        <View className="w-full max-w-[360px] rounded-3xl bg-overlay border border-border p-6 gap-4">
          <Text className="text-foreground text-2xl font-bold">
            {t('tutorial.welcome.title')}
          </Text>
          <Text className="text-muted text-base">{t('tutorial.welcome.message')}</Text>
          <View className="flex-row justify-end gap-2">
            <AppButton variant="ghost" onPress={dismissWelcome} isDisabled={isStarting}>
              {t('tutorial.welcome.skip')}
            </AppButton>
            <AppButton
              variant="primary"
              onPress={() => void startTutorial()}
              isDisabled={isStarting}>
              {isStarting ? (
                <ActivityIndicator color={accentForeground} size="small" />
              ) : (
                t('tutorial.welcome.start')
              )}
            </AppButton>
          </View>
        </View>
      </View>
    </Modal>
  );
};
