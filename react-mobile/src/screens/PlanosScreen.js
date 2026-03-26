import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { GlassCard } from '../components/GlassCard';
import { planos } from '../data/mockData';
import { colors } from '../theme/colors';

export function PlanosScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Meus Planos</Text>
        {planos.map((plano) => (
          <GlassCard key={plano.id} style={styles.card}>
            <Text style={styles.name}>{plano.nome}</Text>
            <Text style={styles.desc}>{plano.descricao}</Text>
            <View style={styles.progressBar}><View style={[styles.progress, { width: `${plano.progresso}%` }]} /></View>
            <Text style={styles.progressLabel}>{plano.progresso}% concluído</Text>
          </GlassCard>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 12 },
  title: { color: colors.textPrimary, fontSize: 24, fontWeight: '800', marginBottom: 4 },
  card: { gap: 8 },
  name: { color: colors.textPrimary, fontSize: 16, fontWeight: '700' },
  desc: { color: colors.textSecondary },
  progressBar: { backgroundColor: colors.elevated, height: 8, borderRadius: 8 },
  progress: { backgroundColor: colors.brand, height: 8, borderRadius: 8 },
  progressLabel: { color: '#93C5FD', fontSize: 12 }
});
