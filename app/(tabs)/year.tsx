import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { supabase, getProgress, getCompletedDays } from '../../lib/supabase';
import { READING_PLAN } from '../../lib/plan';
import { C, F, SEC } from '../../constants/theme';
import { GhostButton, OrnateCard, ProgressBar, Chip } from '../../components/ui';

export default function YearPlanScreen() {
  const [currentDay, setCurrentDay] = useState(1);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [userId, setUserId] = useState('');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUserId(user.id);
    const [progress, days] = await Promise.allSettled([getProgress(user.id), getCompletedDays(user.id)]);
    if (progress.status==='fulfilled' && progress.value) setCurrentDay(progress.value.current_day);
    if (days.status==='fulfilled') setCompletedDays(days.value);
  };

  const completedSet = new Set(completedDays);
  const catchupDays = Array.from({length:currentDay-1},(_,i)=>i+1).filter(d=>!completedSet.has(d));
  const nextDay = catchupDays.length>0 ? catchupDays[0] : currentDay;
  const nextPlan = READING_PLAN[nextDay-1];

  return (
    <SafeAreaView style={{ flex:1, backgroundColor:C.bg }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bible in a Year</Text>
        <Text style={{ fontFamily:F.cinzel, fontSize:11, color:C.silver }}>Day {currentDay}/365</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding:16 }} showsVerticalScrollIndicator={false}>
        <OrnateCard style={{ marginBottom:20, overflow:'hidden' }}>
          <LinearGradient colors={[C.ot, C.nt, C.psalm, C.prov] as [string,string,string,string]} start={{x:0,y:0}} end={{x:1,y:0}} style={{ height:3 }} />
          <View style={{ padding:18 }}>
            <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
              <View>
                <Text style={styles.miniLabel}>{catchupDays.length>0 ? `Catch up — ${catchupDays.length} day${catchupDays.length!==1?'s':''} behind` : "Today's Reading"}</Text>
                <Text style={styles.dayNum}>Day {nextDay}</Text>
              </View>
              {completedSet.has(nextDay) && <Chip label="Done ✓" color={C.otLight} />}
            </View>
            <View style={{ flexDirection:'row', flexWrap:'wrap', gap:8, marginBottom:16 }}>
              {Object.entries(SEC).map(([k,s]) => {
                const ref = nextPlan?.[k as keyof typeof nextPlan] as { book:string; chapter:number } | undefined;
                return (
                  <View key={k} style={[styles.passagePill, { backgroundColor:s.bg, borderColor:s.color+'44' }]}>
                    <Text style={{ fontSize:14 }}>{s.icon}</Text>
                    <View>
                      <Text style={{ fontFamily:F.cinzelBold, fontSize:9, color:s.light }}>{s.abbr}</Text>
                      <Text style={{ fontFamily:F.crimson, fontSize:13, color:C.cream }}>{ref?.book} {ref?.chapter}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
            <TouchableOpacity onPress={() => router.push(`/session/${nextDay}`)} activeOpacity={0.85}>
              <LinearGradient colors={[C.gold, C.goldLight] as [string,string]} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.beginBtn}>
                <Text style={styles.beginBtnText}>{completedSet.has(nextDay) ? `Review Day ${nextDay}` : `Begin Day ${nextDay}`}  ✦</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </OrnateCard>

        {completedDays.length > 0 && (
          <View>
            <Text style={[styles.miniLabel, { marginBottom:12 }]}>Completed Days</Text>
            <View style={styles.daysGrid}>
              {Array.from({length:Math.min(currentDay,35)},(_,i)=>i+1).map(d => (
                <TouchableOpacity key={d} onPress={() => completedSet.has(d) && router.push(`/session/${d}`)} activeOpacity={completedSet.has(d)?0.7:1}
                  style={[styles.dayCell, { backgroundColor:completedSet.has(d)?C.ot+'25':C.surface, borderColor:completedSet.has(d)?C.ot+'66':C.border }]}>
                  <Text style={{ fontFamily:F.cinzel, fontSize:8, color:completedSet.has(d)?C.otLight:C.silver }}>{d}</Text>
                  {completedSet.has(d) && <Text style={{ fontSize:8 }}>✓</Text>}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
        <View style={{ height:40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header:      { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:16, height:54, borderBottomWidth:1, borderBottomColor:C.border, backgroundColor:C.surface },
  headerTitle: { fontFamily:F.cinzelBold, fontSize:15, color:C.cream },
  miniLabel:   { fontFamily:F.cinzel, fontSize:9, color:C.silver, textTransform:'uppercase', letterSpacing:1.8 },
  dayNum:      { fontFamily:F.cinzelBold, fontSize:22, color:C.cream, marginTop:2 },
  passagePill: { flexDirection:'row', alignItems:'center', gap:8, paddingVertical:8, paddingHorizontal:12, borderRadius:10, borderWidth:1, flex:1, minWidth:'45%' },
  beginBtn:    { borderRadius:10, paddingVertical:13, alignItems:'center' },
  beginBtnText:{ fontFamily:F.cinzelBold, fontSize:13, color:C.bg, letterSpacing:1 },
  daysGrid:    { flexDirection:'row', flexWrap:'wrap', gap:6 },
  dayCell:     { width:38, height:38, borderRadius:8, borderWidth:1, alignItems:'center', justifyContent:'center', gap:1 },
});
