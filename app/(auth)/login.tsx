import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { C, F, APP } from '../../constants/theme';
import { GoldDivider } from '../../components/ui';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.includes('@')) { setError('Please enter a valid email address.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setError(''); setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) setError(err.message);
  };

  return (
    <SafeAreaView style={{ flex:1, backgroundColor:C.bg }}>
      <KeyboardAvoidingView style={{ flex:1 }} behavior={Platform.OS==='ios'?'padding':undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.logoArea}>
            <Text style={styles.mannaIcon}>🌾</Text>
            <Text style={styles.appName}>{APP.name}</Text>
            <Text style={styles.tagline}>{APP.tagline}</Text>
            <View style={styles.ornamentRow}>
              <View style={styles.ornamentLine} />
              <Text style={styles.ornamentStars}>✦ ✦ ✦</Text>
              <View style={styles.ornamentLine} />
            </View>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Welcome Back</Text>
            <GoldDivider />
            <View style={styles.field}>
              <Text style={styles.label}>EMAIL ADDRESS</Text>
              <TextInput style={styles.input} value={email} onChangeText={setEmail}
                placeholder="you@example.com" placeholderTextColor="#2A3848"
                keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>PASSWORD</Text>
              <View style={{ position:'relative' }}>
                <TextInput style={styles.input} value={password} onChangeText={setPassword}
                  placeholder="••••••••" placeholderTextColor="#2A3848"
                  secureTextEntry={!showPass} autoCapitalize="none" />
                <TouchableOpacity onPress={() => setShowPass(s=>!s)} style={{ position:'absolute', right:14, top:13 }}>
                  <Text style={{ color:C.silver, fontSize:16 }}>{showPass?'🙈':'👁'}</Text>
                </TouchableOpacity>
              </View>
            </View>
            {!!error && <View style={styles.errorBox}><Text style={styles.errorText}>⚠ {error}</Text></View>}
            <TouchableOpacity onPress={handleLogin} disabled={loading} activeOpacity={0.85} style={{ marginTop:12 }}>
              <LinearGradient colors={[C.gold, C.goldLight] as [string,string]} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.submitBtn}>
                {loading ? <ActivityIndicator color={C.bg} size="small" /> : <Text style={styles.submitText}>Enter  ✦</Text>}
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <View style={styles.switchRow}>
            <Text style={{ color:C.silver, fontFamily:F.crimson, fontSize:14 }}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={{ color:C.goldLight, fontFamily:F.cinzelBold, fontSize:13 }}>Create one</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:     { flexGrow:1, padding:20, paddingBottom:40, justifyContent:'center' },
  logoArea:      { alignItems:'center', marginBottom:32 },
  mannaIcon:     { fontSize:52, marginBottom:10 },
  appName:       { fontFamily:F.cinzelBlack, fontSize:26, color:C.goldLight, letterSpacing:2, marginBottom:4, textAlign:'center' },
  tagline:       { fontFamily:F.crimsonItalic, fontSize:14, color:C.silver, letterSpacing:1 },
  ornamentRow:   { flexDirection:'row', alignItems:'center', marginTop:12, width:220 },
  ornamentLine:  { flex:1, height:1, backgroundColor:C.border },
  ornamentStars: { color:C.goldDim, fontFamily:F.cinzel, fontSize:12, marginHorizontal:10 },
  card:          { backgroundColor:C.card, borderRadius:20, padding:24, borderWidth:1, borderColor:C.border },
  cardTitle:     { fontFamily:F.cinzelBold, fontSize:18, color:C.cream, textAlign:'center', letterSpacing:1 },
  field:         { marginBottom:14 },
  label:         { fontFamily:F.cinzelBold, fontSize:9, color:C.silver, letterSpacing:1.5, marginBottom:6 },
  input:         { backgroundColor:C.surface, borderWidth:1, borderColor:C.border, borderRadius:11, paddingHorizontal:16, paddingVertical:12, color:C.cream, fontFamily:F.crimson, fontSize:16 },
  errorBox:      { backgroundColor:C.errorBg, borderRadius:10, borderWidth:1, borderColor:C.error+'44', padding:12, marginBottom:10 },
  errorText:     { color:'#E06060', fontFamily:F.crimson, fontSize:13 },
  submitBtn:     { borderRadius:10, paddingVertical:14, alignItems:'center' },
  submitText:    { fontFamily:F.cinzelBold, fontSize:14, color:C.bg, letterSpacing:1 },
  switchRow:     { flexDirection:'row', justifyContent:'center', marginTop:20 },
});
