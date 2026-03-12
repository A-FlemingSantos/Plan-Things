import { Plus, X } from "lucide-react";
import { ListColumn } from "./ListColumn";

export function BoardCanvas({
  boardCanvasRef,
  listas,
  cartoesMap,
  cartoesLoadingMap,
  cartoesErrorMap,
  onEditList,
  onDeleteList,
  onAddCard,
  onEditCard,
  onDeleteCard,
  onRetryCards,
  dragState,
  dropTarget,
  onDragPointerDown,
  addingList,
  addListInputRef,
  newListName,
  onNewListNameChange,
  onInlineKeyDown,
  onInlineCreate,
  addingLoading,
  onStartAddingList,
  onCancelAddingList,
}) {
  const canvasClassName = [
    "board-canvas",
    dragState.active ? "board-canvas--dragging" : "",
  ].filter(Boolean).join(" ");

  return (
    <div className={canvasClassName} ref={boardCanvasRef}>
      {listas.map((lista) => (
        <ListColumn
          key={lista.id}
          lista={lista}
          cartoes={cartoesMap[lista.id]}
          cartoesLoading={cartoesLoadingMap[lista.id]}
          cartoesError={cartoesErrorMap[lista.id]}
          onEdit={onEditList}
          onDelete={onDeleteList}
          onAddCard={onAddCard}
          onEditCard={onEditCard}
          onDeleteCard={onDeleteCard}
          onRetryCards={() => onRetryCards(lista.id)}
          dragState={dragState}
          dropTarget={dropTarget}
          onDragPointerDown={onDragPointerDown}
        />
      ))}

      <div className="board-add-list">
        {addingList ? (
          <div className="board-add-list__form">
            <input
              ref={addListInputRef}
              className="board-add-list__input"
              type="text"
              placeholder="Nome da lista..."
              value={newListName}
              onChange={(e) => onNewListNameChange(e.target.value)}
              onKeyDown={onInlineKeyDown}
              maxLength={50}
              autoComplete="off"
              aria-label="Nome da nova lista"
            />
            <div className="board-add-list__actions">
              <button
                className="board-add-list__submit"
                onClick={onInlineCreate}
                disabled={addingLoading || !newListName.trim()}
              >
                {addingLoading ? "Criando..." : "Criar lista"}
              </button>
              <button
                className="board-add-list__cancel"
                onClick={onCancelAddingList}
                aria-label="Cancelar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <button
            className="board-add-list__trigger"
            onClick={onStartAddingList}
          >
            <Plus className="w-4 h-4" />
            Adicionar outra lista
          </button>
        )}
      </div>
    </div>
  );
}
