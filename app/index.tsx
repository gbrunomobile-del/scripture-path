import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🌾 Manna: Daily Word</Text>
      <Text style={styles.sub}>App is working!</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#060810', alignItems: 'center', justifyContent: 'center' },
  title:     { color: '#DDB84A', fontSize: 28, fontWeight: 'bold', marginBottom: 12 },
  sub:       { color: '#8A9AAA', fontSize: 16 },
});
