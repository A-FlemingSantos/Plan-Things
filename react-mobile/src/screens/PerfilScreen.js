import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export function PerfilScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.avatar}><Text style={styles.avatarText}>PT</Text></View>
        <Text style={styles.name}>Plan Things User</Text>
        <Text style={styles.email}>usuario@planthings.app</Text>

        <Pressable style={styles.button}><Text style={styles.buttonText}>Editar perfil</Text></Pressable>
        <Pressable style={styles.buttonDanger} onPress={() => navigation.replace('Auth')}>
          <Text style={styles.buttonText}>Sair</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  card: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 18, padding: 20, alignItems: 'center' },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.brandSoft, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.textPrimary, fontSize: 24, fontWeight: '700' },
  name: { color: colors.textPrimary, fontWeight: '700', fontSize: 20, marginTop: 12 },
  email: { color: colors.textSecondary, marginTop: 4, marginBottom: 20 },
  button: { backgroundColor: colors.brand, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 20, width: '100%', alignItems: 'center', marginBottom: 10 },
  buttonDanger: { backgroundColor: colors.danger, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 20, width: '100%', alignItems: 'center' },
  buttonText: { color: colors.textPrimary, fontWeight: '700' }
});
