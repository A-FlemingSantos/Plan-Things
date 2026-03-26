import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../theme/colors';

export function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1E3A8A', '#0B1220']} style={styles.hero}>
        <Text style={styles.title}>Bem-vindo de volta</Text>
        <Text style={styles.subtitle}>Acesse sua conta e organize seus projetos.</Text>
      </LinearGradient>

      <View style={styles.form}>
        <Text style={styles.label}>E-mail</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="seuemail@empresa.com" placeholderTextColor={colors.textSecondary} />

        <Text style={styles.label}>Senha</Text>
        <TextInput style={styles.input} value={senha} onChangeText={setSenha} secureTextEntry placeholder="••••••••" placeholderTextColor={colors.textSecondary} />

        <Pressable style={styles.cta} onPress={() => navigation.replace('App')}>
          <Text style={styles.ctaText}>Entrar</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Ainda não possui conta? Criar cadastro</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  hero: { padding: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  title: { color: colors.textPrimary, fontSize: 28, fontWeight: '700' },
  subtitle: { color: '#BFDBFE', marginTop: 8 },
  form: { padding: 20, gap: 10 },
  label: { color: colors.textPrimary, fontSize: 14 },
  input: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 12, color: colors.textPrimary, padding: 12 },
  cta: { marginTop: 10, backgroundColor: colors.brand, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  ctaText: { color: colors.textPrimary, fontWeight: '700' },
  link: { color: '#93C5FD', textAlign: 'center', marginTop: 16 }
});
