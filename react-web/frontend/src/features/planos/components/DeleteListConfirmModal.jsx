import { useCallback, useEffect, useRef } from "react";
import { AlertTriangle, X } from "lucide-react";

export function DeleteListConfirmModal({ open, onClose, onConfirm, lista, loading }) {
  const overlayRef = useRef(null);
  const cancelRef = useRef(null);

  // Focus cancel on open
  useEffect(() => {
    if (open) {
      setTimeout(() => cancelRef.current?.focus(), 50);
    }
  }, [open]);

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

  if (!open || !lista) return null;

  return (
    <div
      className="plano-modal-overlay"
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
        aria-label="Confirmar exclusão"
    >
      <div className="plano-modal" style={{ maxWidth: 400 }}>
        <div className="plano-modal__header">
          <h2 className="plano-modal__title">Excluir lista</h2>
          <button
            className="plano-modal__close"
            onClick={onClose}
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="plano-modal__body">
          <div className="delete-modal__icon">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <p className="delete-modal__text">
            Tem certeza que deseja excluir a lista{" "}
            <span className="delete-modal__name">{lista.nome}</span>?
            <br />
            Todos os cartões desta lista serão removidos. Esta ação não pode ser desfeita.
          </p>
        </div>

        <div className="plano-modal__footer">
          <button
            ref={cancelRef}
            className="plano-btn plano-btn--secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            className="plano-btn plano-btn--danger"
            onClick={() => onConfirm(lista)}
            disabled={loading}
          >
            {loading ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </div>
    </div>
  );
}
