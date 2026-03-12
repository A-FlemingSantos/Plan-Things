import { AlertCircle, CheckCircle2, LayoutList, Plus } from "lucide-react";

export function BoardSkeletons() {
  return (
    <div className="board-canvas">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="board-skeleton"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          <div className="board-skeleton__header">
            <div className="board-skeleton__title" />
          </div>
          <div className="board-skeleton__cards">
            {Array.from({ length: 2 + (i % 2) }).map((_, j) => (
              <div
                key={j}
                className="board-skeleton__card"
                style={{ animationDelay: `${(i * 3 + j) * 0.08}s` }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function BoardEmptyState({ onCreateFirstList }) {
  return (
    <div className="board-empty">
      <div className="board-empty__icon">
        <LayoutList className="w-7 h-7 text-blue-500" />
      </div>
      <h2 className="board-empty__title">Nenhuma lista criada</h2>
      <p className="board-empty__text">
        Crie sua primeira lista para começar a organizar as tarefas deste
        plano.
      </p>
      <button
        className="board-empty__cta"
        onClick={onCreateFirstList}
      >
        <Plus className="w-4 h-4" />
        Criar primeira lista
      </button>
    </div>
  );
}

export function BoardErrorState({ errorMessage, onRetry }) {
  return (
    <div className="board-error">
      <div className="board-error__icon">
        <AlertCircle className="w-7 h-7 text-red-500" />
      </div>
      <h2 className="board-error__title">Erro ao carregar o quadro</h2>
      <p className="board-error__text">{errorMessage}</p>
      <button className="board-error__retry" onClick={onRetry}>
        Tentar novamente
      </button>
    </div>
  );
}

export function BoardToast({ toast }) {
  if (!toast) {
    return null;
  }

  return (
    <div className={`board-toast board-toast--${toast.type}`}>
      {toast.type === "success" ? (
        <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
      ) : (
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
      )}
      <span>{toast.message}</span>
    </div>
  );
}
