import { useCallback, useEffect, useRef, useState } from "react";
import { X, CheckSquare, Calendar } from "lucide-react";

const COLOR_PRESETS = [
  { id: "blue", label: "azul", hex: "#3b82f6" },
  { id: "cyan", label: "ciano", hex: "#06b6d4" },
  { id: "green", label: "verde", hex: "#10b981" },
  { id: "yellow", label: "amarelo", hex: "#eab308" },
  { id: "orange", label: "laranja", hex: "#f97316" },
  { id: "red", label: "vermelho", hex: "#ef4444" },
  { id: "pink", label: "rosa", hex: "#ec4899" },
  { id: "purple", label: "roxo", hex: "#8b5cf6" },
  { id: "indigo", label: "índigo", hex: "#6366f1" },
  { id: "teal", label: "verde-água", hex: "#14b8a6" },
];

function toLocalDatetimeValue(isoStr) {
  if (!isoStr) return "";
  const d = new Date(isoStr);
  if (isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function CardFormModal({ open, onClose, onSubmit, cartao, loading }) {
  const isEditing = !!cartao;
  const [tipo, setTipo] = useState("TAREFA");
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  const [dataConclusao, setDataConclusao] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [errors, setErrors] = useState({});
  const inputRef = useRef(null);
  const overlayRef = useRef(null);

  // Populate fields
  useEffect(() => {
    if (open) {
      if (cartao) {
        setTipo(cartao.tipo || "TAREFA");
        setNome(cartao.nome || "");
        setDescricao(cartao.descricao || "");
        const match = COLOR_PRESETS.find((c) => c.hex === cartao.cor);
        setSelectedColor(match ? match.id : null);
        setDataConclusao(toLocalDatetimeValue(cartao.dataConclusao));
        setDataInicio(toLocalDatetimeValue(cartao.dataInicio));
        setDataFim(toLocalDatetimeValue(cartao.dataFim));
      } else {
        setNome("");
        setDescricao("");
        setSelectedColor(null);
        setDataConclusao("");
        setDataInicio("");
        setDataFim("");
      }
      setErrors({});
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open, cartao]);

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

  function validate() {
    const errs = {};
    const trimmedNome = nome.trim();

    if (!trimmedNome) {
      errs.nome = "Nome é obrigatório.";
    } else if (trimmedNome.length > 50) {
      errs.nome = "Nome deve ter no máximo 50 caracteres.";
    }

    if (descricao.length > 500) {
      errs.descricao = "Descrição deve ter no máximo 500 caracteres.";
    }

    if (tipo === "TAREFA") {
      if (!dataConclusao) {
        errs.dataConclusao = "A data de conclusão é obrigatória.";
      }
    }

    if (tipo === "EVENTO") {
      if (!dataInicio) {
        errs.dataInicio = "A data de início é obrigatória.";
      }
      if (!dataFim) {
        errs.dataFim = "A data de fim é obrigatória.";
      }
      if (dataInicio && dataFim && new Date(dataFim) < new Date(dataInicio)) {
        errs.dataFim = "A data de fim não pode ser anterior à data de início.";
      }
    }

    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const cor = COLOR_PRESETS.find((c) => c.id === selectedColor)?.hex || null;
    const payload = {
      nome: nome.trim(),
      descricao: descricao.trim() || null,
      cor,
    };

    if (tipo === "TAREFA") {
      payload.dataConclusao = dataConclusao;
    } else {
      payload.dataInicio = dataInicio;
      payload.dataFim = dataFim;
    }

    onSubmit(tipo, payload);
  }

  function clearError(field) {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  if (!open) return null;

  const isTarefa = tipo === "TAREFA";

  return (
    <div
      className="plano-modal-overlay"
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={isEditing ? "Editar cartão" : "Novo cartão"}
    >
      <div className="plano-modal" style={{ maxWidth: 520 }}>
        {/* Header */}
        <div className="plano-modal__header">
          <h2 className="plano-modal__title">
            {isEditing ? "Editar cartão" : "Novo cartão"}
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
            {/* Type selector (only for creation) */}
            {!isEditing && (
              <div className="plano-field">
                <label className="plano-field__label">Tipo do cartão</label>
                <div className="card-type-selector" role="radiogroup" aria-label="Tipo do cartão">
                  <button
                    type="button"
                    role="radio"
                    aria-checked={isTarefa}
                    className={`card-type-option ${isTarefa ? "card-type-option--active" : ""}`}
                    onClick={() => setTipo("TAREFA")}
                  >
                    <CheckSquare className="w-4 h-4" />
                    <span>Tarefa</span>
                  </button>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={!isTarefa}
                    className={`card-type-option ${!isTarefa ? "card-type-option--active" : ""}`}
                    onClick={() => setTipo("EVENTO")}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Evento</span>
                  </button>
                </div>
              </div>
            )}

            {/* Type badge (only for edit) */}
            {isEditing && (
              <div className="plano-field">
                <label className="plano-field__label">Tipo</label>
                <div className={`card-item__badge card-item__badge--${isTarefa ? "tarefa" : "evento"}`} style={{ width: "fit-content" }}>
                  {isTarefa ? (
                    <><CheckSquare className="w-3 h-3" /> Tarefa</>
                  ) : (
                    <><Calendar className="w-3 h-3" /> Evento</>
                  )}
                </div>
              </div>
            )}

            {/* Nome */}
            <div className="plano-field">
              <label className="plano-field__label" htmlFor="card-nome">
                Nome
              </label>
              <input
                ref={inputRef}
                id="card-nome"
                type="text"
                className={`plano-field__input ${errors.nome ? "plano-field__input--error" : ""}`}
                placeholder="Nome do cartão"
                value={nome}
                onChange={(e) => {
                  setNome(e.target.value);
                  clearError("nome");
                }}
                maxLength={50}
                autoComplete="off"
              />
              {errors.nome ? (
                <span className="plano-field__error">{errors.nome}</span>
              ) : (
                <span className="plano-field__hint">{nome.length}/50</span>
              )}
            </div>

            {/* Descricao */}
            <div className="plano-field">
              <label className="plano-field__label" htmlFor="card-descricao">
                Descrição (opcional)
              </label>
              <textarea
                id="card-descricao"
                className={`plano-field__input plano-field__textarea ${errors.descricao ? "plano-field__input--error" : ""}`}
                placeholder="Descrição detalhada do cartão"
                value={descricao}
                onChange={(e) => {
                  setDescricao(e.target.value);
                  clearError("descricao");
                }}
                maxLength={500}
                rows={3}
              />
              {errors.descricao ? (
                <span className="plano-field__error">{errors.descricao}</span>
              ) : (
                <span className="plano-field__hint">{descricao.length}/500</span>
              )}
            </div>

            {/* Date fields — Tarefa */}
            {isTarefa && (
              <div className="plano-field">
                <label className="plano-field__label" htmlFor="card-data-conclusao">
                  Data de conclusão
                </label>
                <input
                  id="card-data-conclusao"
                  type="datetime-local"
                  className={`plano-field__input ${errors.dataConclusao ? "plano-field__input--error" : ""}`}
                  value={dataConclusao}
                  onChange={(e) => {
                    setDataConclusao(e.target.value);
                    clearError("dataConclusao");
                  }}
                />
                {errors.dataConclusao && (
                  <span className="plano-field__error">{errors.dataConclusao}</span>
                )}
              </div>
            )}

            {/* Date fields — Evento */}
            {!isTarefa && (
              <>
                <div className="card-form__date-row">
                  <div className="plano-field" style={{ flex: 1 }}>
                    <label className="plano-field__label" htmlFor="card-data-inicio">
                      Início
                    </label>
                    <input
                      id="card-data-inicio"
                      type="datetime-local"
                      className={`plano-field__input ${errors.dataInicio ? "plano-field__input--error" : ""}`}
                      value={dataInicio}
                      onChange={(e) => {
                        setDataInicio(e.target.value);
                        clearError("dataInicio");
                      }}
                    />
                    {errors.dataInicio && (
                      <span className="plano-field__error">{errors.dataInicio}</span>
                    )}
                  </div>

                  <div className="plano-field" style={{ flex: 1 }}>
                    <label className="plano-field__label" htmlFor="card-data-fim">
                      Fim
                    </label>
                    <input
                      id="card-data-fim"
                      type="datetime-local"
                      className={`plano-field__input ${errors.dataFim ? "plano-field__input--error" : ""}`}
                      value={dataFim}
                      onChange={(e) => {
                        setDataFim(e.target.value);
                        clearError("dataFim");
                      }}
                    />
                    {errors.dataFim && (
                      <span className="plano-field__error">{errors.dataFim}</span>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Color picker */}
            <div className="plano-field">
              <label className="plano-field__label">Cor (opcional)</label>
               <div className="color-picker" role="radiogroup" aria-label="Cor do cartão">
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
                    aria-label={`Cor ${color.label}`}
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
                  ? "Salvar alterações"
                  : "Criar cartão"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
