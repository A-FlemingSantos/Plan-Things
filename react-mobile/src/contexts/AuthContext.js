import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);
const KEY = 'planthings_session';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (raw) setUser(JSON.parse(raw));
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (payload) => {
    const session = {
      id: payload.id,
      email: payload.email,
      nome: payload.nome,
      sobrenome: payload.sobrenome,
      telefone: payload.telefone,
    };
    await AsyncStorage.setItem(KEY, JSON.stringify(session));
    setUser(session);
  };

  const logout = async () => {
    await AsyncStorage.removeItem(KEY);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      perfilId: user?.id || null,
      isAuthenticated: !!user,
      loading,
      login,
      logout,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth fora do provider');
  return ctx;
}
