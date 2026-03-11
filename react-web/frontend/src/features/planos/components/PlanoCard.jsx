import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, LayoutList } from "lucide-react";

/**
 * Default gradient backgrounds for cards without a wallpaper.
 * Cycles through based on plano id.
 */
const CARD_GRADIENTS = [
  "linear-gradient(135deg, #3b82f6, #6366f1)",
  "linear-gradient(135deg, #06b6d4, #3b82f6)",
  "linear-gradient(135deg, #8b5cf6, #ec4899)",
  "linear-gradient(135deg, #f59e0b, #ef4444)",
  "linear-gradient(135deg, #10b981, #06b6d4)",
  "linear-gradient(135deg, #6366f1, #a855f7)",
  "linear-gradient(135deg, #ef4444, #f97316)",
  "linear-gradient(135deg, #14b8a6, #22d3ee)",
];

function getCoverStyle(plano) {
  if (plano.wallpaperUrl) {
    // Base64 data URL → use as image
    if (plano.wallpaperUrl.startsWith("data:")) {
      return { backgroundImage: `url(${plano.wallpaperUrl})` };
    }
    // Gradient string → apply directly as background
    return { background: plano.wallpaperUrl };
  }
  const idx = (plano.id ?? 0) % CARD_GRADIENTS.length;
  return { background: CARD_GRADIENTS[idx] };
}

export function PlanoCard({ plano, onEdit, onDelete }) {
  const navigate = useNavigate();

  function handleNavigate() {
    navigate(`/app/planos/${plano.id}`);
  }

  function handleEdit(e) {
    e.stopPropagation();
    onEdit(plano);
  }

  function handleDelete(e) {
    e.stopPropagation();
    onDelete(plano);
  }

  return (
    <div
      className="plano-card"
      role="button"
      tabIndex={0}
      onClick={handleNavigate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleNavigate();
        }
      }}
      aria-label={`Abrir plano ${plano.nome}`}
    >
      {/* Hover actions */}
      <div className="plano-card__actions">
        <button
          className="plano-card__action-btn"
          title="Editar plano"
          aria-label={`Editar plano ${plano.nome}`}
          onClick={handleEdit}
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          className="plano-card__action-btn plano-card__action-btn--danger"
          title="Excluir plano"
          aria-label={`Excluir plano ${plano.nome}`}
          onClick={handleDelete}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Cover */}
      <div className="plano-card__cover">
        <div className="plano-card__cover-bg" style={getCoverStyle(plano)} />
      </div>

      {/* Body */}
      <div className="plano-card__body">
        <div className="plano-card__name" title={plano.nome}>
          {plano.nome}
        </div>

        <div className="plano-card__meta">
          <div className="plano-card__indicators">
            <span className="plano-card__indicator">
              <LayoutList className="w-3.5 h-3.5" />
              Plano
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
