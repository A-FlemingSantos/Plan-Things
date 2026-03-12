import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

export const defaultSession = {
  email: "ana@empresa.com",
  nome: "Ana",
  sobrenome: "Silva",
  telefone: null,
};

export function persistSession(overrides = {}) {
  const session = { ...defaultSession, ...overrides };
  localStorage.setItem("planthings_session", JSON.stringify(session));
  return session;
}

export function renderWithAuthRouter(
  ui,
  { initialEntries = ["/"], session = defaultSession } = {}
) {
  if (session) {
    persistSession(session);
  }

  return render(
    <MemoryRouter
      initialEntries={initialEntries}
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ThemeProvider>
        <AuthProvider>{ui}</AuthProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
}
