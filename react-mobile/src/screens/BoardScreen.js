import { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator, TextInput, RefreshControl } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Screen } from '../components/Screen';
import { Card } from '../components/Card';
import { useAuth } from '../contexts/AuthContext';
import { api, normalizeError } from '../services/api';
import { ModalSheet } from '../components/ModalSheet';
import { useTheme } from '../contexts/ThemeContext';

export function BoardScreen({ route, navigation }) {
  const { planoId, planoNome } = route.params;
  const { perfilId } = useAuth();
  const { colors } = useTheme();
  const [listas, setListas] = useState([]);
  const [cards, setCards] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  // Modals state — Lista
  const [listaModalOpen, setListaModalOpen] = useState(false);
  const [novaListaNome, setNovaListaNome] = useState('');
  const [novaListaCor, setNovaListaCor] = useState('');
  const [creatingLista, setCreatingLista] = useState(false);
  const [listaFormError, setListaFormError] = useState('');

  // Modals state — Cartão
  const [cardModalOpen, setCardModalOpen] = useState(false);
  const [cardListaId, setCardListaId] = useState(null);
  const [novoCartaoTipo, setNovoCartaoTipo] = useState('TAREFA');
  const [novoCartaoNome, setNovoCartaoNome] = useState('');
  const [novoCartaoDescricao, setNovoCartaoDescricao] = useState('');
  const [novoCartaoCor, setNovoCartaoCor] = useState(null);
  const [novoCartaoConclusao, setNovoCartaoConclusao] = useState('');
  const [novoCartaoInicio, setNovoCartaoInicio] = useState('');
  const [novoCartaoFim, setNovoCartaoFim] = useState('');
  const [creatingCartao, setCreatingCartao] = useState(false);
  const [cardFormError, setCardFormError] = useState('');

  function toLocalDateTimeString(date) {
    return date.toISOString().slice(0, 19);
  }

  function normalizeLocalDateTimeInput(raw) {
    const value = String(raw || '').trim();
    if (!value) return null;

    // Aceita:
    // - YYYY-MM-DDTHH:mm
    // - YYYY-MM-DDTHH:mm:ss
    // - YYYY-MM-DD HH:mm
    // - YYYY-MM-DD HH:mm:ss
    const normalized = value.replace(' ', 'T');
    const match = normalized.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})(?::(\d{2}))?$/);
    if (!match) return null;
    const seconds = match[3] ?? '00';
    return `${match[1]}T${match[2]}:${seconds}`;
  }

  const CARD_COLOR_PRESETS = [colors.primary, colors.success, colors.danger];

  const styles = useMemo(
    () =>
      StyleSheet.create({
        topActions: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
        primaryAction: { flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary, borderRadius: 14, padding: 14, shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 4 },
        primaryActionText: { color: '#ffffff', fontWeight: '800', fontSize: 16, letterSpacing: 0.2 },
        input: { backgroundColor: colors.surfaceSoft, borderColor: colors.border, borderWidth: 1, borderRadius: 14, padding: 16, color: colors.text, fontSize: 16 },
        label: { color: colors.muted, fontSize: 13, fontWeight: '600', marginLeft: 4 },
        hint: { color: colors.muted, fontSize: 12, marginTop: 4, marginLeft: 4 },
        formError: { color: colors.danger, textAlign: 'center', marginBottom: 8, fontWeight: '600' },
        listHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, alignItems: 'center' },
        listHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
        listTitle: { color: colors.text, fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },
        count: { color: colors.muted, fontSize: 14, fontWeight: '600' },
        iconBtnSmall: { width: 36, height: 36, borderRadius: 12, backgroundColor: colors.surfaceSoft, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
        cardItem: { backgroundColor: colors.surfaceSoft, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 14, marginBottom: 10 },
        cardTitle: { color: colors.text, fontWeight: '700', fontSize: 15 },
        cardType: { color: colors.muted, marginTop: 6, fontSize: 12, fontWeight: '500', textTransform: 'uppercase' },
        empty: { color: colors.muted, fontSize: 14, textAlign: 'center', marginVertical: 12 },
        typeRow: { flexDirection: 'row', gap: 12 },
        typeBtn: { flex: 1, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 14, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, backgroundColor: colors.surface },
        typeBtnActive: { backgroundColor: colors.primary + '20', borderColor: colors.primary },
        typeText: { color: colors.text, fontWeight: '700' },
        swatchRow: { flexDirection: 'row', gap: 12, alignItems: 'center', marginTop: 4 },
        swatch: { width: 32, height: 32, borderRadius: 10, borderWidth: 1, borderColor: colors.border },
        swatchNone: { backgroundColor: colors.surfaceSoft, alignItems: 'center', justifyContent: 'center' },
        swatchActive: { borderColor: colors.text, borderWidth: 2 },
        error: { color: colors.danger, paddingHorizontal: 20, marginTop: 10, textAlign: 'center' },
      }),
    [colors]
  );

  function openCreateLista() {
    setNovaListaNome('');
    setNovaListaCor('');
    setListaFormError('');
    setListaModalOpen(true);
  }

  function openCreateCard(listaId) {
    const now = new Date();
    const start = toLocalDateTimeString(now);
    const end = toLocalDateTimeString(new Date(now.getTime() + 60 * 60 * 1000));

    setCardListaId(listaId);
    setNovoCartaoTipo('TAREFA');
    setNovoCartaoNome('');
    setNovoCartaoDescricao('');
    setNovoCartaoCor(null);
    setNovoCartaoConclusao(start);
    setNovoCartaoInicio(start);
    setNovoCartaoFim(end);
    setCardFormError('');
    setCardModalOpen(true);
  }

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: planoNome || 'Quadro',
      headerTintColor: colors.text,
      headerStyle: { backgroundColor: colors.surface },
    });
  }, [navigation, planoNome, colors.surface, colors.text]);

  const fetchBoard = useCallback(
    async ({ showLoader = true } = {}) => {
      if (!perfilId || !planoId) return;
      if (showLoader) setLoading(true);
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
        setRefreshing(false);
      }
    },
    [perfilId, planoId]
  );

  useEffect(() => {
    fetchBoard({ showLoader: true });
  }, [fetchBoard]);

  async function handleCreateLista() {
    const trimmed = novaListaNome.trim();
    const corTrimmed = novaListaCor.trim();
    if (!perfilId) return;
    if (!trimmed || trimmed.length > 50) {
      setListaFormError(!trimmed ? 'Nome é obrigatório.' : 'Nome deve ter no máximo 50 caracteres.');
      return;
    }

    if (corTrimmed && !/^#[0-9A-Fa-f]{6}$/.test(corTrimmed)) {
      setListaFormError('Cor inválida. Use o formato #RRGGBB.');
      return;
    }

    setCreatingLista(true);
    setListaFormError('');
    try {
      await api.post(`/listas/perfil/${perfilId}/plano/${planoId}`, {
        nome: trimmed,
        cor: corTrimmed ? corTrimmed : null,
      });
      setListaModalOpen(false);
      await fetchBoard({ showLoader: false });
    } catch (err) {
      setListaFormError(normalizeError(err));
    } finally {
      setCreatingLista(false);
    }
  }

  async function handleCreateCartao() {
    const listaId = cardListaId;
    const trimmed = String(novoCartaoNome || '').trim();
    const tipo = (novoCartaoTipo || 'TAREFA').toUpperCase();
    if (!perfilId) return;
    if (!listaId) return;
    if (!trimmed || trimmed.length > 50) {
      setCardFormError(!trimmed ? 'Nome é obrigatório.' : 'Nome deve ter no máximo 50 caracteres.');
      return;
    }

    if (novoCartaoDescricao && novoCartaoDescricao.length > 500) {
      setCardFormError('Descrição deve ter no máximo 500 caracteres.');
      return;
    }

    setCreatingCartao(true);
    setCardFormError('');
    try {
      if (tipo === 'EVENTO') {
        const dataInicio = normalizeLocalDateTimeInput(novoCartaoInicio);
        const dataFim = normalizeLocalDateTimeInput(novoCartaoFim);

        if (!dataInicio) {
          setCardFormError('A data de início é obrigatória.');
          return;
        }
        if (!dataFim) {
          setCardFormError('A data de fim é obrigatória.');
          return;
        }
        if (new Date(dataFim) < new Date(dataInicio)) {
          setCardFormError('A data de fim não pode ser anterior à data de início.');
          return;
        }

        await api.post(`/eventos/perfil/${perfilId}/lista/${listaId}`, {
          nome: trimmed,
          descricao: novoCartaoDescricao.trim() || null,
          cor: novoCartaoCor,
          dataInicio,
          dataFim,
        });
      } else {
        const dataConclusao = normalizeLocalDateTimeInput(novoCartaoConclusao);
        if (!dataConclusao) {
          setCardFormError('A data de conclusão é obrigatória.');
          return;
        }

        await api.post(`/tarefas/perfil/${perfilId}/lista/${listaId}`, {
          nome: trimmed,
          descricao: novoCartaoDescricao.trim() || null,
          cor: novoCartaoCor,
          dataConclusao,
        });
      }

      const cardsRes = await api.get(`/cartoes/perfil/${perfilId}/lista/${listaId}`);
      setCards((prev) => ({ ...prev, [listaId]: cardsRes.data }));
      setCardModalOpen(false);
    } catch (err) {
      setCardFormError(normalizeError(err));
    } finally {
      setCreatingCartao(false);
    }
  }

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

      <View style={styles.topActions}>
        <Pressable style={styles.primaryAction} onPress={openCreateLista}>
          <MaterialCommunityIcons name="plus" size={18} color="#fff" />
          <Text style={styles.primaryActionText}>Nova lista</Text>
        </Pressable>
      </View>

      <FlatList
        data={listas}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchBoard({ showLoader: false }); }} tintColor={colors.primary} />}
        renderItem={({ item }) => (
          <Card>
            <View style={styles.listHeader}>
              <Text style={styles.listTitle}>{item.nome}</Text>
              <View style={styles.listHeaderRight}>
                <Text style={styles.count}>{(cards[item.id] || []).length}</Text>
                <Pressable style={styles.iconBtnSmall} onPress={() => openCreateCard(item.id)}>
                  <MaterialCommunityIcons name="plus" size={18} color={colors.text} />
                </Pressable>
              </View>
            </View>
            {(cards[item.id] || []).map((card) => (
              <Pressable key={card.id} style={styles.cardItem}>
                <Text style={styles.cardTitle}>{card.nome || 'Cartão'}</Text>
                <Text style={styles.cardType}>{card.tipo || card.tipoCartao || 'TAREFA'}</Text>
              </Pressable>
            ))}
            {(cards[item.id] || []).length === 0 ? <Text style={styles.empty}>Sem cartões.</Text> : null}
          </Card>
        )}
      />

      <ModalSheet
        open={listaModalOpen}
        title="Criar nova lista"
        onClose={() => { if (!creatingLista) setListaModalOpen(false); }}
        primaryLabel="Criar"
        onPrimary={handleCreateLista}
        loading={creatingLista}
        primaryDisabled={!novaListaNome.trim()}
      >
        {listaFormError ? <Text style={styles.formError}>{listaFormError}</Text> : null}
        <View style={{ gap: 6 }}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex.: A Fazer"
            placeholderTextColor={colors.muted}
            value={novaListaNome}
            onChangeText={(t) => { setNovaListaNome(t); if (listaFormError) setListaFormError(''); }}
            editable={!creatingLista}
            maxLength={50}
          />
        </View>
        <View style={{ gap: 6 }}>
          <Text style={styles.label}>Cor (opcional)</Text>
          <View style={styles.swatchRow}>
            <Pressable
              style={[styles.swatch, styles.swatchNone, novaListaCor.trim() === '' ? styles.swatchActive : null]}
              onPress={() => setNovaListaCor('')}
            >
              <MaterialCommunityIcons name="close" size={14} color={colors.muted} />
            </Pressable>
            {[colors.primary, colors.success, colors.danger].map((hex) => (
              <Pressable
                key={hex}
                style={[styles.swatch, { backgroundColor: hex }, novaListaCor.trim().toLowerCase() === hex.toLowerCase() ? styles.swatchActive : null]}
                onPress={() => setNovaListaCor(hex)}
              />
            ))}
          </View>
          <TextInput
            style={styles.input}
            placeholder="#RRGGBB"
            placeholderTextColor={colors.muted}
            value={novaListaCor}
            onChangeText={setNovaListaCor}
            editable={!creatingLista}
            autoCapitalize="none"
          />
        </View>
      </ModalSheet>

      <ModalSheet
        open={cardModalOpen}
        title="Novo cartão"
        onClose={() => { if (!creatingCartao) setCardModalOpen(false); }}
        primaryLabel="Criar"
        onPrimary={handleCreateCartao}
        loading={creatingCartao}
        primaryDisabled={!novoCartaoNome.trim()}
      >
        {cardFormError ? <Text style={styles.formError}>{cardFormError}</Text> : null}

        <View style={styles.typeRow}>
          <Pressable
            style={[styles.typeBtn, novoCartaoTipo === 'TAREFA' ? styles.typeBtnActive : null]}
            onPress={() => setNovoCartaoTipo('TAREFA')}
            disabled={creatingCartao}
          >
            <MaterialCommunityIcons name="check-square-outline" size={16} color={colors.text} />
            <Text style={styles.typeText}>Tarefa</Text>
          </Pressable>
          <Pressable
            style={[styles.typeBtn, novoCartaoTipo === 'EVENTO' ? styles.typeBtnActive : null]}
            onPress={() => setNovoCartaoTipo('EVENTO')}
            disabled={creatingCartao}
          >
            <MaterialCommunityIcons name="calendar-blank-outline" size={16} color={colors.text} />
            <Text style={styles.typeText}>Evento</Text>
          </Pressable>
        </View>

        <View style={{ gap: 6 }}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome do cartão"
            placeholderTextColor={colors.muted}
            value={novoCartaoNome}
            onChangeText={(t) => { setNovoCartaoNome(t); if (cardFormError) setCardFormError(''); }}
            editable={!creatingCartao}
            maxLength={50}
          />
        </View>

        <View style={{ gap: 6 }}>
          <Text style={styles.label}>Descrição (opcional)</Text>
          <TextInput
            style={[styles.input, { minHeight: 90, textAlignVertical: 'top' }]}
            placeholder="Detalhes do cartão"
            placeholderTextColor={colors.muted}
            value={novoCartaoDescricao}
            onChangeText={setNovoCartaoDescricao}
            editable={!creatingCartao}
            maxLength={500}
            multiline
          />
        </View>

        <View style={{ gap: 6 }}>
          <Text style={styles.label}>Cor (opcional)</Text>
          <View style={styles.swatchRow}>
            <Pressable
              style={[styles.swatch, styles.swatchNone, novoCartaoCor === null ? styles.swatchActive : null]}
              onPress={() => setNovoCartaoCor(null)}
            >
              <MaterialCommunityIcons name="close" size={14} color={colors.muted} />
            </Pressable>
            {CARD_COLOR_PRESETS.map((hex) => (
              <Pressable
                key={hex}
                style={[styles.swatch, { backgroundColor: hex }, novoCartaoCor?.toLowerCase() === hex.toLowerCase() ? styles.swatchActive : null]}
                onPress={() => setNovoCartaoCor(hex)}
              />
            ))}
          </View>
        </View>

        {novoCartaoTipo === 'TAREFA' ? (
          <View style={{ gap: 6 }}>
            <Text style={styles.label}>Data de conclusão</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD HH:mm"
              placeholderTextColor={colors.muted}
              value={novoCartaoConclusao}
              onChangeText={setNovoCartaoConclusao}
              editable={!creatingCartao}
              autoCapitalize="none"
            />
            <Text style={styles.hint}>Formato aceito: 2026-04-02 14:30</Text>
          </View>
        ) : (
          <View style={{ gap: 10 }}>
            <View style={{ gap: 6 }}>
              <Text style={styles.label}>Início</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD HH:mm"
                placeholderTextColor={colors.muted}
                value={novoCartaoInicio}
                onChangeText={setNovoCartaoInicio}
                editable={!creatingCartao}
                autoCapitalize="none"
              />
            </View>
            <View style={{ gap: 6 }}>
              <Text style={styles.label}>Fim</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD HH:mm"
                placeholderTextColor={colors.muted}
                value={novoCartaoFim}
                onChangeText={setNovoCartaoFim}
                editable={!creatingCartao}
                autoCapitalize="none"
              />
            </View>
            <Text style={styles.hint}>Formato aceito: 2026-04-02 14:30</Text>
          </View>
        )}
      </ModalSheet>
    </Screen>
  );
}
