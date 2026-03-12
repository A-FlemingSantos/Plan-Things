import { useCallback, useEffect, useRef, useState } from "react";
import apiClient, { normalizeError } from "@/lib/apiClient";

const DRAG_DELAY_MS = 120;
const DRAG_MOVE_THRESHOLD = 4;
const AUTO_SCROLL_ZONE = 60;
const AUTO_SCROLL_SPEED = 8;

function getAffectedListaIds(sourceListaId, targetListaId) {
  return sourceListaId === targetListaId
    ? [sourceListaId]
    : [sourceListaId, targetListaId];
}

function buildOptimisticCartoesMap(
  currentMap,
  sourceListaId,
  targetListaId,
  cardId,
  dropIndex
) {
  const nextMap = { ...currentMap };
  const sourceCards = [...(nextMap[sourceListaId] || [])];
  const cardIndex = sourceCards.findIndex((c) => c.id === cardId);

  if (cardIndex === -1) {
    return null;
  }

  const [card] = sourceCards.splice(cardIndex, 1);

  if (sourceListaId === targetListaId) {
    const clampedIndex = Math.min(dropIndex, sourceCards.length);
    sourceCards.splice(clampedIndex, 0, card);
    nextMap[sourceListaId] = sourceCards;
    return nextMap;
  }

  nextMap[sourceListaId] = sourceCards;
  const targetCards = [...(nextMap[targetListaId] || [])];
  const clampedIndex = Math.min(dropIndex, targetCards.length);
  targetCards.splice(clampedIndex, 0, { ...card, listaId: targetListaId });
  nextMap[targetListaId] = targetCards;

  return nextMap;
}

function snapshotAffectedLists(currentMap, affectedListaIds) {
  return Object.fromEntries(
    affectedListaIds.map((listaId) => [listaId, [...(currentMap[listaId] || [])]])
  );
}

function restoreAffectedLists(currentMap, previousSnapshot, affectedListaIds) {
  const nextMap = { ...currentMap };

  affectedListaIds.forEach((listaId) => {
    nextMap[listaId] = previousSnapshot[listaId] || [];
  });

  return nextMap;
}

function buildReorderPayload(currentMap, affectedListaIds) {
  const positions = [];

  for (const listaId of affectedListaIds) {
    const cards = currentMap[listaId] || [];
    cards.forEach((card, index) => {
      positions.push({
        cardId: card.id,
        listaId: Number(listaId),
        posicao: index,
      });
    });
  }

  return positions;
}

