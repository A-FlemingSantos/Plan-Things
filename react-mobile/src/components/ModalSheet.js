import { Modal, View, Text, Pressable, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export function ModalSheet({
  open,
  title,
  children,
  onClose,
  primaryLabel = 'Salvar',
  onPrimary,
  primaryDisabled,
  loading,
}) {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        overlay: {
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.6)',
          padding: 16,
          justifyContent: 'center',
        },
        kb: { flex: 1, justifyContent: 'center' },
        sheet: {
          backgroundColor: colors.surface,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: colors.border,
          overflow: 'hidden',
          maxHeight: '85%',
        },
        header: {
          paddingHorizontal: 16,
          paddingVertical: 14,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        title: { color: colors.text, fontSize: 16, fontWeight: '700' },
        close: { color: colors.muted, fontSize: 22, lineHeight: 22 },
        body: { padding: 16, gap: 10 },
        footer: {
          padding: 16,
          flexDirection: 'row',
          gap: 10,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        },
        btn: { flex: 1, borderRadius: 12, padding: 12, alignItems: 'center' },
        btnPrimary: { backgroundColor: colors.primary },
        btnPrimaryText: { color: '#fff', fontWeight: '700' },
        btnSecondary: { backgroundColor: colors.surfaceSoft, borderWidth: 1, borderColor: colors.border },
        btnSecondaryText: { color: colors.text, fontWeight: '700' },
        btnDisabled: { opacity: 0.7 },
      }),
    [colors]
  );

  if (!open) return null;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.kb}
        >
          <Pressable style={styles.sheet} onPress={() => {}}>
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              <Pressable onPress={onClose} hitSlop={10}>
                <Text style={styles.close}>×</Text>
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
              {children}
            </ScrollView>

            <View style={styles.footer}>
              <Pressable style={[styles.btn, styles.btnSecondary]} onPress={onClose} disabled={loading}>
                <Text style={styles.btnSecondaryText}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={[styles.btn, styles.btnPrimary, (primaryDisabled || loading) ? styles.btnDisabled : null]}
                onPress={onPrimary}
                disabled={primaryDisabled || loading}
              >
                <Text style={styles.btnPrimaryText}>{loading ? 'Salvando...' : primaryLabel}</Text>
              </Pressable>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}
