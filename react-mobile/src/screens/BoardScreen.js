import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';
import { GlassCard } from '../components/GlassCard';
import { board } from '../data/mockData';
import { colors } from '../theme/colors';

export function BoardScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Board do Plano</Text>
        {board.map((coluna) => (
          <GlassCard key={coluna.id} style={styles.column}>
            <Text style={styles.columnTitle}>{coluna.titulo}</Text>
            {coluna.cards.map((card) => (
              <GlassCard key={card} style={styles.taskCard}>
                <Text style={styles.taskText}>{card}</Text>
              </GlassCard>
            ))}
          </GlassCard>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 12 },
  title: { color: colors.textPrimary, fontSize: 24, fontWeight: '800' },
  column: { gap: 8 },
  columnTitle: { color: colors.textPrimary, fontWeight: '700', marginBottom: 2 },
  taskCard: { backgroundColor: colors.elevated, borderColor: '#334155' },
  taskText: { color: colors.textSecondary }
});
