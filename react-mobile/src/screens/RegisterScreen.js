import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { Screen } from '../components/Screen';
import { colors } from '../theme/colors';
import { api, normalizeError } from '../services/api';

export function RegisterScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  async function handleRegister() {
    setLoading(true);
    setMsg('');
    try {
      await api.post('/perfil', { nome, sobrenome, email, telefone, senha, codStatus: true });
      setMsg('Conta criada com sucesso. Faça login.');
      setTimeout(() => navigation.navigate('Login'), 700);
    } catch (err) {
      setMsg(normalizeError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>Criar conta</Text>
        <TextInput style={styles.input} placeholder="Nome" placeholderTextColor={colors.muted} value={nome} onChangeText={setNome} />
        <TextInput style={styles.input} placeholder="Sobrenome" placeholderTextColor={colors.muted} value={sobrenome} onChangeText={setSobrenome} />
        <TextInput style={styles.input} placeholder="E-mail" placeholderTextColor={colors.muted} value={email} onChangeText={setEmail} autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Telefone" placeholderTextColor={colors.muted} value={telefone} onChangeText={setTelefone} />
        <TextInput style={styles.input} placeholder="Senha" placeholderTextColor={colors.muted} value={senha} onChangeText={setSenha} secureTextEntry />
        {msg ? <Text style={styles.msg}>{msg}</Text> : null}
        <Pressable style={styles.button} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Criar conta</Text>}
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, gap: 10 },
  title: { fontSize: 26, fontWeight: '700', color: colors.text, marginBottom: 6 },
  input: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 12, padding: 14, color: colors.text },
  button: { backgroundColor: colors.primary, borderRadius: 12, padding: 14, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' },
  msg: { color: colors.text, textAlign: 'center' },
});
