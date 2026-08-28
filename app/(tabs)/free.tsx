import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { C, F, LIBRARY } from '../../constants/theme';
import { BookArt } from '../../components/BookArt';

export default function FreePlayScreen() {
  const [search, setSearch] = useState('');
  const allBooks = LIBRARY.flatMap(g => g.books.map(b => ({ ...b, color:g.color })));
  const filtered = search ? allBooks.filter(b => b.n.toLowerCase().includes(search.toLowerCase())) : null;

  return (
    <SafeAreaView style={{ flex:1, backgroundColor:C.bg }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Free Play</Text>
        <Text style={{ fontFamily:F.crimsonItalic, fontSize:13, color:C.silver }}>All 66 books</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding:16 }} showsVerticalScrollIndicator={false}>
        <View style={styles.searchWrap}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput value={search} onChangeText={setSearch} placeholder="Search any book…"
            placeholderTextColor="#2A3848" style={styles.searchInput} />
        </View>
        {search ? (
          <View style={styles.grid}>
            {(filtered||[]).map(b => (
              <TouchableOpacity key={b.n} onPress={() => router.push({ pathname:'/book/[name]', params:{ name:b.n, chapters:b.c, color:b.color }})} activeOpacity={0.8} style={styles.bookCard}>
                <BookArt bookName={b.n} width={160} height={100} style={{ borderRadius:0 }} />
                <View style={{ padding:10 }}>
                  <Text style={styles.bookTitle} numberOfLines={1}>{b.n}</Text>
                  <Text style={styles.bookSub}>{b.c} ch.</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : LIBRARY.map(group => (
          <View key={group.section} style={{ marginBottom:28 }}>
            <View style={[styles.sectionHeader, { borderLeftColor:group.color }]}>
              <Text style={[styles.sectionTitle, { color:group.color+'CC' }]}>{group.section}</Text>
            </View>
            <View style={styles.grid}>
              {group.books.map(b => (
                <TouchableOpacity key={b.n} onPress={() => router.push({ pathname:'/book/[name]', params:{ name:b.n, chapters:b.c, color:group.color }})} activeOpacity={0.8} style={styles.bookCard}>
                  <BookArt bookName={b.n} width={160} height={100} style={{ borderRadius:0 }} />
                  <View style={{ padding:10 }}>
                    <Text style={styles.bookTitle} numberOfLines={1}>{b.n}</Text>
                    <Text style={styles.bookSub}>{b.c} ch.</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
        <View style={{ height:40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header:        { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:16, height:54, borderBottomWidth:1, borderBottomColor:C.border, backgroundColor:C.surface },
  headerTitle:   { fontFamily:F.cinzelBold, fontSize:15, color:C.cream },
  searchWrap:    { flexDirection:'row', alignItems:'center', backgroundColor:C.card, borderRadius:12, borderWidth:1, borderColor:C.border, paddingHorizontal:14, marginBottom:20 },
  searchIcon:    { fontSize:16, marginRight:8 },
  searchInput:   { flex:1, paddingVertical:12, color:C.cream, fontFamily:F.crimson, fontSize:16 },
  sectionHeader: { borderLeftWidth:3, paddingLeft:10, marginBottom:12 },
  sectionTitle:  { fontFamily:F.cinzelBold, fontSize:11, letterSpacing:1.5, textTransform:'uppercase' },
  grid:          { flexDirection:'row', flexWrap:'wrap', gap:10 },
  bookCard:      { width:'47%', backgroundColor:C.card, borderRadius:12, borderWidth:1, borderColor:C.border, overflow:'hidden' },
  bookTitle:     { fontFamily:F.cinzelBold, fontSize:12, color:C.cream, marginBottom:2 },
  bookSub:       { fontFamily:F.crimson, fontSize:11, color:C.silver },
});
