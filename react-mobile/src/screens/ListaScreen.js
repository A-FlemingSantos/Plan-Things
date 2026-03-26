import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export function ListaScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>Detalhe da Lista</Text>
        <Text style={styles.subtitle}>Lista em construção (paridade com a versão web).</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  box: { borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card, padding: 20 },
  title: { color: colors.textPrimary, fontWeight: '700', fontSize: 20 },
  subtitle: { color: colors.textSecondary, marginTop: 8 }
});
