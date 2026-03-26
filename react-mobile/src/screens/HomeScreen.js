import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';
import { GlassCard } from '../components/GlassCard';
import { colors } from '../theme/colors';

export function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <LinearGradient colors={['#2563EB', '#1E40AF']} style={styles.hero}>
          <Text style={styles.heroTag}>Plan Things 2.0</Text>
          <Text style={styles.heroTitle}>Sincronize a criatividade da sua equipe</Text>
          <Text style={styles.heroSub}>A versão mobile inspirada na homepage web.</Text>
        </LinearGradient>

        <GlassCard>
          <Text style={styles.cardTitle}>Funcionalidades</Text>
          <Text style={styles.cardText}>• Quadro Kanban com listas e cartões</Text>
          <Text style={styles.cardText}>• Acompanhamento de progresso por plano</Text>
          <Text style={styles.cardText}>• Perfil de usuário e edição rápida</Text>
        </GlassCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 14 },
  hero: { borderRadius: 18, padding: 20 },
  heroTag: { color: '#BFDBFE', fontWeight: '700' },
  heroTitle: { color: colors.textPrimary, fontSize: 24, fontWeight: '800', marginTop: 8 },
  heroSub: { color: '#DBEAFE', marginTop: 8 },
  cardTitle: { color: colors.textPrimary, fontWeight: '700', marginBottom: 8 },
  cardText: { color: colors.textSecondary, marginBottom: 4 }
});