export function useBoardDrag({
  cartoesMap,
  setCartoesMap,
  fetchCartoesForList,
  showToast,
}) {
  const [dragState, setDragState] = useState({
    active: false,
    cardId: null,
    sourceListaId: null,
  });
  const [dropTarget, setDropTarget] = useState({ listaId: null, index: 0 });

  const dragStartInfo = useRef(null);
  const latestDropTarget = useRef({ listaId: null, index: 0 });
  const autoScrollRef = useRef({ animFrame: null });
  const dragGhostRef = useRef(null);
  const boardCanvasRef = useRef(null);
  const dragClickBlocked = useRef(false);
  const cartoesMapRef = useRef(cartoesMap);
  cartoesMapRef.current = cartoesMap;

  const getTargetListaId = useCallback((clientX) => {
    const canvas = boardCanvasRef.current;
    if (!canvas) return null;

    const columns = canvas.querySelectorAll("[data-lista-id]");
    for (const col of columns) {
      const rect = col.getBoundingClientRect();
      if (clientX >= rect.left && clientX <= rect.right) {
        return Number(col.dataset.listaId);
      }
    }

    let closest = null;
    let minDist = Infinity;
    for (const col of columns) {
      const rect = col.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const dist = Math.abs(clientX - centerX);
      if (dist < minDist) {
        minDist = dist;
        closest = col;
      }
    }

    return closest ? Number(closest.dataset.listaId) : null;
  }, []);

  const getDropIndex = useCallback((listaId, clientY) => {
    const canvas = boardCanvasRef.current;
    if (!canvas) return 0;

    const col = canvas.querySelector(`[data-lista-id="${listaId}"]`);
    if (!col) return 0;

    const cardsArea = col.querySelector("[data-cards-area]");
    if (!cardsArea) return 0;

    const cardEls = cardsArea.querySelectorAll(".card-item:not(.card-item--dragging)");
    if (cardEls.length === 0) return 0;

    for (let i = 0; i < cardEls.length; i++) {
      const rect = cardEls[i].getBoundingClientRect();
      const midY = rect.top + rect.height / 2;
      if (clientY < midY) return i;
    }

    return cardEls.length;
  }, []);

  const doAutoScroll = useCallback((clientX, clientY) => {
    const canvas = boardCanvasRef.current;
    if (!canvas) return;

    const canvasRect = canvas.getBoundingClientRect();
    if (clientX < canvasRect.left + AUTO_SCROLL_ZONE) {
      canvas.scrollLeft -= AUTO_SCROLL_SPEED;
    } else if (clientX > canvasRect.right - AUTO_SCROLL_ZONE) {
      canvas.scrollLeft += AUTO_SCROLL_SPEED;
    }

    const targetListaId = getTargetListaId(clientX);
    if (targetListaId != null) {
      const col = canvas.querySelector(`[data-lista-id="${targetListaId}"]`);
      if (col) {
        const cardsArea = col.querySelector("[data-cards-area]");
        if (cardsArea) {
          const areaRect = cardsArea.getBoundingClientRect();
          if (clientY < areaRect.top + AUTO_SCROLL_ZONE) {
            cardsArea.scrollTop -= AUTO_SCROLL_SPEED;
          } else if (clientY > areaRect.bottom - AUTO_SCROLL_ZONE) {
            cardsArea.scrollTop += AUTO_SCROLL_SPEED;
          }
        }
      }
    }
  }, [getTargetListaId]);

  const startAutoScroll = useCallback(() => {
    function loop() {
      const info = dragStartInfo.current;
      if (!info || !info.active) return;
      doAutoScroll(info.lastClientX, info.lastClientY);
      autoScrollRef.current.animFrame = requestAnimationFrame(loop);
    }

    autoScrollRef.current.animFrame = requestAnimationFrame(loop);
  }, [doAutoScroll]);

  const stopAutoScroll = useCallback(() => {
    if (autoScrollRef.current.animFrame) {
      cancelAnimationFrame(autoScrollRef.current.animFrame);
      autoScrollRef.current.animFrame = null;
    }
  }, []);

  const persistCardPositions = useCallback(async (
    sourceListaId,
    targetListaId,
    optimisticMap,
    previousSnapshot
  ) => {
    const affectedListaIds = getAffectedListaIds(sourceListaId, targetListaId);
    const positions = buildReorderPayload(optimisticMap, affectedListaIds);

    if (positions.length === 0) {
      return;
    }

    try {
      await apiClient.patch("/cartoes/me/reorder", {
        cards: positions,
      });
    } catch (err) {
      setCartoesMap((currentMap) => {
        const rollbackMap = restoreAffectedLists(
          currentMap,
          previousSnapshot,
          affectedListaIds
        );
        cartoesMapRef.current = rollbackMap;
        return rollbackMap;
      });

      const normalized = normalizeError(err);
      showToast("error", normalized.message);

      await Promise.all(
        affectedListaIds.map((listaId) => fetchCartoesForList(listaId))
      );
    }
  }, [fetchCartoesForList, setCartoesMap, showToast]);

  const commitDrop = useCallback((sourceListaId, targetListaId, cardId, dropIndex) => {
    const currentMap = cartoesMapRef.current;
    const affectedListaIds = getAffectedListaIds(sourceListaId, targetListaId);
    const previousSnapshot = snapshotAffectedLists(currentMap, affectedListaIds);
    const optimisticMap = buildOptimisticCartoesMap(
      currentMap,
      sourceListaId,
      targetListaId,
      cardId,
      dropIndex
    );

    if (!optimisticMap) {
      return;
    }

    cartoesMapRef.current = optimisticMap;
    setCartoesMap(optimisticMap);

    void persistCardPositions(
      sourceListaId,
      targetListaId,
      optimisticMap,
      previousSnapshot
    );
  }, [persistCardPositions, setCartoesMap]);

  const activateDrag = useCallback((cartao, listaId, clientX, clientY) => {
    const canvas = boardCanvasRef.current;
    if (!canvas) return;

    const col = canvas.querySelector(`[data-lista-id="${listaId}"]`);
    if (!col) return;

    const cardEl = col.querySelector(`[data-card-id="${cartao.id}"]`);
    if (!cardEl) return;

    const rect = cardEl.getBoundingClientRect();
    const ghost = cardEl.cloneNode(true);
    ghost.className = "card-drag-ghost";
    ghost.style.width = `${rect.width}px`;
    ghost.style.left = `${clientX - (clientX - rect.left)}px`;
    ghost.style.top = `${clientY - (clientY - rect.top)}px`;
    document.body.appendChild(ghost);
    dragGhostRef.current = ghost;

    dragStartInfo.current = {
      ...dragStartInfo.current,
      active: true,
      offsetX: clientX - rect.left,
      offsetY: clientY - rect.top,
      lastClientX: clientX,
      lastClientY: clientY,
    };

    setDragState({ active: true, cardId: cartao.id, sourceListaId: listaId });
    const targetId = getTargetListaId(clientX) ?? listaId;
    const index = getDropIndex(targetId, clientY);
    latestDropTarget.current = { listaId: targetId, index };
    setDropTarget({ listaId: targetId, index });

    dragClickBlocked.current = true;
    startAutoScroll();
  }, [getDropIndex, getTargetListaId, startAutoScroll]);

  const onDragMove = useCallback((e) => {
    const info = dragStartInfo.current;
    if (!info) return;

    const clientX = e.clientX;
    const clientY = e.clientY;

    info.lastClientX = clientX;
    info.lastClientY = clientY;

    if (!info.active) {
      const dx = Math.abs(clientX - info.startX);
      const dy = Math.abs(clientY - info.startY);
      if (dx > DRAG_MOVE_THRESHOLD || dy > DRAG_MOVE_THRESHOLD) {
        clearTimeout(info.timerHandle);
        activateDrag(info.cartao, info.listaId, clientX, clientY);
      }
      return;
    }

    const ghost = dragGhostRef.current;
    if (ghost) {
      ghost.style.left = `${clientX - info.offsetX}px`;
      ghost.style.top = `${clientY - info.offsetY}px`;
    }

    const targetId = getTargetListaId(clientX);
    if (targetId != null) {
      const index = getDropIndex(targetId, clientY);
      if (
        latestDropTarget.current.listaId !== targetId
        || latestDropTarget.current.index !== index
      ) {
        latestDropTarget.current = { listaId: targetId, index };
        setDropTarget({ listaId: targetId, index });
      }
    }
  }, [activateDrag, getDropIndex, getTargetListaId]);

  const cleanupDrag = useCallback(() => {
    const info = dragStartInfo.current;
    if (info?.timerHandle) clearTimeout(info.timerHandle);
    if (info?.removeDragListeners) info.removeDragListeners();
    dragStartInfo.current = null;

    stopAutoScroll();

    if (dragGhostRef.current) {
      dragGhostRef.current.remove();
      dragGhostRef.current = null;
    }

    setDragState({ active: false, cardId: null, sourceListaId: null });
    setDropTarget({ listaId: null, index: 0 });
    latestDropTarget.current = { listaId: null, index: 0 };

    setTimeout(() => {
      dragClickBlocked.current = false;
    }, 50);
  }, [stopAutoScroll]);

  const onDragEnd = useCallback(() => {
    const info = dragStartInfo.current;
    if (!info) return;

    if (!info.active) {
      cleanupDrag();
      return;
    }

    const ghost = dragGhostRef.current;
    const target = latestDropTarget.current;

    if (ghost && target.listaId != null) {
      const canvas = boardCanvasRef.current;
      const col = canvas?.querySelector(`[data-lista-id="${target.listaId}"]`);
      const placeholder = col?.querySelector(".card-drop-placeholder");

      if (placeholder) {
        const rect = placeholder.getBoundingClientRect();
        ghost.style.transition = "left 0.18s cubic-bezier(0.2, 0, 0, 1), top 0.18s cubic-bezier(0.2, 0, 0, 1), transform 0.18s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.18s ease";
        ghost.style.left = `${rect.left}px`;
        ghost.style.top = `${rect.top}px`;
        ghost.classList.add("card-drag-ghost--dropping");

        setTimeout(() => {
          commitDrop(info.listaId, target.listaId, info.cartao.id, target.index);
          cleanupDrag();
        }, 180);
      } else {
        commitDrop(info.listaId, target.listaId, info.cartao.id, target.index);
        cleanupDrag();
      }
    } else {
      cleanupDrag();
    }
  }, [cleanupDrag, commitDrop]);

  const handleDragPointerDown = useCallback((e, cartao, listaId) => {
    if (e.target.closest(".card-item__action-btn")) return;

    e.preventDefault();

    const clientX = e.clientX;
    const clientY = e.clientY;

    dragStartInfo.current = {
      active: false,
      cartao,
      listaId,
      startX: clientX,
      startY: clientY,
      lastClientX: clientX,
      lastClientY: clientY,
      offsetX: 0,
      offsetY: 0,
      timerHandle: setTimeout(() => {
        activateDrag(cartao, listaId, clientX, clientY);
      }, DRAG_DELAY_MS),
    };

    const moveHandler = (moveEvent) => onDragMove(moveEvent);
    const upHandler = () => {
      document.removeEventListener("pointermove", moveHandler);
      document.removeEventListener("pointerup", upHandler);
      document.removeEventListener("pointercancel", upHandler);
      onDragEnd();
    };

    document.addEventListener("pointermove", moveHandler);
    document.addEventListener("pointerup", upHandler);
    document.addEventListener("pointercancel", upHandler);

    dragStartInfo.current.removeDragListeners = () => {
      document.removeEventListener("pointermove", moveHandler);
      document.removeEventListener("pointerup", upHandler);
      document.removeEventListener("pointercancel", upHandler);
    };
  }, [activateDrag, onDragEnd, onDragMove]);

  const isCardClickBlocked = useCallback(() => dragClickBlocked.current, []);

  useEffect(() => () => {
    cleanupDrag();
  }, [cleanupDrag]);

  return {
    boardCanvasRef,
    dragState,
    dropTarget,
    handleDragPointerDown,
    isCardClickBlocked,
  };
}
