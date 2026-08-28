import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { C, F } from '../constants/theme';

export function Spinner({ size = 24, color = C.gold }: { size?: number; color?: string }) {
  return <ActivityIndicator size={size > 30 ? 'large' : 'small'} color={color} />;
}

export function ProgressBar({ value, max, color = C.gold, thin = false }: { value: number; max: number; color?: string; thin?: boolean }) {
  const pct = Math.min(1, Math.max(0, value / max));
  return (
    <View style={{ height: thin ? 3 : 6, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 99, overflow: 'hidden' }}>
      <LinearGradient colors={[color, color + 'BB'] as [string,string]} start={{x:0,y:0}} end={{x:1,y:0}}
        style={{ width: `${pct * 100}%`, height: '100%', borderRadius: 99 }} />
    </View>
  );
}

export function Chip({ label, color = C.gold, small = false }: { label: string; color?: string; small?: boolean }) {
  return (
    <View style={{ backgroundColor: color+'20', borderRadius: 99, borderWidth: 1, borderColor: color+'44', paddingHorizontal: small?7:10, paddingVertical: small?2:3 }}>
      <Text style={{ color, fontSize: small?9:11, fontFamily: F.cinzelBold, letterSpacing: 0.5 }}>{label}</Text>
    </View>
  );
}

export function GoldButton({ label, onPress, disabled = false, style = {} }: { label: string; onPress: () => void; disabled?: boolean; style?: ViewStyle }) {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} activeOpacity={0.8} style={style}>
      <LinearGradient colors={disabled ? ['#4A3A10','#3A2C0A'] : [C.gold, C.goldLight] as [string,string]}
        start={{x:0,y:0}} end={{x:1,y:1}} style={styles.goldBtn}>
        <Text style={[styles.goldBtnText, { opacity: disabled ? 0.5 : 1 }]}>{label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

export function GhostButton({ label, onPress, style = {} }: { label: string; onPress: () => void; style?: ViewStyle }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}
      style={[{ borderWidth:1, borderColor:C.border, borderRadius:10, paddingVertical:11, paddingHorizontal:18, alignItems:'center' as const }, style]}>
      <Text style={{ color: C.silver, fontFamily: F.crimsonSemi, fontSize: 15 }}>{label}</Text>
    </TouchableOpacity>
  );
}

export function GoldDivider() {
  return (
    <View style={{ flexDirection:'row', alignItems:'center', marginVertical:18 }}>
      <View style={{ flex:1, height:1, backgroundColor:C.border }} />
      <Text style={{ color:C.goldDim, fontFamily:F.cinzel, marginHorizontal:12, fontSize:10 }}>✦</Text>
      <View style={{ flex:1, height:1, backgroundColor:C.border }} />
    </View>
  );
}

export function OrnateCard({ children, style = {} }: { children: React.ReactNode; style?: ViewStyle }) {
  return (
    <View style={[styles.ornateCard, style]}>
      <View style={styles.ornateInner} pointerEvents="none" />
      {children}
    </View>
  );
}

export function SectionLabel({ children, style = {} }: { children: string; style?: TextStyle }) {
  return (
    <Text style={[{ fontFamily:F.cinzel, fontSize:10, color:C.silver, textTransform:'uppercase', letterSpacing:2 }, style]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  goldBtn: { borderRadius:10, paddingVertical:14, paddingHorizontal:20, alignItems:'center', justifyContent:'center' },
  goldBtnText: { color:'#060810', fontFamily:F.cinzelBold, fontSize:13, letterSpacing:1, textTransform:'uppercase' },
  ornateCard: { backgroundColor:C.card, borderRadius:16, borderWidth:1, borderColor:C.border, overflow:'hidden', position:'relative' },
  ornateInner: { position:'absolute', top:4, left:4, right:4, bottom:4, borderRadius:13, borderWidth:1, borderColor:C.gold+'12', zIndex:0 },
});
