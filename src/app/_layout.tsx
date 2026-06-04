import '@/i18n';

import { Stack } from 'expo-router';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppThemeProvider } from '@/components/providers/AppThemeProvider';
import { DatabaseGate } from '@/components/organisms/DatabaseGate';
import { TutorialHost } from '@/components/providers/TutorialHost';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
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
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
