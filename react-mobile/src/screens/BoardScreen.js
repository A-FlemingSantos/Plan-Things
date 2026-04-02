import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { Screen } from '../components/Screen';
import { Card } from '../components/Card';
import { colors } from '../theme/colors';
import { useAuth } from '../contexts/AuthContext';
import { api, normalizeError } from '../services/api';

export function BoardScreen({ route, navigation }) {
  const { planoId, planoNome } = route.params;
  const { perfilId } = useAuth();
  const [listas, setListas] = useState([]);
  const [cards, setCards] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    navigation.setOptions({ headerShown: true, title: planoNome || 'Quadro', headerTintColor: '#fff', headerStyle: { backgroundColor: colors.surface } });
  }, [navigation, planoNome]);

  useEffect(() => {
    async function fetchBoard() {
      setLoading(true);
      setError('');
      try {
        const listasRes = await api.get(`/listas/perfil/${perfilId}/plano/${planoId}`);
        setListas(listasRes.data);
        const map = {};
        await Promise.all(
          listasRes.data.map(async (lista) => {
            const cardsRes = await api.get(`/cartoes/perfil/${perfilId}/lista/${lista.id}`);
            map[lista.id] = cardsRes.data;
          })
        );
        setCards(map);
      } catch (err) {
        setError(normalizeError(err));
      } finally {
        setLoading(false);
      }
    }
    fetchBoard();
  }, [perfilId, planoId]);

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
      </Screen>
    );
  }

  return (
    <Screen>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={listas}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        renderItem={({ item }) => (
          <Card>
            <View style={styles.listHeader}>
              <Text style={styles.listTitle}>{item.nome}</Text>
              <Text style={styles.count}>{(cards[item.id] || []).length}</Text>
            </View>
            {(cards[item.id] || []).map((card) => (
              <Pressable key={card.id} style={styles.cardItem}>
                <Text style={styles.cardTitle}>{card.titulo || card.nome || 'Cartão'}</Text>
                <Text style={styles.cardType}>{card.tipoCartao || 'TAREFA'}</Text>
              </Pressable>
            ))}
            {(cards[item.id] || []).length === 0 ? <Text style={styles.empty}>Sem cartões.</Text> : null}
          </Card>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  listTitle: { color: colors.text, fontSize: 16, fontWeight: '700' },
  count: { color: colors.muted },
  cardItem: { backgroundColor: colors.surfaceSoft, borderRadius: 10, borderWidth: 1, borderColor: colors.border, padding: 10, marginBottom: 8 },
  cardTitle: { color: colors.text, fontWeight: '600' },
  cardType: { color: colors.muted, marginTop: 4, fontSize: 12 },
  empty: { color: colors.muted, fontSize: 12 },
  error: { color: colors.danger, paddingHorizontal: 16, marginTop: 8 },
});
