import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { getProgress, getCompletedDays } from '../../lib/supabase';
import { READING_PLAN } from '../../lib/plan';
import { C, F, SEC, APP } from '../../constants/theme';
import { ProgressBar, OrnateCard, SectionLabel } from '../../components/ui';

const QUOTES = [
  'Your word is a lamp to my feet — Psalm 119:105',
  'Let the word of Christ dwell in you richly — Colossians 3:16',
  'Man shall not live by bread alone — Matthew 4:4',
];

export default function HomeScreen() {
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  const [currentDay, setCurrentDay] = useState(1);
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [completedDays, setCompletedDays] = useState<number[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: { user: u } } = await supabase.auth.getUser();
    if (!u) return;
    const name = u.user_metadata?.name || u.email?.split('@')[0] || 'Friend';
    setUser({ id: u.id, name });
    const [progress, days] = await Promise.allSettled([getProgress(u.id), getCompletedDays(u.id)]);
    if (progress.status === 'fulfilled' && progress.value) {
      setCurrentDay(progress.value.current_day);
      setStreak(progress.value.streak);
      setXp(progress.value.xp);
    }
    if (days.status === 'fulfilled') setCompletedDays(days.value);
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const daysDone = completedDays.length;

  return (
    <SafeAreaView style={{ flex:1, backgroundColor:C.bg }}>
      <View style={styles.header}>
        <View style={{ flexDirection:'row', alignItems:'center', gap:8 }}>
          <Text style={{ fontSize:20 }}>🌾</Text>
          <Text style={styles.headerTitle}>Manna</Text>
        </View>
        <View style={{ flexDirection:'row', alignItems:'center', gap:14 }}>
          <Text style={{ color:'#FF6B35', fontFamily:F.cinzelBold, fontSize:13 }}>🔥 {streak}</Text>
          <Text style={{ color:C.goldLight, fontFamily:F.cinzelBold, fontSize:13 }}>⚡ {xp}</Text>
          <TouchableOpacity onPress={() => supabase.auth.signOut()}>
            <LinearGradient colors={[C.gold, C.goldLight] as [string,string]} style={styles.avatar}>
              <Text style={{ fontFamily:F.cinzelBold, fontSize:13, color:C.bg }}>{(user?.name||'?')[0].toUpperCase()}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={{ marginBottom:24 }}>
          <Text style={styles.greetingLabel}>{greeting}</Text>
          <Text style={styles.greetingName}>{user?.name}  ✦</Text>
          <Text style={styles.quote}>"{QUOTES[new Date().getDay() % 3]}"</Text>
        </View>

        <OrnateCard style={{ padding:18, marginBottom:16 }}>
          <View style={{ flexDirection:'row', justifyContent:'space-between', marginBottom:10 }}>
            <SectionLabel>Year Progress</SectionLabel>
            <Text style={{ fontFamily:F.cinzelBold, fontSize:12, color:C.goldLight }}>Day {currentDay} / 365</Text>
          </View>
          <ProgressBar value={daysDone} max={365} />
          <View style={{ flexDirection:'row', justifyContent:'space-between', marginTop:8 }}>
            <Text style={styles.smallGray}>{daysDone} days complete</Text>
            <Text style={styles.smallGray}>{Math.round(daysDone/365*100)}%</Text>
          </View>
        </OrnateCard>

        <SectionLabel style={{ marginBottom:12 }}>Choose Your Session</SectionLabel>

        <TouchableOpacity activeOpacity={0.85} onPress={() => router.push('/year')} style={{ marginBottom:14 }}>
          <LinearGradient colors={['#0D1A12','#080E10'] as [string,string]} start={{x:0,y:0}} end={{x:1,y:1}}
            style={[styles.modeCard, { borderColor:C.ot+'55' }]}>
            <LinearGradient colors={[C.ot, C.otLight, 'transparent'] as [string,string,string]} start={{x:0,y:0}} end={{x:1,y:0}} style={styles.modeCardBar} />
            <View style={{ flexDirection:'row', gap:14, alignItems:'flex-start', marginBottom:12 }}>
              <View style={[styles.modeIcon, { backgroundColor:C.ot+'30' }]}><Text style={{ fontSize:24 }}>📅</Text></View>
              <View style={{ flex:1 }}>
                <Text style={styles.modeTitle}>Bible in a Year</Text>
                <Text style={styles.modeDesc}>Structured 365-day plan. OT · NT · Psalm · Proverb daily. AI questions from what you just read.</Text>
              </View>
            </View>
            <View style={{ flexDirection:'row', gap:6 }}>
              {Object.entries(SEC).map(([k,s]) => (
                <View key={k} style={[styles.secPill, { backgroundColor:s.color+'18', borderColor:s.color+'33' }]}>
                  <Text style={{ fontSize:11 }}>{s.icon}</Text>
                  <Text style={{ fontFamily:F.cinzelBold, fontSize:7, color:s.light }}>{s.abbr}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.85} onPress={() => router.push('/free')}>
          <LinearGradient colors={['#0A0E1A','#060810'] as [string,string]} start={{x:0,y:0}} end={{x:1,y:1}}
            style={[styles.modeCard, { borderColor:C.nt+'44' }]}>
            <LinearGradient colors={[C.nt, C.ntLight, 'transparent'] as [string,string,string]} start={{x:0,y:0}} end={{x:1,y:0}} style={styles.modeCardBar} />
            <View style={{ flexDirection:'row', gap:14, alignItems:'flex-start' }}>
              <View style={[styles.modeIcon, { backgroundColor:C.nt+'30' }]}><Text style={{ fontSize:24 }}>📖</Text></View>
              <View style={{ flex:1 }}>
                <Text style={styles.modeTitle}>Free Play</Text>
                <Text style={styles.modeDesc}>Browse all 66 books freely. Read any chapter, then answer AI questions on exactly what you just read.</Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
        <View style={{ height:40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header:       { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:18, height:56, borderBottomWidth:1, borderBottomColor:C.border, backgroundColor:C.surface },
  headerTitle:  { fontFamily:F.cinzelBold, fontSize:18, color:C.goldLight, letterSpacing:2 },
  avatar:       { width:32, height:32, borderRadius:16, alignItems:'center', justifyContent:'center' },
  scroll:       { paddingHorizontal:16, paddingTop:20 },
  greetingLabel:{ fontFamily:F.cinzel, fontSize:11, color:C.silver, textTransform:'uppercase', letterSpacing:2, marginBottom:4 },
  greetingName: { fontFamily:F.cinzelBold, fontSize:24, color:C.cream, marginBottom:6 },
  quote:        { fontFamily:F.crimsonItalic, fontSize:14, color:C.silver, lineHeight:22 },
  smallGray:    { fontFamily:F.crimson, fontSize:12, color:C.silver },
  modeCard:     { borderRadius:18, borderWidth:1.5, padding:18, overflow:'hidden', position:'relative' },
  modeCardBar:  { position:'absolute', top:0, left:0, right:0, height:3 },
  modeIcon:     { width:50, height:50, borderRadius:14, alignItems:'center', justifyContent:'center' },
  modeTitle:    { fontFamily:F.cinzelBold, fontSize:16, color:C.cream, marginBottom:4 },
  modeDesc:     { fontFamily:F.crimson, fontSize:14, color:C.silver, lineHeight:22 },
  secPill:      { flex:1, borderRadius:8, borderWidth:1, paddingVertical:6, alignItems:'center', gap:2 },
});
