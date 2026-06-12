import '../../global.css';
import '@/i18n';

import { Stack } from 'expo-router';
import { HeroUINativeProvider } from 'heroui-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TAB_BAR_CONTENT_HEIGHT } from '@/constants/tabBar';
import { FontProvider } from '@/components/providers/FontProvider';
import { AppThemeProvider } from '@/components/providers/AppThemeProvider';
import { DatabaseGate } from '@/components/organisms/DatabaseGate';
import { TutorialHost } from '@/components/providers/TutorialHost';
import { WidgetBootstrap } from '@/features/widgets/components/WidgetBootstrap';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <FontProvider>
          <AppThemeProvider>
          <HeroUINativeProvider
            config={{
              toast: {
                defaultProps: { placement: 'bottom' },
                insets: { bottom: TAB_BAR_CONTENT_HEIGHT + 12 },
              },
            }}>
          <DatabaseGate>
            <TutorialHost>
              <WidgetBootstrap />
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen
                  name="meal/create"
                  options={{ presentation: 'fullScreenModal' }}
                />
                <Stack.Screen
                  name="meal/edit"
                  options={{ presentation: 'fullScreenModal' }}
                />
              </Stack>
            </TutorialHost>
          </DatabaseGate>
          </HeroUINativeProvider>
          </AppThemeProvider>
        </FontProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
