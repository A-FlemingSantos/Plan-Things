import { View, Text, StyleSheet, Pressable, Switch } from 'react-native';
import { useMemo } from 'react';
import { Screen } from '../components/Screen';
import { Card } from '../components/Card';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export function ProfileScreen() {
  const { user, logout } = useAuth();
  const { colors, mode, toggleTheme } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { padding: 20, gap: 16 },
        title: { color: colors.text, fontSize: 26, fontWeight: '800', letterSpacing: -0.5, marginBottom: 8 },
        label: { color: colors.muted, fontSize: 13, marginTop: 4, fontWeight: '600' },
        value: { color: colors.text, fontSize: 18, fontWeight: '700', marginBottom: 8 },
        row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
        button: { marginTop: 16, backgroundColor: colors.danger, padding: 16, borderRadius: 14, alignItems: 'center', shadowColor: colors.danger, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 6, elevation: 4 },
        buttonText: { color: '#ffffff', fontWeight: '800', fontSize: 16, letterSpacing: 0.3 },
      }),
    [colors]
  );

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

        <Card style={{ gap: 10 }}>
          <View style={styles.row}>
            <View>
              <Text style={styles.label}>Tema</Text>
              <Text style={styles.value}>{mode === 'dark' ? 'Escuro' : 'Claro'}</Text>
            </View>
            <Switch
              value={mode === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={mode === 'dark' ? colors.surfaceSoft : colors.surface}
            />
          </View>
        </Card>

        <Pressable style={styles.button} onPress={logout}>
          <Text style={styles.buttonText}>Sair</Text>
        </Pressable>
      </View>
    </Screen>
  );
}
