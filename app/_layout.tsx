import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SettingsProvider } from '@/context/SettingsContext';
import { useTheme } from '@/hooks/useTheme';
import { useUserSync } from '@/hooks/useUserSync';
import { StatusBar } from 'expo-status-bar';
import '@/services/i18n';

SplashScreen.preventAutoHideAsync();

function LayoutContent() {
  const { isDark, colors } = useTheme();
  useUserSync();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <NavigationThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="preview" />
          <Stack.Screen name="settings" />
        </Stack>
      </NavigationThemeProvider>
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'NeoSans': require('../assets/fonts/Neo Sans Std Regular.otf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SettingsProvider>
        <LayoutContent />
      </SettingsProvider>
    </GestureHandlerRootView>
  );
}