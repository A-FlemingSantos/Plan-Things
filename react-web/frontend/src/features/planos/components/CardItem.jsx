import { Pencil, Trash2, CheckSquare, Calendar, Clock } from "lucide-react";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

function formatDateRange(inicio, fim) {
  if (!inicio || !fim) return "";
  const i = new Date(inicio);
  const f = new Date(fim);
  const opts = { day: "2-digit", month: "short" };
  return `${i.toLocaleDateString("pt-BR", opts)} — ${f.toLocaleDateString("pt-BR", opts)}`;
}

export function CardItem({ cartao, onEdit, onDelete, isDragging, onDragPointerDown }) {
  const isTarefa = cartao.tipo === "TAREFA";
  const isEvento = cartao.tipo === "EVENTO";

  const colorBar = cartao.cor
    ? { backgroundColor: cartao.cor }
    : null;

  const className = [
    "card-item",
    isDragging ? "card-item--dragging" : "",
  ].filter(Boolean).join(" ");

  return (
    <div
      className={className}
      data-card-id={cartao.id}
      role="button"
      tabIndex={0}
      aria-label={`Cartao: ${cartao.nome}`}
      onClick={() => onEdit(cartao)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onEdit(cartao);
        }
      }}
      onPointerDown={(e) => {
        if (e.button !== 0) return; // only left click
        if (onDragPointerDown) onDragPointerDown(e, cartao);
      }}
    >
      {/* Color accent */}
      {colorBar && <div className="card-item__color-bar" style={colorBar} />}

      {/* Card body */}
      <div className="card-item__body">
        {/* Type badge */}
        <div className={`card-item__badge card-item__badge--${isTarefa ? "tarefa" : "evento"}`}>
          {isTarefa ? (
            <><CheckSquare className="w-3 h-3" /> Tarefa</>
          ) : (
            <><Calendar className="w-3 h-3" /> Evento</>
          )}
        </div>

        {/* Title */}
        <div className="card-item__title" title={cartao.nome}>
          {cartao.nome}
        </div>

        {/* Date info */}
        {isTarefa && cartao.dataConclusao && (
          <div className="card-item__date">
            <Clock className="w-3 h-3" />
            <span>{formatDate(cartao.dataConclusao)}</span>
          </div>
        )}
        {isEvento && cartao.dataInicio && cartao.dataFim && (
          <div className="card-item__date">
            <Clock className="w-3 h-3" />
            <span>{formatDateRange(cartao.dataInicio, cartao.dataFim)}</span>
          </div>
        )}
      </div>

      {/* Hover actions */}
      <div className="card-item__actions">
        <button
          className="card-item__action-btn"
          title="Editar"
          aria-label={`Editar ${cartao.nome}`}
          onClick={(e) => {
            e.stopPropagation();
            onEdit(cartao);
          }}
        >
          <Pencil className="w-3 h-3" />
        </button>
        <button
          className="card-item__action-btn card-item__action-btn--danger"
          title="Excluir"
          aria-label={`Excluir ${cartao.nome}`}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(cartao);
          }}
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
