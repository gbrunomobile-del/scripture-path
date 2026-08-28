import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  useFonts,
  Cinzel_400Regular,
  Cinzel_700Bold,
  Cinzel_900Black,
} from '@expo-google-fonts/cinzel';
import {
  CrimsonPro_400Regular,
  CrimsonPro_400Regular_Italic,
  CrimsonPro_600SemiBold,
  CrimsonPro_700Bold,
} from '@expo-google-fonts/crimson-pro';

// Use a safe Supabase import with fallback
let supabase: any = null;
try {
  supabase = require('../lib/supabase').supabase;
} catch (e) {
  console.error('[layout] supabase import failed:', e);
}

const C = { bg: '#060810', gold: '#B8902A' };

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState<boolean | null>(null);

  const [fontsLoaded, fontError] = useFonts({
    Cinzel_400Regular,
    Cinzel_700Bold,
    Cinzel_900Black,
    CrimsonPro_400Regular,
    CrimsonPro_400Regular_Italic,
    CrimsonPro_600SemiBold,
    CrimsonPro_700Bold,
  });

  useEffect(() => {
    if (!fontsLoaded && !fontError) return;

    // Check auth state
    const checkAuth = async () => {
      try {
        if (!supabase) {
          setAuthed(false);
          setReady(true);
          return;
        }
        const { data: { session } } = await supabase.auth.getSession();
        setAuthed(!!session);
      } catch (e) {
        console.error('[layout] auth check failed:', e);
        setAuthed(false);
      } finally {
        setReady(true);
      }
    };

    checkAuth();
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    if (!ready) return;
    if (authed) {
      router.replace('/(tabs)');
    } else {
      router.replace('/(auth)/login');
    }
  }, [ready, authed]);

  // Listen for auth changes
  useEffect(() => {
    if (!supabase) return;
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: string, session: any) => {
        if (session) {
          router.replace('/(tabs)');
        } else {
          router.replace('/(auth)/login');
        }
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={C.gold} size="large" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: C.bg } }}>
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
