import { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Pressable, ActivityIndicator, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Screen } from '../components/Screen';
import { Card } from '../components/Card';
import { useAuth } from '../contexts/AuthContext';
import { api, normalizeError } from '../services/api';
import { ModalSheet } from '../components/ModalSheet';
import { useTheme } from '../contexts/ThemeContext';

export function PlanosScreen({ navigation }) {
  const { perfilId, user } = useAuth();
  const { colors } = useTheme();
  const [planos, setPlanos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const [createOpen, setCreateOpen] = useState(false);
  const [novoPlanoNome, setNovoPlanoNome] = useState('');
  const [novoPlanoWallpaperUrl, setNovoPlanoWallpaperUrl] = useState('');
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState('');

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

  const styles = useMemo(
    () =>
      StyleSheet.create({
        headerRow: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
        headerText: { flex: 1 },
        title: { fontSize: 26, color: colors.text, fontWeight: '800', letterSpacing: -0.5 },
        subtitle: { color: colors.muted, marginTop: 4, fontSize: 16 },
        input: { backgroundColor: colors.surfaceSoft, borderColor: colors.border, borderWidth: 1, borderRadius: 14, padding: 16, color: colors.text, fontSize: 16 },
        label: { color: colors.muted, fontSize: 13, fontWeight: '600', marginLeft: 4 },
        iconBtn: { width: 46, height: 46, borderRadius: 14, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 4 },
        iconPlus: { color: '#ffffff' },
        plano: { color: colors.text, fontSize: 18, fontWeight: '700', letterSpacing: -0.3 },
        desc: { color: colors.muted, marginTop: 8, fontSize: 14 },
        empty: { color: colors.muted, textAlign: 'center', marginTop: 42, fontSize: 16 },
        error: { color: colors.danger, padding: 16, textAlign: 'center' },
        formError: { color: colors.danger, marginBottom: 8, textAlign: 'center', fontWeight: '500' },
      }),
    [colors]
  );

  function openCreate() {
    setNovoPlanoNome('');
    setNovoPlanoWallpaperUrl('');
    setFormError('');
    setCreateOpen(true);
  }

  async function handleCreatePlano() {
    const trimmed = novoPlanoNome.trim();
    const wallpaperTrimmed = novoPlanoWallpaperUrl.trim();
    if (!perfilId) return;
    if (!trimmed || trimmed.length > 50) {
      setFormError(!trimmed ? 'Nome é obrigatório.' : 'Nome deve ter no máximo 50 caracteres.');
      return;
    }

    setCreating(true);
    setFormError('');
    try {
      await api.post(`/planos/perfil/${perfilId}`, {
        nome: trimmed,
        wallpaperUrl: wallpaperTrimmed ? wallpaperTrimmed : null,
      });
      setCreateOpen(false);
      await fetchPlanos();
    } catch (err) {
      setFormError(normalizeError(err));
    } finally {
      setCreating(false);
    }
  }

  return (
    <Screen>
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text style={styles.title}>Olá, {user?.nome || 'usuário'}</Text>
          <Text style={styles.subtitle}>Seus planos</Text>
        </View>
        <Pressable style={styles.iconBtn} onPress={openCreate}>
          <MaterialCommunityIcons name="plus" size={24} style={styles.iconPlus} />
        </Pressable>
      </View>

      {loading ? <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={planos}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24, gap: 16 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchPlanos(); }} tintColor={colors.primary} />}
        ListEmptyComponent={!loading ? <Text style={styles.empty}>Nenhum plano cadastrado.</Text> : null}
        renderItem={({ item }) => (
          <Pressable onPress={() => navigation.navigate('Board', { planoId: item.id, planoNome: item.nome })}>
            <Card>
              <Text style={styles.plano}>{item.nome}</Text>
              <Text style={styles.desc} numberOfLines={1}>{item.wallpaperUrl ? 'Com capa' : 'Sem capa'}</Text>
            </Card>
          </Pressable>
        )}
      />

      <ModalSheet
        open={createOpen}
        title="Criar novo plano"
        onClose={() => { if (!creating) setCreateOpen(false); }}
        primaryLabel="Criar"
        onPrimary={handleCreatePlano}
        loading={creating}
        primaryDisabled={!novoPlanoNome.trim()}
      >
        {formError ? <Text style={styles.formError}>{formError}</Text> : null}

        <View style={{ gap: 6 }}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex.: Projeto X"
            placeholderTextColor={colors.muted}
            value={novoPlanoNome}
            onChangeText={(t) => { setNovoPlanoNome(t); if (formError) setFormError(''); }}
            editable={!creating}
            maxLength={50}
          />
        </View>

        <View style={{ gap: 6 }}>
          <Text style={styles.label}>Wallpaper URL (opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="https://..."
            placeholderTextColor={colors.muted}
            value={novoPlanoWallpaperUrl}
            onChangeText={setNovoPlanoWallpaperUrl}
            editable={!creating}
            autoCapitalize="none"
          />
        </View>
      </ModalSheet>
    </Screen>
  );
}
