import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { READING_PLAN } from '../lib/plan';
import { C, F, SEC } from '../constants/theme';
import { GoldButton } from '../components/ui';
import { BookArt } from '../components/BookArt';

export default function DayComplete() {
  const { day } = useLocalSearchParams<{ day:string }>();
  const dayNum = parseInt(day||'1',10);
  const plan = READING_PLAN[dayNum-1];

  return (
    <SafeAreaView style={{ flex:1, backgroundColor:C.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom:40 }}>
        <View style={styles.collage}>
          {Object.entries(SEC).map(([k,s]) => (
            <View key={k} style={{ flex:1, position:'relative', overflow:'hidden' }}>
              <BookArt bookName={(plan?.[k as keyof typeof plan] as any)?.book||'Psalms'} width={190} height={130} style={{ borderRadius:0 }} />
              <LinearGradient colors={['transparent', C.bg+'CC'] as [string,string]} style={StyleSheet.absoluteFillObject} />
              <View style={{ position:'absolute', bottom:6, left:0, right:0, alignItems:'center' }}>
                <Text style={{ fontFamily:F.cinzelBold, fontSize:8, color:s.light }}>{s.abbr}</Text>
              </View>
            </View>
          ))}
        </View>
        <Text style={styles.trophy}>🏆</Text>
        <Text style={styles.heading}>Day {dayNum} Complete!</Text>
        <Text style={styles.sub}>You have received your daily Manna. Well done.</Text>
        <View style={styles.passageList}>
          {Object.entries(SEC).map(([k,s]) => {
            const ref = plan?.[k as keyof typeof plan] as any;
            return (
              <View key={k} style={[styles.passageRow, { backgroundColor:s.bg, borderColor:s.color+'33' }]}>
                <Text style={{ fontSize:20 }}>{s.icon}</Text>
                <View style={{ flex:1 }}>
                  <Text style={{ fontFamily:F.cinzel, fontSize:9, color:s.light, letterSpacing:1, textTransform:'uppercase' }}>{s.label}</Text>
                  <Text style={{ fontFamily:F.crimsonSemi, fontSize:14, color:C.cream }}>{ref?.book} {ref?.chapter}</Text>
                </View>
                <Text style={{ fontSize:18 }}>✅</Text>
              </View>
            );
          })}
        </View>
        <View style={styles.statsGrid}>
          {([['🔥','Streak','+1 day'],['⚡','XP','+80'],['📖','Passages','4 read'],['📅','Progress',`Day ${dayNum}/365`]] as [string,string,string][]).map(([ico,lbl,val])=>(
            <View key={lbl} style={styles.statCard}>
              <Text style={{ fontSize:24, marginBottom:4 }}>{ico}</Text>
              <Text style={{ fontFamily:F.cinzelBold, fontSize:13, color:C.goldLight }}>{val}</Text>
              <Text style={{ fontFamily:F.cinzel, fontSize:9, color:C.silver, textTransform:'uppercase', letterSpacing:1, marginTop:2 }}>{lbl}</Text>
            </View>
          ))}
        </View>
        <View style={{ paddingHorizontal:16 }}>
          <GoldButton label="Back to Home  ✦" onPress={() => router.replace('/(tabs)')} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  collage:     { flexDirection:'row', flexWrap:'wrap', height:260 },
  trophy:      { fontSize:56, textAlign:'center', marginTop:20, marginBottom:8 },
  heading:     { fontFamily:F.cinzelBold, fontSize:26, color:C.goldLight, textAlign:'center', letterSpacing:1, marginBottom:6 },
  sub:         { fontFamily:F.crimsonItalic, fontSize:15, color:C.silver, textAlign:'center', marginBottom:24, paddingHorizontal:20 },
  passageList: { paddingHorizontal:16, gap:8, marginBottom:20 },
  passageRow:  { flexDirection:'row', alignItems:'center', gap:12, padding:12, borderRadius:12, borderWidth:1 },
  statsGrid:   { flexDirection:'row', flexWrap:'wrap', gap:10, paddingHorizontal:16, marginBottom:20 },
  statCard:    { flex:1, minWidth:'45%', backgroundColor:C.card, borderRadius:12, padding:14, alignItems:'center', borderWidth:1, borderColor:C.border },
});
