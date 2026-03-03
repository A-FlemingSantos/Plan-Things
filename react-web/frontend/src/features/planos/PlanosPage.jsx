import { useCallback, useEffect, useState } from "react";
import {
  Layers,
  Plus,
  SlidersHorizontal,
  ArrowUpDown,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import apiClient, { normalizeError } from "@/lib/apiClient";
import { PlanoCard } from "./components/PlanoCard";
import { PlanoFormModal } from "./components/PlanoFormModal";
import { DeleteConfirmModal } from "./components/DeleteConfirmModal";
import "./styles/planos-page.css";

const TABS = [
  { id: "recentes", label: "Recentes", enabled: true },
  { id: "favoritos", label: "Favoritos", enabled: false },
  { id: "compartilhados", label: "Compartilhados", enabled: false },
  { id: "arquivados", label: "Arquivados", enabled: false },
];

const SORT_OPTIONS = { recent: "Recentes", alpha: "A-Z" };

function sortPlanos(planos, sortBy) {
  const sorted = [...planos];
  if (sortBy === "alpha") {
    sorted.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
  } else {
    // recent = highest id first (newest)
    sorted.sort((a, b) => b.id - a.id);
  }
  return sorted;
}

export function PlanosPage() {
  const { user, perfilId } = useAuth();

  // Data state
  const [planos, setPlanos] = useState([]);
  const [pageState, setPageState] = useState("loading"); // loading | success | error | empty
  const [errorMessage, setErrorMessage] = useState("");

  // UI state
  const [activeTab, setActiveTab] = useState("recentes");
  const [sortBy, setSortBy] = useState("recent");

  // Modals
  const [formOpen, setFormOpen] = useState(false);
  const [editingPlano, setEditingPlano] = useState(null);
  const [deletingPlano, setDeletingPlano] = useState(false);
  const [planoToDelete, setPlanoToDelete] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);

  // ─── Show toast ────────────────────────────────────────────────────────
  const showToast = useCallback((type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // ─── Fetch planos ──────────────────────────────────────────────────────
  const fetchPlanos = useCallback(async () => {
    if (!perfilId) return;

    setPageState("loading");
    setErrorMessage("");

    try {
      const res = await apiClient.get(`/planos/perfil/${perfilId}`);
      const data = res.data;

      if (data.length === 0) {
        setPlanos([]);
        setPageState("empty");
      } else {
        setPlanos(data);
        setPageState("success");
      }
    } catch (err) {
      const normalized = normalizeError(err);
      setErrorMessage(normalized.message);
      setPageState("error");
    }
  }, [perfilId]);

  useEffect(() => {
    fetchPlanos();
  }, [fetchPlanos]);

  // ─── Create plano ─────────────────────────────────────────────────────
  async function handleCreate(data) {
    setModalLoading(true);
    try {
      await apiClient.post(`/planos/perfil/${perfilId}`, data);
      setFormOpen(false);
      showToast("success", "Plano criado com sucesso!");
      await fetchPlanos();
    } catch (err) {
      const normalized = normalizeError(err);
      showToast("error", normalized.message);
    } finally {
      setModalLoading(false);
    }
  }

  // ─── Edit plano ────────────────────────────────────────────────────────
  async function handleEdit(data) {
    if (!editingPlano) return;

    setModalLoading(true);
    try {
      await apiClient.put(
        `/planos/perfil/${perfilId}/${editingPlano.id}`,
        data
      );
      setFormOpen(false);
      setEditingPlano(null);
      showToast("success", "Plano atualizado com sucesso!");
      await fetchPlanos();
    } catch (err) {
      const normalized = normalizeError(err);
      showToast("error", normalized.message);
    } finally {
      setModalLoading(false);
    }
  }

  // ─── Delete plano ──────────────────────────────────────────────────────
  async function handleDelete(plano) {
    setModalLoading(true);
    try {
      await apiClient.delete(`/planos/perfil/${perfilId}/${plano.id}`);
      setDeletingPlano(false);
      setPlanoToDelete(null);
      showToast("success", "Plano excluído com sucesso!");
      await fetchPlanos();
    } catch (err) {
      const normalized = normalizeError(err);
      showToast("error", normalized.message);
    } finally {
      setModalLoading(false);
    }
  }

  // ─── Open modals ───────────────────────────────────────────────────────
  function openCreate() {
    setEditingPlano(null);
    setFormOpen(true);
  }

  function openEdit(plano) {
    setEditingPlano(plano);
    setFormOpen(true);
  }

  function openDelete(plano) {
    setPlanoToDelete(plano);
    setDeletingPlano(true);
  }

  // ─── Toggle sort ───────────────────────────────────────────────────────
  function toggleSort() {
    setSortBy((prev) => (prev === "recent" ? "alpha" : "recent"));
  }

  // ─── Derived data ──────────────────────────────────────────────────────
  const displayPlanos = sortPlanos(planos, sortBy);

  // ─── Skeleton (loading state) ──────────────────────────────────────────
  function renderSkeletons() {
    return (
      <div className="planos-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="plano-skeleton" style={{ animationDelay: `${i * 0.08}s` }}>
            <div className="plano-skeleton__cover" />
            <div className="plano-skeleton__body">
              <div className="plano-skeleton__line" />
              <div className="plano-skeleton__line plano-skeleton__line--short" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ─── Empty state ───────────────────────────────────────────────────────
  function renderEmpty() {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-400/20 to-brand-600/20 dark:from-brand-400/10 dark:to-brand-600/10 flex items-center justify-center mb-6">
          <Layers className="w-8 h-8 text-brand-500" />
        </div>
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
          Nenhum plano criado ainda
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">
          Crie seu primeiro plano para começar a organizar tarefas, listas e muito mais.
        </p>
        <button
          className="glass-button-primary px-6 py-2.5 rounded-lg text-white text-sm font-medium"
          onClick={openCreate}
        >
          + Criar novo plano
        </button>
      </div>
    );
  }

  // ─── Error state ───────────────────────────────────────────────────────
  function renderError() {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
          Erro ao carregar planos
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">
          {errorMessage}
        </p>
        <button
          className="glass-button-secondary px-6 py-2.5 rounded-lg text-sm font-medium"
          onClick={fetchPlanos}
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  // ─── Success state (grid) ──────────────────────────────────────────────
  function renderGrid() {
    return (
      <div className="planos-grid animate-fade-in">
        {displayPlanos.map((plano) => (
          <PlanoCard
            key={plano.id}
            plano={plano}
            onEdit={openEdit}
            onDelete={openDelete}
          />
        ))}

        {/* New plan card */}
        <button
          className="plano-card--new"
          onClick={openCreate}
          aria-label="Criar novo plano"
        >
          <div className="plano-card--new__icon">
            <Plus className="w-5 h-5" />
          </div>
          <span className="plano-card--new__label">Criar novo plano</span>
        </button>
      </div>
    );
  }

  // ─── Render ────────────────────────────────────────────────────────────
  return (
    <div className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">
          Meus Planos
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Bem-vindo, {user?.nome}. Gerencie seus projetos a partir daqui.
        </p>
      </div>

      {/* Secondary bar */}
      <div className="planos-bar">
        <div className="planos-bar__left">
          {/* Tabs */}
          <div className="planos-tabs" role="tablist" aria-label="Filtrar planos">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                className={`planos-tab ${activeTab === tab.id ? "planos-tab--active" : ""}`}
                disabled={!tab.enabled}
                onClick={() => setActiveTab(tab.id)}
                title={!tab.enabled ? "Em breve" : undefined}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="planos-bar__right">
          {/* Filter */}
          <button
            className="planos-filter-btn"
            title="Filtros (em breve)"
            disabled
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filtrar</span>
          </button>

          {/* Sort */}
          <button className="planos-filter-btn" onClick={toggleSort} title={`Ordenar: ${SORT_OPTIONS[sortBy]}`}>
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>{SORT_OPTIONS[sortBy]}</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {pageState === "loading" && renderSkeletons()}
      {pageState === "empty" && renderEmpty()}
      {pageState === "error" && renderError()}
      {pageState === "success" && renderGrid()}

      {/* Create / Edit Modal */}
      <PlanoFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingPlano(null);
        }}
        onSubmit={editingPlano ? handleEdit : handleCreate}
        plano={editingPlano}
        loading={modalLoading}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        open={deletingPlano}
        onClose={() => {
          setDeletingPlano(false);
          setPlanoToDelete(null);
        }}
        onConfirm={handleDelete}
        plano={planoToDelete}
        loading={modalLoading}
      />

      {/* Toast */}
      {toast && (
        <div className={`plano-toast plano-toast--${toast.type}`}>
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
