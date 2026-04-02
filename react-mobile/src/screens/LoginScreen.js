import { useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Screen } from '../components/Screen';
import { Card } from '../components/Card';
import { api, normalizeError } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const { colors, isDark } = useTheme();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin() {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/perfil/login', { email, senha });
      await login(res.data);
    } catch (err) {
      setError(normalizeError(err));
    } finally {
      setLoading(false);
    }
  }

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, justifyContent: 'center', padding: 24 },
        title: { fontSize: 32, fontWeight: '800', color: colors.text, marginBottom: 8, textAlign: 'center', letterSpacing: -0.5 },
        subtitle: { fontSize: 16, color: colors.muted, marginBottom: 32, textAlign: 'center', lineHeight: 22 },
        cardForm: { gap: 16, paddingVertical: 24, paddingHorizontal: 20 },
        input: { 
          backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : colors.surfaceSoft, 
          borderColor: isDark ? 'rgba(255,255,255,0.1)' : colors.border, 
          borderWidth: 1, 
          borderRadius: 14, 
          padding: 16, 
          fontSize: 16,
          color: colors.text,
        },
        button: { 
          backgroundColor: colors.primary, 
          borderRadius: 14, 
          padding: 18, 
          alignItems: 'center', 
          marginTop: 12,
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.35,
          shadowRadius: 10,
          elevation: 5,
        },
        buttonText: { color: '#ffffff', fontWeight: '700', fontSize: 16, letterSpacing: 0.3 },
        link: { color: colors.primary, textAlign: 'center', marginTop: 28, fontSize: 15, fontWeight: '600' },
        errorContainer: { backgroundColor: colors.danger + '20', borderWidth: 1, borderColor: colors.danger + '50', padding: 12, borderRadius: 12, marginBottom: 16 },
        error: { color: colors.danger, fontWeight: '500', textAlign: 'center' },
      }),
    [colors, isDark]
  );

  return (
    <Screen>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <Text style={styles.title}>Plan Things</Text>
            <Text style={styles.subtitle}>Organize seus planos com elegância</Text>

            <Card style={styles.cardForm}>
              {error ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.error}>{error}</Text>
                </View>
              ) : null}

              <TextInput 
                style={styles.input} 
                placeholder="Seu e-mail" 
                placeholderTextColor={colors.muted} 
                value={email} 
                onChangeText={setEmail} 
                autoCapitalize="none" 
                keyboardType="email-address" 
              />
              <TextInput 
                style={styles.input} 
                placeholder="Sua senha" 
                placeholderTextColor={colors.muted} 
                value={senha} 
                onChangeText={setSenha} 
                secureTextEntry 
              />

              <Pressable style={({ pressed }) => [styles.button, pressed && { opacity: 0.8 }]} onPress={handleLogin} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Entrar</Text>}
              </Pressable>
            </Card>

            <Pressable onPress={() => navigation.navigate('Register')}>
              <Text style={styles.link}>Ainda não tem conta? Crie aqui.</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
