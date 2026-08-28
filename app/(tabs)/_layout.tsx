import { Tabs } from 'expo-router';
import { C, F } from '../../constants/theme';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: { backgroundColor:C.surface, borderTopColor:C.border, borderTopWidth:1, height:64, paddingBottom:10 },
      tabBarActiveTintColor: C.goldLight,
      tabBarInactiveTintColor: C.silver,
      tabBarLabelStyle: { fontFamily:F.cinzelBold, fontSize:9, letterSpacing:0.5 },
    }}>
      <Tabs.Screen name="index" options={{ title:'Home', tabBarIcon:({ color }) => <TabIcon emoji="🌾" color={color} /> }} />
      <Tabs.Screen name="year" options={{ title:'Year Plan', tabBarIcon:({ color }) => <TabIcon emoji="📅" color={color} /> }} />
      <Tabs.Screen name="free" options={{ title:'Free Play', tabBarIcon:({ color }) => <TabIcon emoji="📖" color={color} /> }} />
    </Tabs>
  );
}

function TabIcon({ emoji, color }: { emoji: string; color: string }) {
  const { Text } = require('react-native');
  return <Text style={{ fontSize:20, opacity: color === C.goldLight ? 1 : 0.5 }}>{emoji}</Text>;
}
