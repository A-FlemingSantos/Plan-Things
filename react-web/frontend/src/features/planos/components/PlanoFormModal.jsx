import { useCallback, useEffect, useRef, useState } from "react";
import { X, ImagePlus, Trash2, ChevronDown, Check, Palette, Upload } from "lucide-react";

/**
 * Preset gradient backgrounds the user can pick as wallpaper.
 */
const WALLPAPER_PRESETS = [
  { id: "blue", label: "azul", bg: "linear-gradient(135deg, #3b82f6, #6366f1)" },
  { id: "cyan", label: "ciano", bg: "linear-gradient(135deg, #06b6d4, #3b82f6)" },
  { id: "purple", label: "roxo", bg: "linear-gradient(135deg, #8b5cf6, #ec4899)" },
  { id: "amber", label: "âmbar", bg: "linear-gradient(135deg, #f59e0b, #ef4444)" },
  { id: "green", label: "verde", bg: "linear-gradient(135deg, #10b981, #06b6d4)" },
  { id: "violet", label: "violeta", bg: "linear-gradient(135deg, #6366f1, #a855f7)" },
  { id: "red", label: "vermelho", bg: "linear-gradient(135deg, #ef4444, #f97316)" },
  { id: "teal", label: "verde-água", bg: "linear-gradient(135deg, #14b8a6, #22d3ee)" },
  { id: "navy", label: "azul-marinho", bg: "linear-gradient(135deg, #1e3a8a, #3b82f6)" },
  { id: "rose", label: "rosa", bg: "linear-gradient(135deg, #e11d48, #f43f5e)" },
];

const MAX_IMAGE_WIDTH = 480;
const MAX_IMAGE_HEIGHT = 240;
const IMAGE_QUALITY = 0.75;
const MAX_FILE_SIZE_MB = 5;

/**
 * Resizes and compresses an image file using a canvas, returning a base64 data URL.
 */
function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        if (width > MAX_IMAGE_WIDTH || height > MAX_IMAGE_HEIGHT) {
          const ratio = Math.min(MAX_IMAGE_WIDTH / width, MAX_IMAGE_HEIGHT / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", IMAGE_QUALITY));
      };
      img.onerror = () => reject(new Error("Não foi possível carregar a imagem."));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error("Não foi possível ler o arquivo."));
    reader.readAsDataURL(file);
  });
}

/** Returns the background style string for the current selection. */
function resolvePreviewBg(selectedWallpaper, customImage) {
  if (customImage) return null;
  const preset = WALLPAPER_PRESETS.find((p) => p.id === selectedWallpaper);
  return preset?.bg || WALLPAPER_PRESETS[0].bg;
}

