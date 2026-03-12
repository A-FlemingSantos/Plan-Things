import { useCallback, useEffect, useRef, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  Bell,
  HelpCircle,
  Home,
  Layers,
  LogOut,
  Moon,
  Plus,
  Search,
  Sun,
  User,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import "@/features/homepage/styles/homepage-gemini.css";
import "./styles/authenticated-layout.css";

function getInitials(nome, sobrenome) {
  const first = nome?.[0] || "";
  const last = sobrenome?.[0] || "";
  return (first + last).toUpperCase() || "?";
}

export function AuthenticatedLayout() {
  const { user, logout } = useAuth();
  const { toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = useCallback(async () => {
    await logout();
    navigate("/login", { replace: true });
  }, [logout, navigate]);

  const handleThemeToggle = useCallback(() => {
    toggleTheme();
  }, [toggleTheme]);

  // close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;

    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }

    function handleEscape(e) {
      if (e.key === "Escape") setDropdownOpen(false);
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [dropdownOpen]);

  const initials = getInitials(user?.nome, user?.sobrenome);

  return (
    <div className="app-shell">
      {/* ─── Header Global ──────────────────────────────────────────────── */}
      <header className="app-header">
        {/* LEFT */}
        <div className="app-header__left">
          <Link
            to="/app/planos"
            className="app-header-btn"
            style={{ gap: "6px", marginRight: "2px" }}
          >
            <div className="w-5 h-5 rounded bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center flex-shrink-0">
              <Layers className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-sm tracking-tight">Plan Things</span>
          </Link>

          <Link to="/app/planos" className="app-header-btn app-header-btn--icon" title="Painel">
            <Home className="w-4 h-4" />
          </Link>
        </div>

        {/* CENTER */}
        <div className="app-header__center">
          <div className="app-search">
            <Search className="app-search__icon" />
            <input
              type="text"
              placeholder="Buscar..."
              className="app-search__input"
              aria-label="Busca global"
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="app-header__right">
          <button
            className="app-header-btn app-header-btn--primary app-header-btn--icon"
            title="Criar"
            aria-label="Criar novo item"
          >
            <Plus className="w-4 h-4" />
          </button>

          <button
            className="app-header-btn app-header-btn--icon"
            title="Notificações"
            aria-label="Notificações"
          >
            <Bell className="w-4 h-4" />
          </button>

          <button
            className="app-header-btn app-header-btn--icon"
            title="Ajuda"
            aria-label="Ajuda"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          <button
            onClick={handleThemeToggle}
            className="app-header-btn app-header-btn--icon"
            title="Alternar tema"
            aria-label="Alternar tema claro/escuro"
          >
            <Sun className="w-4 h-4 hidden dark:block" />
            <Moon className="w-4 h-4 block dark:hidden" />
          </button>

          {/* Avatar + Dropdown */}
          <div ref={dropdownRef} style={{ position: "relative" }}>
            <button
              className="app-avatar"
              onClick={() => setDropdownOpen((prev) => !prev)}
              aria-expanded={dropdownOpen}
              aria-haspopup="menu"
              aria-label="Menu do usuário"
            >
              {initials}
            </button>

            {dropdownOpen && (
              <div className="app-dropdown" role="menu">
                <div className="app-dropdown__header">
                  <div className="app-dropdown__name">
                    {user?.nome}
                    {user?.sobrenome ? ` ${user.sobrenome}` : ""}
                  </div>
                  <div className="app-dropdown__email">{user?.email}</div>
                </div>

                <Link
                  to="/app/perfil"
                  className="app-dropdown__item"
                  role="menuitem"
                  onClick={() => setDropdownOpen(false)}
                >
                  <User className="w-4 h-4" />
                  Meu perfil
                </Link>

                <div className="app-dropdown__divider" />

                <button
                  className="app-dropdown__item app-dropdown__item--danger"
                  role="menuitem"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ─── Content ────────────────────────────────────────────────────── */}
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
}
