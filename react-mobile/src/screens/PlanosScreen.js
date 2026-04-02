import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Pressable, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Screen } from '../components/Screen';
import { Card } from '../components/Card';
import { colors } from '../theme/colors';
import { useAuth } from '../contexts/AuthContext';
import { api, normalizeError } from '../services/api';

export function PlanosScreen({ navigation }) {
  const { perfilId, user } = useAuth();
  const [planos, setPlanos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchPlanos = useCallback(async () => {
    if (!perfilId) return;
    setError('');
    try {
      const res = await api.get(`/planos/perfil/${perfilId}`);
      setPlanos(res.data);
    } catch (err) {
      setError(normalizeError(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [perfilId]);

  useFocusEffect(
    useCallback(() => {
      fetchPlanos();
    }, [fetchPlanos])
  );

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Olá, {user?.nome || 'usuário'}</Text>
        <Text style={styles.subtitle}>Seus planos recentes</Text>
      </View>

      {loading ? <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={planos}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 16, gap: 10 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchPlanos(); }} tintColor={colors.primary} />}
        ListEmptyComponent={!loading ? <Text style={styles.empty}>Nenhum plano cadastrado.</Text> : null}
        renderItem={({ item }) => (
          <Pressable onPress={() => navigation.navigate('Board', { planoId: item.id, planoNome: item.nome })}>
            <Card>
              <Text style={styles.plano}>{item.nome}</Text>
              <Text style={styles.desc} numberOfLines={2}>{item.descricao || 'Sem descrição.'}</Text>
            </Card>
          </Pressable>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingTop: 12 },
  title: { fontSize: 24, color: colors.text, fontWeight: '700' },
  subtitle: { color: colors.muted, marginTop: 2 },
  plano: { color: colors.text, fontSize: 16, fontWeight: '600' },
  desc: { color: colors.muted, marginTop: 6 },
  empty: { color: colors.muted, textAlign: 'center', marginTop: 42 },
  error: { color: colors.danger, padding: 16 },
});
