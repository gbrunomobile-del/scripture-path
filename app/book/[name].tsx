import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { C, F } from '../../constants/theme';
import { BookArt } from '../../components/BookArt';
import { GhostButton } from '../../components/ui';

export default function ChapterPickerScreen() {
  const { name, chapters, color } = useLocalSearchParams<{ name:string; chapters:string; color:string }>();
  const chapterCount = parseInt(chapters||'1', 10);

  return (
    <SafeAreaView style={{ flex:1, backgroundColor:C.bg }}>
      <View style={styles.header}>
        <GhostButton label="← Books" onPress={() => router.back()} style={{ paddingVertical:8, paddingHorizontal:14 }} />
        <Text style={styles.headerTitle}>{name}</Text>
        <View style={{ width:80 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding:16 }} showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, { borderColor:(color||C.nt)+'44' }]}>
          <BookArt bookName={name||'Genesis'} width={380} height={180} style={{ borderRadius:0 }} />
          <LinearGradient colors={['transparent', C.bg] as [string,string]} style={StyleSheet.absoluteFillObject} />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>{name}</Text>
            <Text style={styles.heroSub}>{chapterCount} chapter{chapterCount!==1?'s':''} — choose one to read</Text>
          </View>
        </View>
        <View style={styles.grid}>
          {Array.from({length:chapterCount},(_,i)=>i+1).map(ch => (
            <TouchableOpacity key={ch} activeOpacity={0.75}
              onPress={() => router.push({ pathname:'/reading', params:{ book:name, chapter:ch, color:color||C.nt }})}
              style={styles.chBtn}>
              <Text style={styles.chText}>{ch}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ height:40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header:      { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:16, height:54, borderBottomWidth:1, borderBottomColor:C.border, backgroundColor:C.surface },
  headerTitle: { fontFamily:F.cinzelBold, fontSize:15, color:C.cream },
  hero:        { borderRadius:16, overflow:'hidden', borderWidth:1, marginBottom:20, height:200, position:'relative' },
  heroContent: { position:'absolute', bottom:0, left:0, right:0, padding:16 },
  heroTitle:   { fontFamily:F.cinzelBold, fontSize:22, color:C.cream, letterSpacing:1, marginBottom:3 },
  heroSub:     { fontFamily:F.crimsonItalic, fontSize:13, color:C.silver },
  grid:        { flexDirection:'row', flexWrap:'wrap', gap:8 },
  chBtn:       { width:'14%', aspectRatio:1, borderRadius:9, backgroundColor:C.card, borderWidth:1, borderColor:C.border, alignItems:'center', justifyContent:'center' },
  chText:      { fontFamily:F.cinzelBold, fontSize:13, color:C.cream },
});
