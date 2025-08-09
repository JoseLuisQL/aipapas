import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider, ActivityIndicator } from 'react-native-paper';
import { theme } from './src/theme/theme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { View } from 'react-native';
import { prepareDatabase } from './src/db';
import RootNavigator from './src/navigation/RootNavigator';
import { useSync } from './src/hooks/useSync';

const queryClient = new QueryClient();


export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await prepareDatabase();
      } finally {
        setReady(true);
      }
    })();
  }, []);

  useSync();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            <NavigationContainer>
              {ready ? (
                <RootNavigator />
              ) : (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <ActivityIndicator />
                </View>
              )}
              <StatusBar style="auto" />
            </NavigationContainer>
          </QueryClientProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