export function PlanoFormModal({ open, onClose, onSubmit, plano, loading }) {
  const isEditing = !!plano;
  const [nome, setNome] = useState("");
  const [selectedWallpaper, setSelectedWallpaper] = useState(null);
  const [customImage, setCustomImage] = useState(null);
  const [error, setError] = useState("");
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const overlayRef = useRef(null);

  // Populate fields when editing
  useEffect(() => {
    if (open) {
      if (plano) {
        setNome(plano.nome || "");
        if (plano.wallpaperUrl && plano.wallpaperUrl.startsWith("data:")) {
          setCustomImage(plano.wallpaperUrl);
          setSelectedWallpaper(null);
        } else {
          setCustomImage(null);
          const match = WALLPAPER_PRESETS.find((p) => p.bg === plano.wallpaperUrl);
          setSelectedWallpaper(match ? match.id : null);
        }
      } else {
        setNome("");
        setSelectedWallpaper("blue");
        setCustomImage(null);
      }
      setError("");
      setColorPickerOpen(false);
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

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Selecione um arquivo de imagem válido.");
      return;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`A imagem deve ter no máximo ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    try {
      const dataUrl = await compressImage(file);
      setCustomImage(dataUrl);
      setSelectedWallpaper(null);
      if (error) setError("");
    } catch {
      setError("Não foi possível processar a imagem.");
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleRemoveImage() {
    setCustomImage(null);
    setSelectedWallpaper("blue");
  }

  function handleSelectPreset(presetId) {
    setSelectedWallpaper(presetId);
    setCustomImage(null);
  }

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

    const wallpaperUrl = customImage
      ? customImage
      : WALLPAPER_PRESETS.find((p) => p.id === selectedWallpaper)?.bg || null;

    onSubmit({ nome: trimmed, wallpaperUrl });
  }

  if (!open) return null;

  const previewBg = resolvePreviewBg(selectedWallpaper, customImage);
  const activePreset = WALLPAPER_PRESETS.find((p) => p.id === selectedWallpaper);

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
        {/* Live preview banner */}
        <div className="plano-modal__preview">
          <div
            className="plano-modal__preview-bg"
            style={{
              background: customImage ? undefined : previewBg,
              backgroundImage: customImage ? `url(${customImage})` : undefined,
              backgroundSize: customImage ? "cover" : undefined,
              backgroundPosition: customImage ? "center" : undefined,
            }}
          />
          <div className="plano-modal__preview-overlay" />
          <div className="plano-modal__preview-content">
            <h2 className="plano-modal__preview-title">
              {nome.trim() || (isEditing ? "Editar plano" : "Novo plano")}
            </h2>
          </div>
          <button
            className="plano-modal__close"
            onClick={onClose}
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
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
              <div className="plano-field__input-wrapper">
                <input
                  ref={inputRef}
                  id="plano-nome"
                  type="text"
                  className={`plano-field__input ${error ? "plano-field__input--error" : ""}`}
                  placeholder="Ex.: Projeto de marketing do 1º trimestre"
                  value={nome}
                  onChange={(e) => {
                    setNome(e.target.value);
                    if (error) setError("");
                  }}
                  maxLength={50}
                  autoComplete="off"
                />
                <span className={`plano-field__counter ${nome.length >= 45 ? "plano-field__counter--warn" : ""}`}>
                  {nome.length}/50
                </span>
              </div>
              {error && <span className="plano-field__error">{error}</span>}
            </div>

            {/* Aparência section */}
            <div className="plano-field">
              <label className="plano-field__label">Aparência</label>

              <div className="plano-appearance">
                {/* Color picker toggle */}
                <button
                  type="button"
                  className={`plano-color-toggle ${colorPickerOpen ? "plano-color-toggle--open" : ""}`}
                  onClick={() => setColorPickerOpen((v) => !v)}
                  aria-expanded={colorPickerOpen}
                  aria-controls="color-picker-panel"
                >
                  <span className="plano-color-toggle__swatch-wrapper">
                    <Palette className="plano-color-toggle__icon" />
                    <span
                      className="plano-color-toggle__swatch"
                      style={{ background: activePreset?.bg || WALLPAPER_PRESETS[0].bg }}
                    />
                  </span>
                  <span className="plano-color-toggle__text">
                    {customImage ? "Imagem personalizada" : (activePreset?.label || "Escolher cor")}
                  </span>
                  <ChevronDown className={`plano-color-toggle__chevron ${colorPickerOpen ? "plano-color-toggle__chevron--open" : ""}`} />
                </button>

                {/* Expandable color swatches */}
                <div
                  id="color-picker-panel"
                  className={`plano-color-panel ${colorPickerOpen ? "plano-color-panel--open" : ""}`}
                >
                  <div
                    className="plano-color-grid"
                    role="radiogroup"
                    aria-label="Cor de fundo do plano"
                  >
                    {WALLPAPER_PRESETS.map((preset) => {
                      const isActive = selectedWallpaper === preset.id && !customImage;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          role="radio"
                          aria-checked={isActive}
                          aria-label={`Cor ${preset.label}`}
                          className={`plano-color-dot ${isActive ? "plano-color-dot--active" : ""}`}
                          style={{ background: preset.bg }}
                          onClick={() => handleSelectPreset(preset.id)}
                        >
                          {isActive && <Check className="plano-color-dot__check" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Image upload */}
                {customImage ? (
                  <div className="cover-image-preview">
                    <img
                      src={customImage}
                      alt="Pré-visualização da capa"
                      className="cover-image-preview__img"
                    />
                    <button
                      type="button"
                      className="cover-image-preview__remove"
                      onClick={handleRemoveImage}
                      aria-label="Remover imagem de capa"
                      title="Remover imagem"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="cover-image-upload"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4" />
                    <span>Enviar imagem de capa</span>
                  </button>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleFileChange}
                  aria-label="Selecionar imagem de capa"
                />
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
