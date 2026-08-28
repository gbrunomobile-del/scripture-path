import React from 'react';
import { View } from 'react-native';
import Svg, { Rect, Circle, Line, Path, Ellipse, Text as SvgText, Defs, RadialGradient, Stop } from 'react-native-svg';
import { C, BOOK_VISUAL } from '../constants/theme';

export function BookArt({ bookName, width = 120, height = 160, style = {} }: { bookName: string; width?: number; height?: number; style?: object }) {
  const v = BOOK_VISUAL[bookName] ?? { symbol:'✦', label:'MANNA', accent:C.gold };
  const cx = width / 2, cy = height / 2;

  const hatchH = Array.from({ length: 18 }, (_, i) => (
    <Line key={`h${i}`} x1="0" y1={i*(height/18)} x2={width} y2={i*(height/18)} stroke={C.gold} strokeWidth="0.4" opacity="0.05" />
  ));
  const rays = Array.from({ length: 11 }, (_, i) => {
    const angle = (-50 + i*10) * (Math.PI/180) - Math.PI/2;
    return <Line key={`r${i}`} x1={cx} y1={height*0.2} x2={cx + Math.cos(angle)*130} y2={height*0.2 + Math.sin(angle)*130}
      stroke={C.gold} strokeWidth="0.7" opacity={Math.max(0, 0.13 - Math.abs(i-5)*0.018)} />;
  });

  return (
    <View style={[{ width, height, overflow:'hidden', borderRadius:10 }, style]}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Defs>
          <RadialGradient id="bg" cx="50%" cy="35%" r="70%">
            <Stop offset="0%" stopColor="#0D1A2E" />
            <Stop offset="100%" stopColor="#060810" />
          </RadialGradient>
          <RadialGradient id="glow" cx="50%" cy="25%" r="45%">
            <Stop offset="0%" stopColor={v.accent} stopOpacity="0.2" />
            <Stop offset="100%" stopColor={v.accent} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect width={width} height={height} fill="url(#bg)" />
        {hatchH}
        <Rect width={width} height={height} fill="url(#glow)" />
        {rays}
        {[0.42, 0.34, 0.27].map((r, i) => (
          <Circle key={i} cx={cx} cy={cy} r={width*r} fill="none" stroke={C.gold}
            strokeWidth={0.4-i*0.1} opacity={0.1-i*0.02} strokeDasharray={i===1?'3 6':undefined} />
        ))}
        <Rect x="4" y="4" width={width-8} height={height-8} rx="6" fill="none" stroke={C.gold} strokeWidth="0.8" opacity="0.4" />
        <Path d={`M 8,8 L 22,8 M 8,8 L 8,22`} fill="none" stroke={C.gold} strokeWidth="1.2" opacity="0.55" />
        <Path d={`M ${width-8},8 L ${width-22},8 M ${width-8},8 L ${width-8},22`} fill="none" stroke={C.gold} strokeWidth="1.2" opacity="0.55" />
        <Path d={`M 8,${height-8} L 22,${height-8} M 8,${height-8} L 8,${height-22}`} fill="none" stroke={C.gold} strokeWidth="1.2" opacity="0.55" />
        <Path d={`M ${width-8},${height-8} L ${width-22},${height-8} M ${width-8},${height-8} L ${width-8},${height-22}`} fill="none" stroke={C.gold} strokeWidth="1.2" opacity="0.55" />
        <Ellipse cx={cx} cy={height*0.2} rx={width*0.12} ry={height*0.06} fill="rgba(184,144,42,0.06)" stroke={C.gold} strokeWidth="0.7" opacity="0.5" />
        <Circle cx={cx} cy={height*0.2} r={width*0.04} fill={C.gold} opacity="0.3" />
        <SvgText x={cx} y={cy+8} textAnchor="middle" fontFamily="serif" fontSize={width*0.18} fill={v.accent} opacity="0.5">{v.symbol}</SvgText>
        <Line x1={width*0.15} y1={cy+height*0.18} x2={width*0.85} y2={cy+height*0.18} stroke={C.gold} strokeWidth="0.7" opacity="0.35" />
        <SvgText x={cx} y={cy+height*0.3} textAnchor="middle" fontFamily="serif" fontSize={width*0.065} fontWeight="bold" fill={C.goldLight} opacity="0.9" letterSpacing="2">
          {bookName.toUpperCase().slice(0,12)}
        </SvgText>
        <SvgText x={cx} y={cy+height*0.38} textAnchor="middle" fontFamily="serif" fontSize={width*0.045} fill={C.engBluePale} opacity="0.65" letterSpacing="1.5">
          {v.label}
        </SvgText>
      </Svg>
    </View>
  );
}
