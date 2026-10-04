import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { EmptyState, LoadingState, PrimaryButton, Screen } from '@/components/ShadowUI';
import { useShadowAlert } from '@/context/ShadowAlertContext';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { ShadowAlertProvider } from '@/context/ShadowAlertContext';

// Keep the splash visible until the navigation tree has mounted.
SplashScreen.preventAutoHideAsync().catch(() => undefined);

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { isLoading, hasError, retry } = useShadowAlert();

  if (isLoading) return <Screen><LoadingState /></Screen>;
  if (hasError) {
    return (
      <Screen>
        <EmptyState
          icon="alert-circle"
          title="Your space is resting"
          body="We couldn't open your saved data. It stays on this device."
          action={<PrimaryButton onPress={retry}>Try again</PrimaryButton>}
        />
      </Screen>
    );
  }

  return (
    <Stack screenOptions={{ headerBackTitle: 'Back', headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="app/[id]" options={{ presentation: 'card' }} />
      <Stack.Screen name="app/limit/[id]" options={{ presentation: 'modal' }} />
      <Stack.Screen name="block/[id]" options={{ presentation: 'fullScreenModal' }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => undefined);
  }, []);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ShadowAlertProvider>
          <ErrorBoundary>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <KeyboardProvider>
                <RootLayoutNav />
              </KeyboardProvider>
            </GestureHandlerRootView>
          </ErrorBoundary>
        </ShadowAlertProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
