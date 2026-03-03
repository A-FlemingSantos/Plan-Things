import { useState, useRef, useEffect } from "react";
import { Pencil, Trash2, Plus, CheckSquare, Calendar } from "lucide-react";
import { CardItem } from "./CardItem";

export function ListColumn({
  lista,
  cartoes,
  cartoesLoading,
  onEdit,
  onDelete,
  onAddCard,
  onEditCard,
  onDeleteCard,
  dragState,
  dropTarget,
  onDragPointerDown,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(lista.nome);
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const inputRef = useRef(null);
  const menuRef = useRef(null);
  const addMenuRef = useRef(null);

  // Focus input when inline editing starts
  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;

    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  // Close add-card menu on outside click
  useEffect(() => {
    if (!addMenuOpen) return;

    function handleClick(e) {
      if (addMenuRef.current && !addMenuRef.current.contains(e.target)) {
        setAddMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [addMenuOpen]);

  function startEditing() {
    setEditValue(lista.nome);
    setEditing(true);
    setMenuOpen(false);
  }

  function commitEdit() {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== lista.nome && trimmed.length <= 50) {
      onEdit(lista, { nome: trimmed, cor: lista.cor || null });
    }
    setEditing(false);
  }

  function cancelEdit() {
    setEditValue(lista.nome);
    setEditing(false);
  }

  function handleInputKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      commitEdit();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  }

  function handleDelete() {
    setMenuOpen(false);
    onDelete(lista);
  }

  function handleAddCardType(tipo) {
    setAddMenuOpen(false);
    onAddCard(lista, tipo);
  }

  const colorBar = lista.cor
    ? { backgroundColor: lista.cor }
    : { backgroundColor: "transparent" };

  const cards = cartoes || [];
  const hasCards = cards.length > 0;

  // DnD: determine if this list is a drop target
  const isDragOver = dragState?.active && dropTarget?.listaId === lista.id;

  // DnD: filter out the card being dragged and build renderable list with placeholder
  const renderCards = () => {
    if (cartoesLoading) {
      return (
        <div className="list-column__loading">
          <div className="card-skeleton" style={{ animationDelay: "0s" }} />
          <div className="card-skeleton" style={{ animationDelay: "0.1s" }} />
        </div>
      );
    }

    // During drag, filter out the dragged card from this list
    const filteredCards = dragState?.active
      ? cards.filter((c) => c.id !== dragState.cardId)
      : cards;

    // Not dragging and no cards → show empty message
    if (!dragState?.active && filteredCards.length === 0) {
      return (
        <div className="list-column__empty">
          Nenhum cartao nesta lista
        </div>
      );
    }

    const items = [];

    // Only THIS list (the dropTarget list) gets a placeholder — exactly one
    const showPlaceholder = isDragOver;
    const dropIdx = showPlaceholder
      ? Math.min(dropTarget?.index ?? filteredCards.length, filteredCards.length)
      : -1;

    let placeholderInserted = false;

    filteredCards.forEach((cartao, i) => {
      // Insert placeholder before this card
      if (showPlaceholder && !placeholderInserted && dropIdx === i) {
        items.push(
          <div key="drop-placeholder" className="card-drop-placeholder" />
        );
        placeholderInserted = true;
      }

      items.push(
        <CardItem
          key={cartao.id}
          cartao={cartao}
          isDragging={false}
          onEdit={onEditCard}
          onDelete={onDeleteCard}
          onDragPointerDown={onDragPointerDown ? (e, c) => onDragPointerDown(e, c, lista.id) : undefined}
        />
      );
    });

    // Placeholder at end (or in empty list)
    if (showPlaceholder && !placeholderInserted) {
      items.push(
        <div key="drop-placeholder" className="card-drop-placeholder" />
      );
    }

    // During drag, if this list has no cards and isn't the drop target,
    // show a minimum drop zone so it remains a valid target
    if (filteredCards.length === 0 && !showPlaceholder && dragState?.active) {
      items.push(
        <div key="empty-drop-zone" className="list-column__empty-drop-zone" />
      );
    }

    return items;
  };

  const columnClassName = [
    "list-column",
    isDragOver ? "list-column--drag-over" : "",
  ].filter(Boolean).join(" ");

  return (
    <div
      className={columnClassName}
      data-lista-id={lista.id}
      role="region"
      aria-label={`Lista: ${lista.nome}`}
    >      {/* Color accent bar */}
      <div className="list-column__color-bar" style={colorBar} />

      {/* Header */}
      <div className="list-column__header">
        {editing ? (
          <input
            ref={inputRef}
            className="list-column__name-input"
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={handleInputKeyDown}
            maxLength={50}
            autoComplete="off"
            aria-label="Editar nome da lista"
          />
        ) : (
          <div
            className="list-column__name"
            title={lista.nome}
            onClick={startEditing}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                startEditing();
              }
            }}
            aria-label={`Clique para editar: ${lista.nome}`}
          >
            {lista.nome}
          </div>
        )}

        <div className="list-column__actions" ref={menuRef} style={{ position: "relative" }}>
          <button
            className="list-column__action-btn"
            title="Editar lista"
            aria-label={`Editar lista ${lista.nome}`}
            onClick={startEditing}
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            className="list-column__action-btn list-column__action-btn--danger"
            title="Excluir lista"
            aria-label={`Excluir lista ${lista.nome}`}
            onClick={handleDelete}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Cards area */}
      <div className="list-column__cards" data-cards-area>
        {renderCards()}
      </div>

      {/* Footer - Add card button */}
      <div className="list-column__footer">
        <div className="add-card-menu" ref={addMenuRef}>
          {addMenuOpen && (
            <div className="add-card-dropdown">
              <button
                className="add-card-dropdown__item"
                onClick={() => handleAddCardType("TAREFA")}
              >
                <CheckSquare className="w-4 h-4 add-card-dropdown__icon--tarefa" />
                <span>Tarefa</span>
              </button>
              <button
                className="add-card-dropdown__item"
                onClick={() => handleAddCardType("EVENTO")}
              >
                <Calendar className="w-4 h-4 add-card-dropdown__icon--evento" />
                <span>Evento</span>
              </button>
            </div>
          )}
          <button
            className="list-column__add-card"
            onClick={() => setAddMenuOpen(!addMenuOpen)}
            aria-label="Adicionar cartao"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar cartao</span>
          </button>
        </div>
      </div>
    </div>
  );
}
