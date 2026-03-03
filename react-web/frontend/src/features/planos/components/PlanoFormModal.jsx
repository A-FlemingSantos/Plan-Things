import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

/**
 * Preset gradient backgrounds the user can pick as wallpaper.
 */
const WALLPAPER_PRESETS = [
  { id: "blue",    bg: "linear-gradient(135deg, #3b82f6, #6366f1)" },
  { id: "cyan",    bg: "linear-gradient(135deg, #06b6d4, #3b82f6)" },
  { id: "purple",  bg: "linear-gradient(135deg, #8b5cf6, #ec4899)" },
  { id: "amber",   bg: "linear-gradient(135deg, #f59e0b, #ef4444)" },
  { id: "green",   bg: "linear-gradient(135deg, #10b981, #06b6d4)" },
  { id: "violet",  bg: "linear-gradient(135deg, #6366f1, #a855f7)" },
  { id: "red",     bg: "linear-gradient(135deg, #ef4444, #f97316)" },
  { id: "teal",    bg: "linear-gradient(135deg, #14b8a6, #22d3ee)" },
  { id: "navy",    bg: "linear-gradient(135deg, #1e3a8a, #3b82f6)" },
  { id: "rose",    bg: "linear-gradient(135deg, #e11d48, #f43f5e)" },
];

export function PlanoFormModal({ open, onClose, onSubmit, plano, loading }) {
  const isEditing = !!plano;
  const [nome, setNome] = useState("");
  const [selectedWallpaper, setSelectedWallpaper] = useState(null);
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const overlayRef = useRef(null);

  // Populate fields when editing
  useEffect(() => {
    if (open) {
      if (plano) {
        setNome(plano.nome || "");
        // Find matching preset or null
        const match = WALLPAPER_PRESETS.find((p) => p.bg === plano.wallpaperUrl);
        setSelectedWallpaper(match ? match.id : null);
      } else {
        setNome("");
        setSelectedWallpaper("blue");
      }
      setError("");
      // Focus the input after mount
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open, plano]);

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
      setError("Nome é obrigatório.");
      inputRef.current?.focus();
      return;
    }
    if (trimmed.length > 50) {
      setError("Nome deve ter no máximo 50 caracteres.");
      inputRef.current?.focus();
      return;
    }

    const wallpaperUrl =
      WALLPAPER_PRESETS.find((p) => p.id === selectedWallpaper)?.bg || null;

    onSubmit({ nome: trimmed, wallpaperUrl });
  }

  if (!open) return null;

  return (
    <div
      className="plano-modal-overlay"
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={isEditing ? "Editar plano" : "Criar novo plano"}
    >
      <div className="plano-modal">
        {/* Header */}
        <div className="plano-modal__header">
          <h2 className="plano-modal__title">
            {isEditing ? "Editar plano" : "Criar novo plano"}
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
              <label className="plano-field__label" htmlFor="plano-nome">
                Nome do plano
              </label>
              <input
                ref={inputRef}
                id="plano-nome"
                type="text"
                className={`plano-field__input ${error ? "plano-field__input--error" : ""}`}
                placeholder="Ex: Projeto Marketing Q1"
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

            {/* Wallpaper */}
            <div className="plano-field">
              <label className="plano-field__label">Cor de fundo</label>
              <div className="wallpaper-picker" role="radiogroup" aria-label="Cor de fundo do plano">
                {WALLPAPER_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    role="radio"
                    aria-checked={selectedWallpaper === preset.id}
                    aria-label={`Cor ${preset.id}`}
                    className={`wallpaper-swatch ${
                      selectedWallpaper === preset.id
                        ? "wallpaper-swatch--active"
                        : ""
                    }`}
                    style={{ background: preset.bg }}
                    onClick={() => setSelectedWallpaper(preset.id)}
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
                  ? "Salvar alterações"
                  : "Criar plano"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
