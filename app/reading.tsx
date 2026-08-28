import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { fetchPassage, generateQuestions, getFallbackQuestions, Question } from '../lib/api';
import { C, F } from '../constants/theme';
import { Spinner, GoldButton, GhostButton, OrnateCard } from '../components/ui';
import { BookArt } from '../components/BookArt';

export default function ReadingScreen() {
  const { book, chapter, color } = useLocalSearchParams<{ book:string; chapter:string; color:string }>();
  const [view, setView] = useState<'loading'|'reading'|'loading-q'|'questions'>('loading');
  const [passage, setPassage] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number,any>>({});
  const [revealed, setRevealed] = useState<Record<number,boolean>>({});
  const [xpAnim] = useState(new Animated.Value(0));
  const [showXP, setShowXP] = useState(false);

  useEffect(() => {
    fetchPassage(book||'Genesis', parseInt(chapter||'1',10)).then(p => {
      setPassage(p || { reference:`${book} ${chapter}`, verses:[], text:'', offline:true });
      setView('reading');
    });
  }, []);

  const loadQuestions = async () => {
    setView('loading-q');
    const qs = await generateQuestions(passage.reference, passage.text||'', passage.verses?.length||20);
    setQuestions(qs.length>0 ? qs : getFallbackQuestions(passage.reference));
    setAnswers({}); setRevealed({});
    setView('questions');
  };

  const handleAnswer = (qi: number, answer: any) => {
    if (answers[qi]!==undefined) return;
    setAnswers(a => ({...a,[qi]:answer}));
    setRevealed(r => ({...r,[qi]:true}));
    const q = questions[qi];
    const correct = q?.type==='mcq' ? answer===q.answer : q?.type==='tf' ? answer===q.answer : true;
    if (correct) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setShowXP(true);
      xpAnim.setValue(0);
      Animated.timing(xpAnim,{toValue:1,duration:800,useNativeDriver:true}).start(()=>setShowXP(false));
    } else if (q?.type!=='reflect') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const allDone = questions.length>0 && questions.every((_,i)=>revealed[i]);
  const accentColor = color||C.nt;

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
        <GhostButton label="←" onPress={() => view==='questions' ? setView('reading') : router.back()} style={{ paddingVertical:8, paddingHorizontal:12 }} />
        <Text style={styles.headerTitle} numberOfLines={1}>{passage?.reference||'…'}</Text>
        <View style={{ width:44 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding:16 }} showsVerticalScrollIndicator={false}>
        {view==='loading' && (
          <View style={styles.centered}><Spinner size={36} color={C.ntLight} /><Text style={styles.loadText}>Loading {book} {chapter}…</Text></View>
        )}
        {view==='reading' && passage && (
          <>
            <View style={[styles.hero, { borderColor:accentColor+'44' }]}>
              <BookArt bookName={book||'Genesis'} width={380} height={160} style={{ borderRadius:0 }} />
              <LinearGradient colors={['transparent', C.bg+'F2'] as [string,string]} style={StyleSheet.absoluteFillObject} />
              <View style={styles.heroContent}><Text style={styles.heroTitle}>{passage.reference}</Text></View>
            </View>
            <OrnateCard style={{ padding:22, marginBottom:16, maxHeight:480 }}>
              <ScrollView showsVerticalScrollIndicator>
                {passage.offline ? (
                  <View style={{ alignItems:'center', padding:20, gap:8 }}>
                    <Text style={{ color:C.silver, fontSize:15 }}>📡 Offline — open your Bible to <Text style={{ color:C.cream }}>{passage.reference}</Text>.</Text>
                  </View>
                ) : (
                  <Text style={styles.scripture}>
                    {(passage.verses||[]).map((v:any) => (
                      <Text key={v.num}><Text style={styles.verseNum}>{v.num} </Text><Text>{v.text} </Text></Text>
                    ))}
                  </Text>
                )}
              </ScrollView>
            </OrnateCard>
            <GoldButton label="I've Read This — Test Me  ✦" onPress={loadQuestions} />
          </>
        )}
        {view==='loading-q' && (
          <View style={styles.centered}>
            <Spinner size={36} color={C.ntLight} />
            <Text style={styles.loadText}>Manna is generating questions from {passage?.reference}…</Text>
          </View>
        )}
        {view==='questions' && (
          <>
            <Text style={{ fontFamily:F.cinzelBold, fontSize:15, color:C.cream, marginBottom:18 }}>{passage?.reference}</Text>
            {questions.map((q,qi) => (
              <QCard key={qi} q={q} qi={qi} accentColor={accentColor}
                answer={answers[qi]} isRevealed={revealed[qi]} onAnswer={a=>handleAnswer(qi,a)} />
            ))}
            {allDone && (
              <View style={{ gap:10, marginTop:8 }}>
                <GoldButton label="Read Another Chapter  ✦" onPress={() => router.back()} />
                <GhostButton label="Back to Library" onPress={() => router.push('/free')} />
              </View>
            )}
          </>
        )}
        <View style={{ height:40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function QCard({ q, qi, accentColor, answer, isRevealed, onAnswer }: any) {
  const [reflectText, setReflectText] = useState('');
  const [reflectDone, setReflectDone] = useState(false);
  const isCorrect = q.type==='mcq' ? answer===q.answer : q.type==='tf' ? answer===q.answer : true;
  return (
    <View style={[styles.qCard, { borderColor:isRevealed?(isCorrect?accentColor+'55':C.border):C.border, marginBottom:16 }]}>
      <View style={[styles.qHeader, { borderBottomColor:C.border }]}>
        <View style={[styles.qNum, { backgroundColor:accentColor+'20', borderColor:accentColor+'44' }]}>
          <Text style={{ fontFamily:F.cinzelBold, fontSize:11, color:accentColor }}>{qi+1}</Text>
        </View>
        <View style={{ flex:1 }}>
          <Text style={{ fontFamily:F.cinzelBold, fontSize:9, color:accentColor, letterSpacing:1, marginBottom:4 }}>
            {({mcq:'MULTIPLE CHOICE',tf:'TRUE OR FALSE',reflect:'REFLECTION'} as any)[q.type]}
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
                  <View style={[styles.optLetter, { backgroundColor:accentColor+'20', borderColor:accentColor+'44' }]}>
                    <Text style={{ fontFamily:F.cinzelBold, fontSize:11, color:accentColor }}>
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
            {([true,false] as boolean[]).map(val => {
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
              style={[styles.reflectBtn, { borderColor:accentColor+'55', backgroundColor:accentColor+'15' }]}>
              <Text style={{ fontFamily:F.cinzelBold, fontSize:12, color:accentColor }}>Submit Reflection</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.reflectDone, { backgroundColor:accentColor+'12', borderColor:accentColor+'33' }]}>
            <Text style={{ fontFamily:F.crimsonItalic, fontSize:14, color:C.creamDim, lineHeight:22 }}>{reflectText}</Text>
          </View>
        ))}
        {isRevealed && q.insight && (
          <View style={[styles.insight, { backgroundColor:accentColor+'12', borderColor:accentColor+'44' }]}>
            <Text style={{ fontSize:18 }}>💡</Text>
            <Text style={{ fontFamily:F.crimson, fontSize:14, color:C.creamDim, flex:1, lineHeight:22 }}>{q.insight}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header:       { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:16, height:54, borderBottomWidth:1, borderBottomColor:C.border, backgroundColor:C.surface },
  headerTitle:  { fontFamily:F.cinzelBold, fontSize:14, color:C.cream, flex:1, textAlign:'center', marginHorizontal:8 },
  centered:     { paddingVertical:80, alignItems:'center', gap:12 },
  loadText:     { fontFamily:F.crimsonItalic, fontSize:15, color:C.silver, textAlign:'center' },
  hero:         { borderRadius:14, overflow:'hidden', borderWidth:1, marginBottom:16, height:180, position:'relative' },
  heroContent:  { position:'absolute', bottom:0, left:0, right:0, padding:16 },
  heroTitle:    { fontFamily:F.cinzelBold, fontSize:19, color:C.cream, letterSpacing:1 },
  scripture:    { fontFamily:F.crimson, fontSize:18, lineHeight:34, color:C.cream, letterSpacing:0.2 },
  verseNum:     { fontFamily:F.cinzelBold, fontSize:10, color:C.goldDim },
  xpBurst:      { position:'absolute', top:'40%', alignSelf:'center', zIndex:999 },
  qCard:        { backgroundColor:C.card, borderRadius:14, borderWidth:1, overflow:'hidden' },
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
