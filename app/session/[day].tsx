import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { supabase, upsertProgress, markDayComplete, getProgress, getCompletedDays } from '../lib/supabase';
import { READING_PLAN } from '../lib/plan';
import { fetchPassage, generateQuestions, getFallbackQuestions, Question, Passage } from '../lib/api';
import { C, F, SEC } from '../constants/theme';
import { ProgressBar, GoldButton, GhostButton, Spinner, OrnateCard } from '../components/ui';
import { BookArt } from '../components/BookArt';

const SECTIONS = ['ot','nt','psalm','prov'] as const;
type Section = typeof SECTIONS[number];

export default function DailySession() {
  const { day } = useLocalSearchParams<{ day:string }>();
  const dayNum = parseInt(day||'1', 10);
  const plan = READING_PLAN[dayNum-1];
  const [activeSec, setActiveSec] = useState(0);
  const [secState, setSecState] = useState<Record<string,string>>({});
  const [passages, setPassages] = useState<Record<string,Passage|null>>({});
  const [questions, setQuestions] = useState<Record<string,Question[]>>({});
  const [answers, setAnswers] = useState<Record<string,Record<number,any>>>({});
  const [revealed, setRevealed] = useState<Record<string,Record<number,boolean>>>({});
  const [xpAnim] = useState(new Animated.Value(0));
  const [showXP, setShowXP] = useState(false);

  const sec = SECTIONS[activeSec];
  const state = secState[sec]||'idle';
  const s = SEC[sec];
  const ref = plan?.[sec];
  const p = passages[sec];

  useEffect(() => {
    if (!secState[sec]) loadPassage(sec);
  }, [activeSec]);

  const loadPassage = async (key: Section) => {
    const r = plan[key];
    setSecState(prev=>({...prev,[key]:'loading-passage'}));
    const data = await fetchPassage(r.book, r.chapter);
    setPassages(prev=>({...prev,[key]:data||{ reference:`${r.book} ${r.chapter}`, verses:[], text:'', offline:true }}));
    setSecState(prev=>({...prev,[key]:'reading'}));
  };

  const loadQuestions = async () => {
    setSecState(prev=>({...prev,[sec]:'loading-q'}));
    const qs = p ? await generateQuestions(p.reference, p.text||'', p.verses?.length||20) : getFallbackQuestions(ref?.book||'');
    setQuestions(prev=>({...prev,[sec]:qs.length>0?qs:getFallbackQuestions(p?.reference||'')}));
    setSecState(prev=>({...prev,[sec]:'questions'}));
  };

  const handleAnswer = useCallback((qi:number, answer:any) => {
    if (answers[sec]?.[qi]!==undefined) return;
    setAnswers(a=>({...a,[sec]:{...(a[sec]||{}),[qi]:answer}}));
    setRevealed(r=>({...r,[sec]:{...(r[sec]||{}),[qi]:true}}));
    const q = questions[sec]?.[qi];
    const correct = q?.type==='mcq' ? answer===q.answer : q?.type==='tf' ? answer===q.answer : true;
    if (correct) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setShowXP(true);
      xpAnim.setValue(0);
      Animated.timing(xpAnim,{toValue:1,duration:800,useNativeDriver:true}).start(()=>setShowXP(false));
    } else if (q?.type!=='reflect') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, [sec, answers, questions]);

  const allRevealed = () => {
    const qs = questions[sec]||[];
    return qs.length>0 && qs.every((_,i)=>revealed[sec]?.[i]);
  };

  const advanceSection = async () => {
    setSecState(prev=>({...prev,[sec]:'done'}));
    if (activeSec < SECTIONS.length-1) {
      setActiveSec(i=>i+1);
    } else {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const [progress, completedDays] = await Promise.allSettled([getProgress(user.id), getCompletedDays(user.id)]);
          const currentProgress = progress.status==='fulfilled' ? progress.value : null;
          const days = completedDays.status==='fulfilled' ? completedDays.value : [];
          await markDayComplete(user.id, dayNum);
          await upsertProgress(user.id, {
            current_day: Math.max(currentProgress?.current_day||1, dayNum+1),
            streak: (currentProgress?.streak||0)+1,
            xp: (currentProgress?.xp||0)+80,
            last_read_at: new Date().toISOString(),
          });
        }
      } catch (err) { console.error('[progress] advanceSection:', err); }
      router.replace({ pathname:'/complete', params:{ day:dayNum } });
    }
  };

  return (
    <SafeAreaView style={{ flex:1, backgroundColor:C.bg }}>
      {showXP && (
        <Animated.View pointerEvents="none" style={[styles.xpBurst, {
          opacity: xpAnim.interpolate({inputRange:[0,0.3,1],outputRange:[0,1,0]}),
          transform: [{ translateY: xpAnim.interpolate({inputRange:[0,1],outputRange:[0,-60]}) }],
        }]}>
          <Text style={{ fontFamily:F.cinzelBold, fontSize:28, color:C.goldLight }}>+XP ✦</Text>
        </Animated.View>
      )}
      <View style={styles.header}>
        <GhostButton label="←" onPress={() => router.back()} style={{ paddingVertical:8, paddingHorizontal:12 }} />
        <View style={{ flex:1, paddingHorizontal:12 }}>
          <View style={{ flexDirection:'row', justifyContent:'space-between', marginBottom:5 }}>
            <Text style={{ fontFamily:F.cinzel, fontSize:10, color:C.silver }}>Day {dayNum} of 365</Text>
            <Text style={{ fontFamily:F.cinzel, fontSize:10, color:C.silver }}>{activeSec+1}/4</Text>
          </View>
          <ProgressBar value={SECTIONS.filter(k=>secState[k]==='done').length} max={4} color={C.gold} thin />
        </View>
      </View>
      <View style={styles.tabs}>
        {SECTIONS.map((k,i) => {
          const st = SEC[k];
          const done = secState[k]==='done';
          const active = i===activeSec;
          const locked = i>activeSec;
          return (
            <TouchableOpacity key={k} onPress={()=>!locked&&setActiveSec(i)} disabled={locked}
              style={[styles.tab, { borderBottomWidth:2, borderBottomColor:active?st.color:'transparent', opacity:locked?0.3:1 }]}>
              <Text style={{ fontSize:18 }}>{done?'✅':st.icon}</Text>
              <Text style={{ fontFamily:F.cinzelBold, fontSize:8, color:active?st.light:C.silver, letterSpacing:0.5 }}>{st.abbr}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <ScrollView contentContainerStyle={{ padding:16 }} showsVerticalScrollIndicator={false}>
        {state==='loading-passage' && (
          <View style={styles.centered}><Spinner size={36} color={s.light} /><Text style={styles.loadText}>Loading {ref?.book} {ref?.chapter}…</Text></View>
        )}
        {state==='reading' && p && (
          <View>
            <View style={[styles.bookBanner, { borderColor:s.color+'44' }]}>
              <BookArt bookName={ref?.book||'Genesis'} width={120} height={120} style={{ borderRadius:0 }} />
              <LinearGradient colors={['transparent', C.bg+'F0'] as [string,string]} style={StyleSheet.absoluteFillObject} />
              <View style={[styles.secBadge, { borderColor:s.color+'66' }]}>
                <Text style={{ fontSize:14 }}>{s.icon}</Text>
                <Text style={{ fontFamily:F.cinzelBold, fontSize:9, color:s.light, letterSpacing:1 }}>{s.label}</Text>
              </View>
              <View style={[styles.refBar, { backgroundColor:s.bg }]}>
                <Text style={styles.refTitle}>{p.reference}</Text>
              </View>
            </View>
            <OrnateCard style={{ padding:22, marginBottom:16, maxHeight:440 }}>
              <ScrollView showsVerticalScrollIndicator>
                {p.offline ? (
                  <View style={{ alignItems:'center', padding:20 }}>
                    <Text style={{ color:C.silver, fontSize:15, marginBottom:8 }}>📡 Passage unavailable offline.</Text>
                    <Text style={{ color:C.silver, fontSize:14, textAlign:'center' }}>Open your Bible to <Text style={{ color:C.cream }}>{p.reference}</Text>.</Text>
                  </View>
                ) : (
                  <Text style={styles.scriptureText}>
                    {(p.verses||[]).map(v => (
                      <Text key={v.num}><Text style={styles.verseNum}>{v.num} </Text><Text>{v.text} </Text></Text>
                    ))}
                  </Text>
                )}
              </ScrollView>
            </OrnateCard>
            <GoldButton label="I've Read This — Test Me  ✦" onPress={loadQuestions} />
          </View>
        )}
        {state==='loading-q' && (
          <View style={styles.centered}>
            <Spinner size={36} color={s.light} />
            <Text style={styles.loadText}>Manna is generating questions from {p?.reference}…</Text>
          </View>
        )}
        {state==='questions' && (
          <View>
            <View style={{ flexDirection:'row', alignItems:'center', gap:10, marginBottom:18 }}>
              <Text style={{ fontSize:20 }}>{s.icon}</Text>
              <View>
                <Text style={{ fontFamily:F.cinzel, fontSize:10, color:s.light, letterSpacing:1 }}>{s.label}</Text>
                <Text style={{ fontFamily:F.cinzelBold, fontSize:15, color:C.cream }}>{p?.reference}</Text>
              </View>
            </View>
            {(questions[sec]||[]).map((q,qi) => (
              <QCard key={qi} q={q} qi={qi} s={s}
                answer={answers[sec]?.[qi]} isRevealed={revealed[sec]?.[qi]}
                onAnswer={a=>handleAnswer(qi,a)} />
            ))}
            {allRevealed() && (
              <GoldButton
                label={activeSec<SECTIONS.length-1 ? `Next: ${SEC[SECTIONS[activeSec+1]].label}  →` : 'Complete Today\'s Reading  ✦'}
                onPress={advanceSection} style={{ marginTop:8 }} />
            )}
          </View>
        )}
        <View style={{ height:40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function QCard({ q, qi, s, answer, isRevealed, onAnswer }: any) {
  const [reflectText, setReflectText] = useState('');
  const [reflectDone, setReflectDone] = useState(false);
  const isCorrect = q.type==='mcq' ? answer===q.answer : q.type==='tf' ? answer===q.answer : true;
  return (
    <View style={[styles.qCard, { borderColor:isRevealed?(isCorrect?s.color+'55':C.border):C.border }]}>
      <View style={[styles.qHeader, { borderBottomColor:C.border }]}>
        <View style={[styles.qNum, { backgroundColor:s.color+'20', borderColor:s.color+'44' }]}>
          <Text style={{ fontFamily:F.cinzelBold, fontSize:11, color:s.light }}>{qi+1}</Text>
        </View>
        <View style={{ flex:1 }}>
          <Text style={{ fontFamily:F.cinzelBold, fontSize:9, color:s.light, letterSpacing:1, marginBottom:4 }}>
            {{mcq:'MULTIPLE CHOICE',tf:'TRUE OR FALSE',reflect:'REFLECTION'}[q.type]}
          </Text>
          <Text style={styles.qText}>{q.q}</Text>
        </View>
      </View>
      <View style={{ padding:14 }}>
        {q.type==='mcq' && (
          <View style={{ gap:8 }}>
            {q.opts?.map((opt:string, i:number) => {
              const isSel=answer===i, isAns=i===q.answer;
              let bg='transparent', border=C.border, textColor=C.cream;
              if (isRevealed) {
                if (isAns) { bg=C.successBg; border=C.success; textColor=C.otLight; }
                else if (isSel) { bg=C.errorBg; border=C.error; textColor='#E06060'; }
              }
              return (
                <TouchableOpacity key={i} onPress={()=>onAnswer(i)} disabled={!!isRevealed} activeOpacity={0.75}
                  style={[styles.optBtn, { backgroundColor:bg, borderColor:border }]}>
                  <View style={[styles.optLetter, { backgroundColor:s.color+'20', borderColor:s.color+'44' }]}>
                    <Text style={{ fontFamily:F.cinzelBold, fontSize:11, color:s.light }}>
                      {isRevealed&&isAns?'✓':isRevealed&&isSel?'✗':String.fromCharCode(65+i)}
                    </Text>
                  </View>
                  <Text style={[styles.optText, { color:textColor }]}>{opt}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
        {q.type==='tf' && (
          <View style={{ flexDirection:'row', gap:10 }}>
            {[true,false].map(val => {
              const isSel=answer===val, isAns=val===q.answer;
              let bg='transparent', border=C.border, textColor=C.cream;
              if (isRevealed) {
                if (isAns) { bg=C.successBg; border=C.success; textColor=C.otLight; }
                else if (isSel) { bg=C.errorBg; border=C.error; textColor='#E06060'; }
              }
              return (
                <TouchableOpacity key={String(val)} onPress={()=>onAnswer(val)} disabled={!!isRevealed} activeOpacity={0.75}
                  style={[styles.tfBtn, { backgroundColor:bg, borderColor:border, flex:1 }]}>
                  <Text style={{ fontFamily:F.cinzelBold, fontSize:15, color:textColor }}>{val?'✓ TRUE':'✗ FALSE'}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
        {q.type==='reflect' && (!reflectDone ? (
          <View style={{ gap:8 }}>
            <TextInput value={reflectText} onChangeText={setReflectText}
              placeholder="Take a moment to reflect…" placeholderTextColor="#2A3848"
              multiline style={styles.reflectInput} />
            <TouchableOpacity onPress={()=>{setReflectDone(true);onAnswer(reflectText||'(reflected)');}}
              style={[styles.reflectBtn, { borderColor:s.color+'55', backgroundColor:s.color+'15' }]}>
              <Text style={{ fontFamily:F.cinzelBold, fontSize:12, color:s.light }}>Submit Reflection</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.reflectDone, { backgroundColor:s.color+'12', borderColor:s.color+'33' }]}>
            <Text style={{ fontFamily:F.crimsonItalic, fontSize:14, color:C.creamDim, lineHeight:22 }}>{reflectText}</Text>
          </View>
        ))}
        {isRevealed && q.insight && (
          <View style={[styles.insight, { backgroundColor:s.color+'12', borderColor:s.color+'44' }]}>
            <Text style={{ fontSize:18 }}>💡</Text>
            <Text style={{ fontFamily:F.crimson, fontSize:14, color:C.creamDim, flex:1, lineHeight:22 }}>{q.insight}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header:       { flexDirection:'row', alignItems:'center', paddingHorizontal:16, height:54, borderBottomWidth:1, borderBottomColor:C.border, backgroundColor:C.surface },
  tabs:         { flexDirection:'row', backgroundColor:C.surface, borderBottomWidth:1, borderBottomColor:C.border },
  tab:          { flex:1, paddingVertical:10, alignItems:'center', gap:2 },
  centered:     { flex:1, alignItems:'center', justifyContent:'center', paddingVertical:80, gap:12 },
  loadText:     { fontFamily:F.crimsonItalic, fontSize:15, color:C.silver, textAlign:'center' },
  bookBanner:   { borderRadius:16, overflow:'hidden', borderWidth:1, marginBottom:16, position:'relative', height:120 },
  secBadge:     { position:'absolute', top:10, left:10, flexDirection:'row', alignItems:'center', gap:6, backgroundColor:'rgba(6,8,16,0.85)', borderRadius:8, borderWidth:1, paddingHorizontal:10, paddingVertical:5 },
  refBar:       { position:'absolute', bottom:0, left:0, right:0, padding:14 },
  refTitle:     { fontFamily:F.cinzelBold, fontSize:18, color:C.cream, letterSpacing:1 },
  scriptureText:{ fontFamily:F.crimson, fontSize:18, lineHeight:34, color:C.cream, letterSpacing:0.2 },
  verseNum:     { fontFamily:F.cinzelBold, fontSize:10, color:C.goldDim },
  xpBurst:      { position:'absolute', top:'40%', alignSelf:'center', zIndex:999 },
  qCard:        { backgroundColor:C.card, borderRadius:14, borderWidth:1, overflow:'hidden', marginBottom:18 },
  qHeader:      { flexDirection:'row', gap:12, alignItems:'flex-start', padding:16, borderBottomWidth:1 },
  qNum:         { width:28, height:28, borderRadius:7, alignItems:'center', justifyContent:'center', borderWidth:1, flexShrink:0 },
  qText:        { fontFamily:F.crimsonSemi, fontSize:17, color:C.cream, lineHeight:26 },
  optBtn:       { flexDirection:'row', alignItems:'center', gap:10, padding:12, borderRadius:10, borderWidth:1 },
  optLetter:    { width:26, height:26, borderRadius:7, alignItems:'center', justifyContent:'center', borderWidth:1, flexShrink:0 },
  optText:      { fontFamily:F.crimsonSemi, fontSize:15, flex:1, lineHeight:22 },
  tfBtn:        { padding:16, borderRadius:12, borderWidth:1, alignItems:'center' },
  reflectInput: { backgroundColor:C.surface, borderWidth:1, borderColor:C.border, borderRadius:10, padding:12, color:C.cream, fontFamily:F.crimsonItalic, fontSize:15, minHeight:88, textAlignVertical:'top', lineHeight:24 },
  reflectBtn:   { borderWidth:1, borderRadius:9, paddingVertical:10, paddingHorizontal:16, alignSelf:'flex-end' },
  reflectDone:  { borderWidth:1, borderRadius:10, padding:12 },
  insight:      { flexDirection:'row', gap:12, alignItems:'flex-start', borderWidth:1, borderRadius:11, padding:12, marginTop:12 },
});
