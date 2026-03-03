import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  Loader2,
  Pencil,
  RefreshCw,
  Shield,
  User,
  X,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import apiClient, { normalizeError } from "@/lib/apiClient";
import "./styles/perfil-page.css";

// ─── Page states ────────────────────────────────────────────────────────────
const STATE = { LOADING: "loading", SUCCESS: "success", ERROR: "error" };

function getInitials(nome, sobrenome) {
  const first = nome?.[0] || "";
  const last = sobrenome?.[0] || "";
  return (first + last).toUpperCase() || "?";
}

// ─── Delete Confirm Modal ───────────────────────────────────────────────────
function DeletePerfilModal({ open, onClose, onConfirm, loading }) {
  const overlayRef = useRef(null);
  const cancelRef = useRef(null);

  useEffect(() => {
    if (open) setTimeout(() => cancelRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleEsc(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  const handleOverlayClick = useCallback(
    (e) => {
      if (e.target === overlayRef.current) onClose();
    },
    [onClose]
  );

  if (!open) return null;

  return (
    <div
      className="perfil-modal-overlay"
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label="Confirmar inativacao do perfil"
    >
      <div className="perfil-modal">
        <div className="perfil-modal__header">
          <h2 className="perfil-modal__title">Inativar perfil</h2>
          <button
            className="perfil-modal__close"
            onClick={onClose}
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="perfil-modal__body">
          <div className="perfil-modal__icon">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <p className="perfil-modal__text">
            Tem certeza que deseja <strong>inativar seu perfil</strong>?
            <br />
            Sua conta sera desativada e voce sera desconectado imediatamente.
            <br />
            <br />
            Esta acao pode ser irreversivel.
          </p>
        </div>

        <div className="perfil-modal__footer">
          <button
            ref={cancelRef}
            className="perfil-btn perfil-btn--secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            className="perfil-btn perfil-btn--danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Inativando...
              </>
            ) : (
              "Inativar perfil"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton Loading ───────────────────────────────────────────────────────
function PerfilSkeleton() {
  return (
    <div className="perfil-section">
      <div className="perfil-section__body">
        <div className="perfil-skeleton">
          <div className="perfil-skeleton__avatar-row">
            <div className="perfil-skeleton__circle" />
            <div className="perfil-skeleton__lines">
              <div className="perfil-skeleton__line perfil-skeleton__line--medium" />
              <div className="perfil-skeleton__line perfil-skeleton__line--short" />
            </div>
          </div>
          <div className="perfil-skeleton__field-row">
            <div className="perfil-skeleton__field">
              <div className="perfil-skeleton__field-label" />
              <div className="perfil-skeleton__field-input" />
            </div>
            <div className="perfil-skeleton__field">
              <div className="perfil-skeleton__field-label" />
              <div className="perfil-skeleton__field-input" />
            </div>
          </div>
          <div className="perfil-skeleton__field">
            <div className="perfil-skeleton__field-label" />
            <div className="perfil-skeleton__field-input" />
          </div>
          <div className="perfil-skeleton__field">
            <div className="perfil-skeleton__field-label" />
            <div className="perfil-skeleton__field-input" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export function PerfilPage() {
  const { user, perfilId, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  // page state
  const [pageState, setPageState] = useState(STATE.LOADING);
  const [errorMessage, setErrorMessage] = useState("");

  // profile data from API
  const [perfil, setPerfil] = useState(null);

  // form state
  const [editing, setEditing] = useState(false);
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [saving, setSaving] = useState(false);

  // delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // toast
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const nomeRef = useRef(null);

  // ── Toast helper ────────────────────────────────────────────────────────
  const showToast = useCallback((type, message) => {
    clearTimeout(toastTimer.current);
    setToast({ type, message });
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  }, []);

  // ── Fetch profile ───────────────────────────────────────────────────────
  const fetchPerfil = useCallback(async () => {
    if (!perfilId) return;
    setPageState(STATE.LOADING);
    try {
      const { data } = await apiClient.get(`/perfil/${perfilId}`);
      setPerfil(data);
      setPageState(STATE.SUCCESS);
    } catch (err) {
      const normalized = normalizeError(err);
      setErrorMessage(normalized.message);
      setPageState(STATE.ERROR);
    }
  }, [perfilId]);

  useEffect(() => {
    fetchPerfil();
  }, [fetchPerfil]);

  // ── Populate form when entering edit mode ───────────────────────────────
  const startEditing = useCallback(() => {
    if (!perfil) return;
    setNome(perfil.nome || "");
    setSobrenome(perfil.sobrenome || "");
    setTelefone(perfil.telefone || "");
    setEmail(perfil.email || "");
    setFormErrors({});
    setApiError("");
    setEditing(true);
    setTimeout(() => nomeRef.current?.focus(), 50);
  }, [perfil]);

  const cancelEditing = useCallback(() => {
    setEditing(false);
    setFormErrors({});
    setApiError("");
  }, []);

  // ── Validate ────────────────────────────────────────────────────────────
  function validate() {
    const errs = {};
    const trimmedNome = nome.trim();
    const trimmedEmail = email.trim();

    if (!trimmedNome) errs.nome = "Nome e obrigatorio.";
    else if (trimmedNome.length > 50) errs.nome = "Nome deve ter no maximo 50 caracteres.";

    if (!trimmedEmail) errs.email = "E-mail e obrigatorio.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail))
      errs.email = "Formato de e-mail invalido.";
    else if (trimmedEmail.length > 320)
      errs.email = "E-mail deve ter no maximo 320 caracteres.";

    if (sobrenome.trim().length > 50)
      errs.sobrenome = "Sobrenome deve ter no maximo 50 caracteres.";

    if (telefone.trim() && !/^[0-9+() -]{1,20}$/.test(telefone.trim()))
      errs.telefone = "Telefone invalido.";

    return errs;
  }

  // ── Save ────────────────────────────────────────────────────────────────
  async function handleSave(e) {
    e.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    setSaving(true);
    setApiError("");

    try {
      const payload = {
        nome: nome.trim(),
        sobrenome: sobrenome.trim() || null,
        telefone: telefone.trim() || null,
        email: email.trim(),
      };

      const { data } = await apiClient.put(`/perfil/${perfilId}`, payload);
      setPerfil(data);
      updateUser(data);
      setEditing(false);
      showToast("success", "Perfil atualizado com sucesso.");
    } catch (err) {
      const normalized = normalizeError(err);
      setApiError(normalized.message);
    } finally {
      setSaving(false);
    }
  }

  // ── Delete (inactivate) ─────────────────────────────────────────────────
  async function handleDelete() {
    setDeleting(true);
    try {
      await apiClient.delete(`/perfil/${perfilId}`);
      setDeleteModalOpen(false);
      logout();
      navigate("/login", { replace: true });
    } catch (err) {
      const normalized = normalizeError(err);
      setDeleteModalOpen(false);
      showToast("error", normalized.message);
    } finally {
      setDeleting(false);
    }
  }

  // ── Render: Loading ─────────────────────────────────────────────────────
  if (pageState === STATE.LOADING) {
    return (
      <div className="perfil-page">
        <div className="perfil-page__header">
          <h1 className="perfil-page__title">Meu Perfil</h1>
          <p className="perfil-page__subtitle">
            Gerencie suas informacoes pessoais e configuracoes da conta.
          </p>
        </div>
        <PerfilSkeleton />
      </div>
    );
  }

  // ── Render: Error ───────────────────────────────────────────────────────
  if (pageState === STATE.ERROR) {
    return (
      <div className="perfil-page">
        <div className="perfil-page__header">
          <h1 className="perfil-page__title">Meu Perfil</h1>
        </div>
        <div className="perfil-section">
          <div className="perfil-error">
            <div className="perfil-error__icon">
              <XCircle className="w-7 h-7" />
            </div>
            <h2 className="perfil-error__title">Erro ao carregar perfil</h2>
            <p className="perfil-error__message">{errorMessage}</p>
            <button
              className="perfil-btn perfil-btn--primary"
              onClick={fetchPerfil}
            >
              <RefreshCw className="w-4 h-4" />
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Render: Success ─────────────────────────────────────────────────────
  const initials = getInitials(perfil?.nome, perfil?.sobrenome);

  return (
    <div className="perfil-page">
      <div className="perfil-page__header">
        <h1 className="perfil-page__title">Meu Perfil</h1>
        <p className="perfil-page__subtitle">
          Gerencie suas informacoes pessoais e configuracoes da conta.
        </p>
      </div>

      {/* ─── Dados cadastrais ──────────────────────────────────────────── */}
      <div className="perfil-section">
        <div className="perfil-section__header">
          <h2 className="perfil-section__title">Dados cadastrais</h2>
          {!editing && (
            <button
              className="perfil-btn perfil-btn--secondary"
              onClick={startEditing}
              aria-label="Editar perfil"
            >
              <Pencil className="w-3.5 h-3.5" />
              Editar
            </button>
          )}
        </div>

        <div className="perfil-section__body">
          {/* Avatar block */}
          <div className="perfil-avatar-block">
            <div className="perfil-avatar" aria-hidden="true">
              {initials}
            </div>
            <div>
              <div className="perfil-avatar-info__name">
                {perfil?.nome}
                {perfil?.sobrenome ? ` ${perfil.sobrenome}` : ""}
              </div>
              <div className="perfil-avatar-info__email">{perfil?.email}</div>
            </div>
          </div>

          {editing ? (
            /* ── Edit mode ───────────────────────────────────────────── */
            <form onSubmit={handleSave} className="perfil-form" noValidate>
              {apiError && (
                <div className="perfil-alert perfil-alert--error" role="alert">
                  <XCircle className="w-4 h-4 perfil-alert__icon" />
                  <span>{apiError}</span>
                </div>
              )}

              <div className="perfil-form__row">
                <div className="perfil-field">
                  <label className="perfil-field__label" htmlFor="perfil-nome">
                    Nome
                  </label>
                  <input
                    ref={nomeRef}
                    id="perfil-nome"
                    type="text"
                    className={`perfil-field__input ${formErrors.nome ? "perfil-field__input--error" : ""}`}
                    value={nome}
                    onChange={(e) => {
                      setNome(e.target.value);
                      if (formErrors.nome) setFormErrors((p) => ({ ...p, nome: "" }));
                    }}
                    maxLength={50}
                    placeholder="Seu nome"
                    autoComplete="given-name"
                    disabled={saving}
                  />
                  {formErrors.nome ? (
                    <span className="perfil-field__error">{formErrors.nome}</span>
                  ) : (
                    <span className="perfil-field__hint">{nome.length}/50</span>
                  )}
                </div>

                <div className="perfil-field">
                  <label className="perfil-field__label" htmlFor="perfil-sobrenome">
                    Sobrenome
                  </label>
                  <input
                    id="perfil-sobrenome"
                    type="text"
                    className={`perfil-field__input ${formErrors.sobrenome ? "perfil-field__input--error" : ""}`}
                    value={sobrenome}
                    onChange={(e) => {
                      setSobrenome(e.target.value);
                      if (formErrors.sobrenome) setFormErrors((p) => ({ ...p, sobrenome: "" }));
                    }}
                    maxLength={50}
                    placeholder="Seu sobrenome"
                    autoComplete="family-name"
                    disabled={saving}
                  />
                  {formErrors.sobrenome ? (
                    <span className="perfil-field__error">{formErrors.sobrenome}</span>
                  ) : (
                    <span className="perfil-field__hint">{sobrenome.length}/50</span>
                  )}
                </div>
              </div>

              <div className="perfil-field">
                <label className="perfil-field__label" htmlFor="perfil-email">
                  E-mail
                </label>
                <input
                  id="perfil-email"
                  type="email"
                  className={`perfil-field__input ${formErrors.email ? "perfil-field__input--error" : ""}`}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (formErrors.email) setFormErrors((p) => ({ ...p, email: "" }));
                  }}
                  maxLength={320}
                  placeholder="seu@email.com"
                  autoComplete="email"
                  disabled={saving}
                />
                {formErrors.email && (
                  <span className="perfil-field__error">{formErrors.email}</span>
                )}
              </div>

              <div className="perfil-field">
                <label className="perfil-field__label" htmlFor="perfil-telefone">
                  Telefone
                </label>
                <input
                  id="perfil-telefone"
                  type="tel"
                  className={`perfil-field__input ${formErrors.telefone ? "perfil-field__input--error" : ""}`}
                  value={telefone}
                  onChange={(e) => {
                    setTelefone(e.target.value);
                    if (formErrors.telefone) setFormErrors((p) => ({ ...p, telefone: "" }));
                  }}
                  maxLength={20}
                  placeholder="(00) 00000-0000"
                  autoComplete="tel"
                  disabled={saving}
                />
                {formErrors.telefone ? (
                  <span className="perfil-field__error">{formErrors.telefone}</span>
                ) : (
                  <span className="perfil-field__hint">Opcional</span>
                )}
              </div>

              <div className="perfil-form__actions">
                <button
                  type="button"
                  className="perfil-btn perfil-btn--secondary"
                  onClick={cancelEditing}
                  disabled={saving}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="perfil-btn perfil-btn--primary"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar alteracoes"
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* ── View mode ───────────────────────────────────────────── */
            <div className="perfil-form">
              <div className="perfil-form__row">
                <div className="perfil-field">
                  <span className="perfil-field__label">Nome</span>
                  <span className="perfil-field__input" style={{ display: "flex", alignItems: "center", background: "transparent", border: "none", padding: "0", height: "auto" }}>
                    {perfil?.nome || "\u2014"}
                  </span>
                </div>
                <div className="perfil-field">
                  <span className="perfil-field__label">Sobrenome</span>
                  <span className="perfil-field__input" style={{ display: "flex", alignItems: "center", background: "transparent", border: "none", padding: "0", height: "auto" }}>
                    {perfil?.sobrenome || "\u2014"}
                  </span>
                </div>
              </div>

              <div className="perfil-field">
                <span className="perfil-field__label">E-mail</span>
                <span className="perfil-field__input" style={{ display: "flex", alignItems: "center", background: "transparent", border: "none", padding: "0", height: "auto" }}>
                  {perfil?.email || "\u2014"}
                </span>
              </div>

              <div className="perfil-field">
                <span className="perfil-field__label">Telefone</span>
                <span className="perfil-field__input" style={{ display: "flex", alignItems: "center", background: "transparent", border: "none", padding: "0", height: "auto" }}>
                  {perfil?.telefone || "Nao informado"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── Danger zone ───────────────────────────────────────────────── */}
      <div className="perfil-section perfil-danger-zone">
        <div className="perfil-section__header">
          <h2 className="perfil-danger-zone__title">
            <Shield className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
            Zona de risco
          </h2>
        </div>
        <div className="perfil-danger-zone__body">
          <p className="perfil-danger-zone__description">
            Ao inativar seu perfil, sua conta sera desativada e voce perdera acesso
            a todos os seus planos, listas e cartoes. Esta acao pode ser irreversivel.
          </p>
          <button
            className="perfil-btn perfil-btn--outline-danger"
            onClick={() => setDeleteModalOpen(true)}
          >
            <AlertTriangle className="w-4 h-4" />
            Inativar perfil
          </button>
        </div>
      </div>

      {/* ─── Delete Modal ──────────────────────────────────────────────── */}
      <DeletePerfilModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        loading={deleting}
      />

      {/* ─── Toast ─────────────────────────────────────────────────────── */}
      {toast && (
        <div className={`perfil-toast perfil-toast--${toast.type}`} role="status">
          {toast.type === "success" ? (
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
