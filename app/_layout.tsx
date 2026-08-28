import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts, Cinzel_400Regular, Cinzel_700Bold, Cinzel_900Black } from '@expo-google-fonts/cinzel';
import { CrimsonPro_400Regular, CrimsonPro_400Regular_Italic, CrimsonPro_600SemiBold, CrimsonPro_700Bold } from '@expo-google-fonts/crimson-pro';

const BG = '#060810';
const GOLD = '#B8902A';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Cinzel_400Regular, Cinzel_700Bold, Cinzel_900Black,
    CrimsonPro_400Regular, CrimsonPro_400Regular_Italic,
    CrimsonPro_600SemiBold, CrimsonPro_700Bold,
  });

  useEffect(() => {
    if (!fontsLoaded) return;
    // Always go to login first — auth handled in login screen
    router.replace('/(auth)/login');
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: BG, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={GOLD} size="large" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: BG } }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="session/[day]" />
          <Stack.Screen name="complete" />
          <Stack.Screen name="book/[name]" />
          <Stack.Screen name="reading" />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
