import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Screen } from '../components/Screen';
import { Card } from '../components/Card';
import { colors } from '../theme/colors';
import { useAuth } from '../contexts/AuthContext';

export function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>Meu perfil</Text>
        <Card style={{ gap: 8 }}>
          <Text style={styles.label}>Nome</Text>
          <Text style={styles.value}>{user?.nome} {user?.sobrenome || ''}</Text>
          <Text style={styles.label}>E-mail</Text>
          <Text style={styles.value}>{user?.email}</Text>
          <Text style={styles.label}>Telefone</Text>
          <Text style={styles.value}>{user?.telefone || 'Não informado'}</Text>
        </Card>

        <Pressable style={styles.button} onPress={logout}>
          <Text style={styles.buttonText}>Sair</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  title: { color: colors.text, fontSize: 24, fontWeight: '700' },
  label: { color: colors.muted, fontSize: 12, marginTop: 2 },
  value: { color: colors.text, fontSize: 16, fontWeight: '600' },
  button: { marginTop: 8, backgroundColor: colors.danger, padding: 14, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
});
