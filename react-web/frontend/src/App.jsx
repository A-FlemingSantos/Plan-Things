import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { PrivateRoute } from "@/components/PrivateRoute";
import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import { HomepageGemini } from "@/features/homepage/HomepageGemini";
import { LoginPage } from "@/features/auth/LoginPage";
import { RegisterPage } from "@/features/auth/RegisterPage";
import { PlanosPage } from "@/features/planos/PlanosPage";
import { PlanoBoardPage } from "@/features/planos/PlanoBoardPage";
import { ListaPage } from "@/features/planos/ListaPage";
import { PerfilPage } from "@/features/perfil/PerfilPage";

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        {/* ─── Rotas publicas ─────────────────────────────────────────── */}
        <Route path="/" element={<HomepageGemini />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />

        {/* ─── Rotas privadas (area autenticada) ──────────────────────── */}
        <Route
          path="/app"
          element={
            <PrivateRoute>
              <AuthenticatedLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="planos" replace />} />
          <Route path="planos" element={<PlanosPage />} />
          <Route path="planos/:planoId" element={<PlanoBoardPage />} />
          <Route path="listas/:listaId" element={<ListaPage />} />
          <Route path="perfil" element={<PerfilPage />} />
        </Route>

        {/* ─── Fallback ───────────────────────────────────────────────── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
