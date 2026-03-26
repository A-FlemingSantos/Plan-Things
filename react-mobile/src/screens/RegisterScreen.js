import { useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../theme/colors';

export function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({ nome: '', email: '', senha: '' });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.title}>Crie sua conta</Text>
        <Text style={styles.subtitle}>Comece grátis e centralize tarefas e times.</Text>

        <TextInput style={styles.input} placeholder="Nome completo" placeholderTextColor={colors.textSecondary} value={form.nome} onChangeText={(nome) => setForm((v) => ({ ...v, nome }))} />
        <TextInput style={styles.input} placeholder="E-mail" placeholderTextColor={colors.textSecondary} value={form.email} onChangeText={(email) => setForm((v) => ({ ...v, email }))} />
        <TextInput style={styles.input} placeholder="Senha" secureTextEntry placeholderTextColor={colors.textSecondary} value={form.senha} onChangeText={(senha) => setForm((v) => ({ ...v, senha }))} />

        <Pressable style={styles.cta} onPress={() => navigation.replace('App')}>
          <Text style={styles.ctaText}>Criar conta</Text>
        </Pressable>

        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.link}>Já possui conta? Entrar</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  wrapper: { padding: 20, gap: 12 },
  title: { color: colors.textPrimary, fontSize: 28, fontWeight: '700', marginTop: 24 },
  subtitle: { color: colors.textSecondary, marginBottom: 12 },
  input: { backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.border, color: colors.textPrimary, padding: 12 },
  cta: { backgroundColor: colors.brand, borderRadius: 12, alignItems: 'center', paddingVertical: 14, marginTop: 8 },
  ctaText: { color: colors.textPrimary, fontWeight: '700' },
  link: { textAlign: 'center', color: '#93C5FD', marginTop: 10 }
});
