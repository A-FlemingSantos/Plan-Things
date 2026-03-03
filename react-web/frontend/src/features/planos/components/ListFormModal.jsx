import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

const COLOR_PRESETS = [
  { id: "blue",   hex: "#3b82f6" },
  { id: "cyan",   hex: "#06b6d4" },
  { id: "green",  hex: "#10b981" },
  { id: "yellow", hex: "#eab308" },
  { id: "orange", hex: "#f97316" },
  { id: "red",    hex: "#ef4444" },
  { id: "pink",   hex: "#ec4899" },
  { id: "purple", hex: "#8b5cf6" },
  { id: "indigo", hex: "#6366f1" },
  { id: "teal",   hex: "#14b8a6" },
];

export function ListFormModal({ open, onClose, onSubmit, lista, loading }) {
  const isEditing = !!lista;
  const [nome, setNome] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const overlayRef = useRef(null);

  // Populate fields
  useEffect(() => {
    if (open) {
      if (lista) {
        setNome(lista.nome || "");
        const match = COLOR_PRESETS.find((c) => c.hex === lista.cor);
        setSelectedColor(match ? match.id : null);
      } else {
        setNome("");
        setSelectedColor(null);
      }
      setError("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open, lista]);

  // Close on Escape
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

  function handleSubmit(e) {
    e.preventDefault();

    const trimmed = nome.trim();
    if (!trimmed) {
      setError("Nome e obrigatorio.");
      inputRef.current?.focus();
      return;
    }
    if (trimmed.length > 50) {
      setError("Nome deve ter no maximo 50 caracteres.");
      inputRef.current?.focus();
      return;
    }

    const cor = COLOR_PRESETS.find((c) => c.id === selectedColor)?.hex || null;
    onSubmit({ nome: trimmed, cor });
  }

  if (!open) return null;

  return (
    <div
      className="plano-modal-overlay"
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={isEditing ? "Editar lista" : "Criar nova lista"}
    >
      <div className="plano-modal" style={{ maxWidth: 420 }}>
        {/* Header */}
        <div className="plano-modal__header">
          <h2 className="plano-modal__title">
            {isEditing ? "Editar lista" : "Criar nova lista"}
          </h2>
          <button
            className="plano-modal__close"
            onClick={onClose}
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="plano-modal__body">
            {/* Nome */}
            <div className="plano-field">
              <label className="plano-field__label" htmlFor="lista-nome">
                Nome da lista
              </label>
              <input
                ref={inputRef}
                id="lista-nome"
                type="text"
                className={`plano-field__input ${error ? "plano-field__input--error" : ""}`}
                placeholder="Ex: A Fazer, Em Progresso, Concluido"
                value={nome}
                onChange={(e) => {
                  setNome(e.target.value);
                  if (error) setError("");
                }}
                maxLength={50}
                autoComplete="off"
              />
              {error ? (
                <span className="plano-field__error">{error}</span>
              ) : (
                <span className="plano-field__hint">{nome.length}/50</span>
              )}
            </div>

            {/* Color picker */}
            <div className="plano-field">
              <label className="plano-field__label">Cor da lista (opcional)</label>
              <div className="color-picker" role="radiogroup" aria-label="Cor da lista">
                {/* No color option */}
                <button
                  type="button"
                  role="radio"
                  aria-checked={selectedColor === null}
                  aria-label="Sem cor"
                  className={`color-swatch color-swatch--none ${
                    selectedColor === null ? "color-swatch--active" : ""
                  }`}
                  onClick={() => setSelectedColor(null)}
                >
                  <X className="w-3 h-3" />
                </button>

                {COLOR_PRESETS.map((color) => (
                  <button
                    key={color.id}
                    type="button"
                    role="radio"
                    aria-checked={selectedColor === color.id}
                    aria-label={`Cor ${color.id}`}
                    className={`color-swatch ${
                      selectedColor === color.id ? "color-swatch--active" : ""
                    }`}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => setSelectedColor(color.id)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="plano-modal__footer">
            <button
              type="button"
              className="plano-btn plano-btn--secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="plano-btn plano-btn--primary"
              disabled={loading}
            >
              {loading
                ? isEditing
                  ? "Salvando..."
                  : "Criando..."
                : isEditing
                  ? "Salvar alteracoes"
                  : "Criar lista"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
