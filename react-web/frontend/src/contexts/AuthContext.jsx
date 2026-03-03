import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "planthings_session";

const AuthContext = createContext(null);

function loadSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data && data.id && data.email) return data;
    return null;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadSession);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const login = useCallback((userData) => {
    const session = {
      id: userData.id,
      email: userData.email,
      nome: userData.nome,
      sobrenome: userData.sobrenome,
      telefone: userData.telefone,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    setUser(session);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedData) => {
    const session = {
      id: updatedData.id,
      email: updatedData.email,
      nome: updatedData.nome,
      sobrenome: updatedData.sobrenome,
      telefone: updatedData.telefone,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    setUser(session);
  }, []);

  const value = useMemo(
    () => ({
      user,
      perfilId: user?.id ?? null,
      isAuthenticated: !!user,
      loading,
      login,
      logout,
      updateUser,
    }),
    [user, loading, login, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  }
  return ctx;
}
