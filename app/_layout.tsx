import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts, Cinzel_400Regular, Cinzel_700Bold, Cinzel_900Black } from '@expo-google-fonts/cinzel';
import { CrimsonPro_400Regular, CrimsonPro_400Regular_Italic, CrimsonPro_600SemiBold, CrimsonPro_700Bold } from '@expo-google-fonts/crimson-pro';
import { supabase } from '../lib/supabase';
import { C } from '../constants/theme';

export default function RootLayout() {
  const [session, setSession] = useState<'loading'|'authed'|'anon'>('loading');
  const [fontsLoaded] = useFonts({
    Cinzel_400Regular, Cinzel_700Bold, Cinzel_900Black,
    CrimsonPro_400Regular, CrimsonPro_400Regular_Italic,
    CrimsonPro_600SemiBold, CrimsonPro_700Bold,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session ? 'authed' : 'anon');
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session ? 'authed' : 'anon');
      if (session) router.replace('/(tabs)');
      else router.replace('/(auth)/login');
    });
    return () => subscription.unsubscribe();
  }, []);

  if (!fontsLoaded || session === 'loading') {
    return (
      <View style={{ flex:1, backgroundColor:C.bg, alignItems:'center', justifyContent:'center' }}>
        <ActivityIndicator color={C.gold} size="large" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex:1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown:false, contentStyle:{ backgroundColor:C.bg } }}>
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
