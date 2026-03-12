import { ArrowLeft, Filter, MoreHorizontal } from "lucide-react";

export function BoardHeader({ isLoading, planoNome, onBack }) {
  return (
    <div className="board-header">
      <div className="board-header__left">
        <button
          className="board-header__back"
          onClick={onBack}
          aria-label="Voltar para planos"
          title="Voltar para planos"
        >
          <ArrowLeft className="w-4.5 h-4.5" />
        </button>

        <div className="board-header__separator" />

        {isLoading ? (
          <div className="board-header-skeleton__name" />
        ) : (
          <h1 className="board-header__name" title={planoNome}>
            {planoNome || "Quadro"}
          </h1>
        )}
      </div>

      <div className="board-header__right">
        <button
          className="board-header__btn"
          title="Filtros (em breve)"
          disabled
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Filtrar</span>
        </button>
        <button
          className="board-header__btn"
          title="Menu do plano (em breve)"
          disabled
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
