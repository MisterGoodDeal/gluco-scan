import '@/i18n';

import { Stack } from 'expo-router';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FontProvider } from '@/components/providers/FontProvider';
import { AppThemeProvider } from '@/components/providers/AppThemeProvider';
import { DatabaseGate } from '@/components/organisms/DatabaseGate';
import { TutorialHost } from '@/components/providers/TutorialHost';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <FontProvider>
          <AppThemeProvider>
          <DatabaseGate>
            <BottomSheetModalProvider>
              <TutorialHost>
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
            </BottomSheetModalProvider>
          </DatabaseGate>
          </AppThemeProvider>
        </FontProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
