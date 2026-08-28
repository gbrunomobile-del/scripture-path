import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const C = { bg:'#060810', surface:'#0A0E1A', card:'#0D1220', border:'#1A2540', gold:'#B8902A', goldLight:'#DDB84A', goldDim:'#6A5015', silver:'#8A9AAA', cream:'#EDE0C0', error:'#602020', errorBg:'#100606' };
const F = { cinzelBold:'Cinzel_700Bold', cinzelBlack:'Cinzel_900Black', crimson:'CrimsonPro_400Regular', crimsonItalic:'CrimsonPro_400Regular_Italic', crimsonSemi:'CrimsonPro_600SemiBold' };

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.includes('@')) { setError('Please enter a valid email address.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setError(''); setLoading(true);

    try {
      // Try Supabase first
      const { supabase } = require('../../lib/supabase');
      const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) {
        // If email not confirmed, still let them in for testing
        if (err.message?.includes('Email not confirmed')) {
          await AsyncStorage.setItem('manna_user', JSON.stringify({ email, name: email.split('@')[0] }));
          router.replace('/(tabs)');
          return;
        }
        setError(err.message);
      } else if (data.session) {
        router.replace('/(tabs)');
      }
    } catch (e) {
      // Fallback: local auth for testing
      await AsyncStorage.setItem('manna_user', JSON.stringify({ email, name: email.split('@')[0] }));
      router.replace('/(tabs)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex:1, backgroundColor:C.bg }}>
      <KeyboardAvoidingView style={{ flex:1 }} behavior={Platform.OS==='ios'?'padding':undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.logoArea}>
            <Text style={styles.mannaIcon}>🌾</Text>
            <Text style={styles.appName}>Manna: Daily Word</Text>
            <Text style={styles.tagline}>Read. Understand. Remember.</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Welcome</Text>
            <View style={{ height:1, backgroundColor:C.border, marginVertical:20 }} />
            <View style={styles.field}>
              <Text style={styles.label}>EMAIL ADDRESS</Text>
              <TextInput style={styles.input} value={email} onChangeText={setEmail}
                placeholder="you@example.com" placeholderTextColor="#2A3848"
                keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>PASSWORD</Text>
              <TextInput style={styles.input} value={password} onChangeText={setPassword}
                placeholder="••••••••" placeholderTextColor="#2A3848"
                secureTextEntry autoCapitalize="none" />
            </View>
            {!!error && <View style={styles.errorBox}><Text style={styles.errorText}>⚠ {error}</Text></View>}
            <TouchableOpacity onPress={handleLogin} disabled={loading} activeOpacity={0.85} style={{ marginTop:12 }}>
              <LinearGradient colors={[C.gold, C.goldLight] as [string,string]} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.submitBtn}>
                {loading ? <ActivityIndicator color={C.bg} size="small" /> : <Text style={styles.submitText}>Enter  ✦</Text>}
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <View style={styles.switchRow}>
            <Text style={{ color:C.silver, fontSize:14 }}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={{ color:C.goldLight, fontSize:13 }}>Create one</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:  { flexGrow:1, padding:20, paddingBottom:40, justifyContent:'center' },
  logoArea:   { alignItems:'center', marginBottom:32 },
  mannaIcon:  { fontSize:52, marginBottom:10 },
  appName:    { fontSize:24, color:C.goldLight, letterSpacing:2, marginBottom:4, textAlign:'center', fontWeight:'bold' },
  tagline:    { fontSize:14, color:C.silver, fontStyle:'italic' },
  card:       { backgroundColor:C.card, borderRadius:20, padding:24, borderWidth:1, borderColor:C.border },
  cardTitle:  { fontSize:18, color:C.cream, textAlign:'center', letterSpacing:1, fontWeight:'bold' },
  field:      { marginBottom:14 },
  label:      { fontSize:10, color:C.silver, letterSpacing:1.5, marginBottom:6, fontWeight:'bold' },
  input:      { backgroundColor:C.surface, borderWidth:1, borderColor:C.border, borderRadius:11, paddingHorizontal:16, paddingVertical:12, color:C.cream, fontSize:16 },
  errorBox:   { backgroundColor:C.errorBg, borderRadius:10, borderWidth:1, borderColor:C.error+'44', padding:12, marginBottom:10 },
  errorText:  { color:'#E06060', fontSize:13 },
  submitBtn:  { borderRadius:10, paddingVertical:14, alignItems:'center' },
  submitText: { fontSize:14, color:C.bg, letterSpacing:1, fontWeight:'bold' },
  switchRow:  { flexDirection:'row', justifyContent:'center', marginTop:20 },
});
