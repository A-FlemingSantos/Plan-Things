import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  LayoutList,
  LayoutDashboard,
  ListTodo,
  Calendar,
  AlertCircle,
  CheckCircle2,
  X,
  Filter,
  MoreHorizontal,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import apiClient, { normalizeError } from "@/lib/apiClient";
import { ListColumn } from "./components/ListColumn";
import { ListFormModal } from "./components/ListFormModal";
import { DeleteListConfirmModal } from "./components/DeleteListConfirmModal";
import { CardFormModal } from "./components/CardFormModal";
import { DeleteCardConfirmModal } from "./components/DeleteCardConfirmModal";
import "./styles/board-page.css";

export function PlanoBoardPage() {
  const { planoId } = useParams();
  const navigate = useNavigate();
  const { perfilId } = useAuth();

  // Plano data
  const [plano, setPlano] = useState(null);

  // Listas data
  const [listas, setListas] = useState([]);

  // Cartoes data — map { [listaId]: cartao[] }
  const [cartoesMap, setCartoesMap] = useState({});
  const [cartoesLoadingMap, setCartoesLoadingMap] = useState({});

  // Page state
  const [pageState, setPageState] = useState("loading"); // loading | success | error | empty
  const [errorMessage, setErrorMessage] = useState("");

  // Add list inline form
  const [addingList, setAddingList] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [addingLoading, setAddingLoading] = useState(false);
  const addListInputRef = useRef(null);

  // List modal state
  const [formOpen, setFormOpen] = useState(false);
  const [editingLista, setEditingLista] = useState(null);
  const [deletingLista, setDeletingLista] = useState(false);
  const [listaToDelete, setListaToDelete] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Card modal state
  const [cardFormOpen, setCardFormOpen] = useState(false);
  const [cardFormLista, setCardFormLista] = useState(null);
  const [cardFormTipo, setCardFormTipo] = useState("TAREFA");
  const [editingCartao, setEditingCartao] = useState(null);
  const [deletingCartao, setDeletingCartao] = useState(false);
  const [cartaoToDelete, setCartaoToDelete] = useState(null);
  const [cardModalLoading, setCardModalLoading] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);

  // ─── Drag & Drop state ────────────────────────────────────────────────
  const DRAG_DELAY_MS = 120;
  const DRAG_MOVE_THRESHOLD = 4;
  const AUTO_SCROLL_ZONE = 60;
  const AUTO_SCROLL_SPEED = 8;

  const [dragState, setDragState] = useState({ active: false, cardId: null, sourceListaId: null });
  const [dropTarget, setDropTarget] = useState({ listaId: null, index: 0 });

  const dragStartInfo = useRef(null);
  const latestDropTarget = useRef({ listaId: null, index: 0 });
  const autoScrollRef = useRef({ animFrame: null });
  const dragGhostRef = useRef(null);
  const boardCanvasRef = useRef(null);
  const dragClickBlocked = useRef(false);

  // ─── Show toast ────────────────────────────────────────────────────────
  const showToast = useCallback((type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // ─── Fetch plano details ──────────────────────────────────────────────
  const fetchPlano = useCallback(async () => {
    if (!perfilId || !planoId) return null;

    try {
      const res = await apiClient.get(`/planos/perfil/${perfilId}/${planoId}`);
      setPlano(res.data);
      return res.data;
    } catch (err) {
      const normalized = normalizeError(err);
      setErrorMessage(normalized.message);
      setPageState("error");
      return null;
    }
  }, [perfilId, planoId]);

  // ─── Fetch listas ─────────────────────────────────────────────────────
  const fetchListas = useCallback(async () => {
    if (!perfilId || !planoId) return;

    try {
      const res = await apiClient.get(
        `/listas/perfil/${perfilId}/plano/${planoId}`
      );
      const data = res.data;
      setListas(data);
      setPageState(data.length === 0 ? "empty" : "success");
      return data;
    } catch (err) {
      const normalized = normalizeError(err);
      setErrorMessage(normalized.message);
      setPageState("error");
      return null;
    }
  }, [perfilId, planoId]);

  // ─── Fetch cartoes for a single list ──────────────────────────────────
  const fetchCartoesForList = useCallback(
    async (listaId) => {
      if (!perfilId) return;

      setCartoesLoadingMap((prev) => ({ ...prev, [listaId]: true }));
      try {
        const res = await apiClient.get(
          `/cartoes/perfil/${perfilId}/lista/${listaId}`
        );
        setCartoesMap((prev) => ({ ...prev, [listaId]: res.data }));
      } catch {
        setCartoesMap((prev) => ({ ...prev, [listaId]: [] }));
      } finally {
        setCartoesLoadingMap((prev) => ({ ...prev, [listaId]: false }));
      }
    },
    [perfilId]
  );

  // ─── Fetch cartoes for all lists ──────────────────────────────────────
  const fetchAllCartoes = useCallback(
    async (listasData) => {
      if (!perfilId || !listasData || listasData.length === 0) return;

      const loadingState = {};
      listasData.forEach((l) => {
        loadingState[l.id] = true;
      });
      setCartoesLoadingMap(loadingState);

      const results = await Promise.allSettled(
        listasData.map((l) =>
          apiClient.get(`/cartoes/perfil/${perfilId}/lista/${l.id}`)
        )
      );

      const newMap = {};
      const newLoadingMap = {};
      listasData.forEach((l, i) => {
        newMap[l.id] =
          results[i].status === "fulfilled" ? results[i].value.data : [];
        newLoadingMap[l.id] = false;
      });

      setCartoesMap(newMap);
      setCartoesLoadingMap(newLoadingMap);
    },
    [perfilId]
  );

  // ─── Initial load ─────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setPageState("loading");
    setErrorMessage("");

    const planoData = await fetchPlano();
    if (planoData) {
      const listasData = await fetchListas();
      if (listasData) {
        await fetchAllCartoes(listasData);
      }
    }
  }, [fetchPlano, fetchListas, fetchAllCartoes]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ─── Auto-focus add list input ────────────────────────────────────────
  useEffect(() => {
    if (addingList) {
      setTimeout(() => addListInputRef.current?.focus(), 50);
    }
  }, [addingList]);

  // ─── Create lista (inline) ───────────────────────────────────────────
  async function handleInlineCreate() {
    const trimmed = newListName.trim();
    if (!trimmed || trimmed.length > 50) return;

    setAddingLoading(true);
    try {
      await apiClient.post(`/listas/perfil/${perfilId}/plano/${planoId}`, {
        nome: trimmed,
        cor: null,
      });
      setNewListName("");
      showToast("success", "Lista criada com sucesso!");
      const listasData = await fetchListas();
      if (listasData) await fetchAllCartoes(listasData);
      setTimeout(() => addListInputRef.current?.focus(), 50);
    } catch (err) {
      const normalized = normalizeError(err);
      showToast("error", normalized.message);
    } finally {
      setAddingLoading(false);
    }
  }

  function handleInlineKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleInlineCreate();
    } else if (e.key === "Escape") {
      setAddingList(false);
      setNewListName("");
    }
  }

  // ─── Edit lista (inline name or modal) ────────────────────────────────
  async function handleInlineEdit(lista, data) {
    try {
      await apiClient.put(`/listas/perfil/${perfilId}/${lista.id}`, data);
      showToast("success", "Lista atualizada com sucesso!");
      await fetchListas();
    } catch (err) {
      const normalized = normalizeError(err);
      showToast("error", normalized.message);
    }
  }

  async function handleModalEdit(data) {
    if (!editingLista) return;

    setModalLoading(true);
    try {
      await apiClient.put(
        `/listas/perfil/${perfilId}/${editingLista.id}`,
        data
      );
      setFormOpen(false);
      setEditingLista(null);
      showToast("success", "Lista atualizada com sucesso!");
      await fetchListas();
    } catch (err) {
      const normalized = normalizeError(err);
      showToast("error", normalized.message);
    } finally {
      setModalLoading(false);
    }
  }

  // ─── Delete lista ─────────────────────────────────────────────────────
  async function handleDeleteList(lista) {
    setModalLoading(true);
    try {
      await apiClient.delete(`/listas/perfil/${perfilId}/${lista.id}`);
      setDeletingLista(false);
      setListaToDelete(null);
      showToast("success", "Lista excluida com sucesso!");
      const listasData = await fetchListas();
      if (listasData) await fetchAllCartoes(listasData);
    } catch (err) {
      const normalized = normalizeError(err);
      showToast("error", normalized.message);
    } finally {
      setModalLoading(false);
    }
  }

  // ─── Open list modals ────────────────────────────────────────────────
  function openEditModal(lista) {
    setEditingLista(lista);
    setFormOpen(true);
  }

  function openDeleteList(lista) {
    setListaToDelete(lista);
    setDeletingLista(true);
  }

  // ─── Card CRUD ────────────────────────────────────────────────────────
  function openAddCard(lista, tipo) {
    setCardFormLista(lista);
    setCardFormTipo(tipo);
    setEditingCartao(null);
    setCardFormOpen(true);
  }

  function openEditCard(cartao) {
    setEditingCartao(cartao);
    setCardFormTipo(cartao.tipo || "TAREFA");
    setCardFormLista(null);
    setCardFormOpen(true);
  }

  function openDeleteCard(cartao) {
    setCartaoToDelete(cartao);
    setDeletingCartao(true);
  }

  async function handleCardFormSubmit(tipo, data) {
    setCardModalLoading(true);

    try {
      const endpoint = tipo === "TAREFA" ? "tarefas" : "eventos";

      if (editingCartao) {
        // Update
        await apiClient.put(
          `/${endpoint}/perfil/${perfilId}/${editingCartao.id}`,
          data
        );
        showToast("success", `${tipo === "TAREFA" ? "Tarefa" : "Evento"} atualizado com sucesso!`);
        // Refresh cards for the list this card belongs to
        const listaId = editingCartao.listaId;
        if (listaId) {
          await fetchCartoesForList(listaId);
        }
      } else if (cardFormLista) {
        // Create
        await apiClient.post(
          `/${endpoint}/perfil/${perfilId}/lista/${cardFormLista.id}`,
          data
        );
        showToast("success", `${tipo === "TAREFA" ? "Tarefa" : "Evento"} criado com sucesso!`);
        await fetchCartoesForList(cardFormLista.id);
      }

      setCardFormOpen(false);
      setEditingCartao(null);
      setCardFormLista(null);
    } catch (err) {
      const normalized = normalizeError(err);
      showToast("error", normalized.message);
    } finally {
      setCardModalLoading(false);
    }
  }

  async function handleDeleteCard(cartao) {
    setCardModalLoading(true);
    try {
      await apiClient.delete(`/cartoes/perfil/${perfilId}/${cartao.id}`);
      setDeletingCartao(false);
      setCartaoToDelete(null);
      showToast("success", `${cartao.tipo === "TAREFA" ? "Tarefa" : "Evento"} excluido com sucesso!`);
      if (cartao.listaId) {
        await fetchCartoesForList(cartao.listaId);
      }
    } catch (err) {
      const normalized = normalizeError(err);
      showToast("error", normalized.message);
    } finally {
      setCardModalLoading(false);
    }
  }

  // ─── Drag & Drop — helpers ─────────────────────────────────────────────
  function getTargetListaId(clientX) {
    const canvas = boardCanvasRef.current;
    if (!canvas) return null;
    const columns = canvas.querySelectorAll("[data-lista-id]");
    for (const col of columns) {
      const rect = col.getBoundingClientRect();
      if (clientX >= rect.left && clientX <= rect.right) {
        return Number(col.dataset.listaId);
      }
    }
    // Find the closest column
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
  }

  function getDropIndex(listaId, clientY) {
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
  }

  function doAutoScroll(clientX, clientY) {
    const canvas = boardCanvasRef.current;
    if (!canvas) return;

    // Horizontal scroll on canvas
    const canvasRect = canvas.getBoundingClientRect();
    if (clientX < canvasRect.left + AUTO_SCROLL_ZONE) {
      canvas.scrollLeft -= AUTO_SCROLL_SPEED;
    } else if (clientX > canvasRect.right - AUTO_SCROLL_ZONE) {
      canvas.scrollLeft += AUTO_SCROLL_SPEED;
    }

    // Vertical scroll on cards area
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
  }

  function startAutoScroll() {
    function loop() {
      const info = dragStartInfo.current;
      if (!info || !info.active) return;
      doAutoScroll(info.lastClientX, info.lastClientY);
      autoScrollRef.current.animFrame = requestAnimationFrame(loop);
    }
    autoScrollRef.current.animFrame = requestAnimationFrame(loop);
  }

  function stopAutoScroll() {
    if (autoScrollRef.current.animFrame) {
      cancelAnimationFrame(autoScrollRef.current.animFrame);
      autoScrollRef.current.animFrame = null;
    }
  }

  function activateDrag(cartao, listaId, clientX, clientY) {
    // Create ghost clone
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

    // Store offset from cursor to card top-left
    dragStartInfo.current = {
      ...dragStartInfo.current,
      active: true,
      offsetX: clientX - rect.left,
      offsetY: clientY - rect.top,
      lastClientX: clientX,
      lastClientY: clientY,
    };

    // Set drag state
    setDragState({ active: true, cardId: cartao.id, sourceListaId: listaId });
    const targetId = getTargetListaId(clientX) ?? listaId;
    const idx = getDropIndex(targetId, clientY);
    latestDropTarget.current = { listaId: targetId, index: idx };
    setDropTarget({ listaId: targetId, index: idx });

    // Block next click from opening the card modal
    dragClickBlocked.current = true;

    startAutoScroll();
  }

  function onDragMove(e) {
    const info = dragStartInfo.current;
    if (!info) return;

    const clientX = e.clientX;
    const clientY = e.clientY;

    info.lastClientX = clientX;
    info.lastClientY = clientY;

    if (!info.active) {
      // Check if moved enough to start drag early (before timer)
      const dx = Math.abs(clientX - info.startX);
      const dy = Math.abs(clientY - info.startY);
      if (dx > DRAG_MOVE_THRESHOLD || dy > DRAG_MOVE_THRESHOLD) {
        clearTimeout(info.timerHandle);
        activateDrag(info.cartao, info.listaId, clientX, clientY);
      }
      return;
    }

    // Move ghost
    const ghost = dragGhostRef.current;
    if (ghost) {
      ghost.style.left = `${clientX - info.offsetX}px`;
      ghost.style.top = `${clientY - info.offsetY}px`;
    }

    // Update drop target
    const targetId = getTargetListaId(clientX);
    if (targetId != null) {
      const idx = getDropIndex(targetId, clientY);
      if (latestDropTarget.current.listaId !== targetId || latestDropTarget.current.index !== idx) {
        latestDropTarget.current = { listaId: targetId, index: idx };
        setDropTarget({ listaId: targetId, index: idx });
      }
    }
  }

  function commitDrop(sourceListaId, targetListaId, cardId, dropIndex) {
    setCartoesMap((prev) => {
      const newMap = { ...prev };
      const sourceCards = [...(newMap[sourceListaId] || [])];
      const cardIndex = sourceCards.findIndex((c) => c.id === cardId);
      if (cardIndex === -1) return prev;

      const [card] = sourceCards.splice(cardIndex, 1);

      if (sourceListaId === targetListaId) {
        // Same list reorder — dropIndex is already relative to the
        // filtered list (without the dragged card), which matches
        // sourceCards after the splice above. Use directly.
        const clampedIndex = Math.min(dropIndex, sourceCards.length);
        sourceCards.splice(clampedIndex, 0, card);
        newMap[sourceListaId] = sourceCards;
      } else {
        // Move between lists
        newMap[sourceListaId] = sourceCards;
        const targetCards = [...(newMap[targetListaId] || [])];
        const clampedIndex = Math.min(dropIndex, targetCards.length);
        targetCards.splice(clampedIndex, 0, { ...card, listaId: targetListaId });
        newMap[targetListaId] = targetCards;
      }
      return newMap;
    });

    // Persist new positions to the backend
    persistCardPositions(sourceListaId, targetListaId);
  }

  // Persist card ordering to the backend after a drop
  async function persistCardPositions(sourceListaId, targetListaId) {
    // Wait a tick for state to settle
    await new Promise((r) => setTimeout(r, 0));

    // Read latest cartoesMap via functional ref pattern
    setCartoesMap((currentMap) => {
      const affectedListaIds = sourceListaId === targetListaId
        ? [sourceListaId]
        : [sourceListaId, targetListaId];

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

      if (positions.length > 0) {
        apiClient
          .patch(`/cartoes/perfil/${perfilId}/reorder`, { cards: positions })
          .catch((err) => {
            const normalized = normalizeError(err);
            showToast("error", normalized.message);
          });
      }

      // Return map unchanged — this is read-only
      return currentMap;
    });
  }

  function cleanupDrag() {
    const info = dragStartInfo.current;
    if (info?.timerHandle) clearTimeout(info.timerHandle);
    if (info?.removeDragListeners) info.removeDragListeners();
    dragStartInfo.current = null;

    stopAutoScroll();

    // Remove ghost
    if (dragGhostRef.current) {
      dragGhostRef.current.remove();
      dragGhostRef.current = null;
    }

    setDragState({ active: false, cardId: null, sourceListaId: null });
    setDropTarget({ listaId: null, index: 0 });
    latestDropTarget.current = { listaId: null, index: 0 };

    // Unblock clicks after a tick
    setTimeout(() => {
      dragClickBlocked.current = false;
    }, 50);
  }

  function onDragEnd() {
    const info = dragStartInfo.current;
    if (!info) return;

    if (!info.active) {
      // Never activated — just cleanup timer
      cleanupDrag();
      return;
    }

    const ghost = dragGhostRef.current;
    const target = latestDropTarget.current;

    if (ghost && target.listaId != null) {
      // Animate ghost to placeholder position
      const canvas = boardCanvasRef.current;
      const col = canvas?.querySelector(`[data-lista-id="${target.listaId}"]`);
      const placeholder = col?.querySelector(".card-drop-placeholder");

      if (placeholder) {
        const pRect = placeholder.getBoundingClientRect();
        ghost.style.transition = "left 0.18s cubic-bezier(0.2, 0, 0, 1), top 0.18s cubic-bezier(0.2, 0, 0, 1), transform 0.18s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.18s ease";
        ghost.style.left = `${pRect.left}px`;
        ghost.style.top = `${pRect.top}px`;
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
  }

  function handleDragPointerDown(e, cartao, listaId) {
    // Don't start drag from action buttons
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

    // Use document-level listeners so they survive the card element
    // being unmounted from the DOM when dragState triggers a re-render
    const moveHandler = (me) => onDragMove(me);
    const upHandler = () => {
      document.removeEventListener("pointermove", moveHandler);
      document.removeEventListener("pointerup", upHandler);
      document.removeEventListener("pointercancel", upHandler);
      onDragEnd();
    };

    document.addEventListener("pointermove", moveHandler);
    document.addEventListener("pointerup", upHandler);
    document.addEventListener("pointercancel", upHandler);

    // Store cleanup ref so cleanupDrag can also remove them
    dragStartInfo.current.removeDragListeners = () => {
      document.removeEventListener("pointermove", moveHandler);
      document.removeEventListener("pointerup", upHandler);
      document.removeEventListener("pointercancel", upHandler);
    };
  }

  // Intercept card edit click when drag just finished
  function handleEditCardSafe(cartao) {
    if (dragClickBlocked.current) return;
    openEditCard(cartao);
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupDrag();
    };
  }, []);

  // ─── Navigate back ────────────────────────────────────────────────────
  function goBack() {
    navigate("/app/planos");
  }

  // ─── Render: Header ───────────────────────────────────────────────────
  function renderHeader() {
    return (
      <div className="board-header">
        <div className="board-header__left">
          <button
            className="board-header__back"
            onClick={goBack}
            aria-label="Voltar para planos"
            title="Voltar para planos"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
          </button>

          <div className="board-header__separator" />

          {pageState === "loading" ? (
            <div className="board-header-skeleton__name" />
          ) : (
            <h1 className="board-header__name" title={plano?.nome}>
              {plano?.nome || "Board"}
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

  // ─── Render: Skeleton loading ─────────────────────────────────────────
  function renderSkeletons() {
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

  // ─── Render: Empty state ──────────────────────────────────────────────
  function renderEmpty() {
    return (
      <div className="board-empty">
        <div className="board-empty__icon">
          <LayoutList className="w-7 h-7 text-blue-500" />
        </div>
        <h2 className="board-empty__title">Nenhuma lista criada</h2>
        <p className="board-empty__text">
          Crie sua primeira lista para comecar a organizar as tarefas deste
          plano.
        </p>
        <button
          className="board-empty__cta"
          onClick={() => setAddingList(true)}
        >
          <Plus className="w-4 h-4" />
          Criar primeira lista
        </button>
      </div>
    );
  }

  // ─── Render: Error state ──────────────────────────────────────────────
  function renderError() {
    return (
      <div className="board-error">
        <div className="board-error__icon">
          <AlertCircle className="w-7 h-7 text-red-500" />
        </div>
        <h2 className="board-error__title">Erro ao carregar o board</h2>
        <p className="board-error__text">{errorMessage}</p>
        <button className="board-error__retry" onClick={fetchAll}>
          Tentar novamente
        </button>
      </div>
    );
  }

  // ─── Render: Board canvas with lists ──────────────────────────────────
  function renderBoard() {
    const canvasClassName = [
      "board-canvas",
      dragState.active ? "board-canvas--dragging" : "",
    ].filter(Boolean).join(" ");

    return (
      <div className="board-workspace">
        <aside className="board-sidebar" aria-label="Visualizacoes do plano">
          <div className="board-sidebar__item board-sidebar__item--active">
            <LayoutDashboard className="w-4 h-4" />
            <span>Board</span>
          </div>
          <div className="board-sidebar__item">
            <ListTodo className="w-4 h-4" />
            <span>Lista</span>
          </div>
          <div className="board-sidebar__item">
            <Calendar className="w-4 h-4" />
            <span>Timeline</span>
          </div>

          <div className="board-sidebar__footer">
            <div className="board-sidebar__team-dot" />
            <span>Team Space</span>
          </div>
        </aside>

        <div className={canvasClassName} ref={boardCanvasRef}>
          {listas.map((lista) => (
            <ListColumn
              key={lista.id}
              lista={lista}
              cartoes={cartoesMap[lista.id]}
              cartoesLoading={cartoesLoadingMap[lista.id]}
              onEdit={handleInlineEdit}
              onDelete={openDeleteList}
              onAddCard={openAddCard}
              onEditCard={handleEditCardSafe}
              onDeleteCard={openDeleteCard}
              dragState={dragState}
              dropTarget={dropTarget}
              onDragPointerDown={handleDragPointerDown}
            />
          ))}

          {/* Add list slot */}
          <div className="board-add-list">
            {addingList ? (
              <div className="board-add-list__form">
                <input
                  ref={addListInputRef}
                  className="board-add-list__input"
                  type="text"
                  placeholder="Nome da lista..."
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  onKeyDown={handleInlineKeyDown}
                  maxLength={50}
                  autoComplete="off"
                  aria-label="Nome da nova lista"
                />
                <div className="board-add-list__actions">
                  <button
                    className="board-add-list__submit"
                    onClick={handleInlineCreate}
                    disabled={
                      addingLoading || !newListName.trim()
                    }
                  >
                    {addingLoading ? "Criando..." : "Criar lista"}
                  </button>
                  <button
                    className="board-add-list__cancel"
                    onClick={() => {
                      setAddingList(false);
                      setNewListName("");
                    }}
                    aria-label="Cancelar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="board-add-list__trigger"
                onClick={() => setAddingList(true)}
              >
                <Plus className="w-4 h-4" />
                Adicionar outra lista
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── Main render ──────────────────────────────────────────────────────
  return (
    <div className="board-shell">
      {renderHeader()}

      {pageState === "loading" && renderSkeletons()}
      {pageState === "empty" && !addingList && renderEmpty()}
      {pageState === "empty" && addingList && renderBoard()}
      {pageState === "error" && renderError()}
      {pageState === "success" && renderBoard()}

      {/* Edit list modal */}
      <ListFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingLista(null);
        }}
        onSubmit={handleModalEdit}
        lista={editingLista}
        loading={modalLoading}
      />

      {/* Delete list confirmation */}
      <DeleteListConfirmModal
        open={deletingLista}
        onClose={() => {
          setDeletingLista(false);
          setListaToDelete(null);
        }}
        onConfirm={handleDeleteList}
        lista={listaToDelete}
        loading={modalLoading}
      />

      {/* Card form modal (create/edit) */}
      <CardFormModal
        open={cardFormOpen}
        onClose={() => {
          setCardFormOpen(false);
          setEditingCartao(null);
          setCardFormLista(null);
        }}
        onSubmit={handleCardFormSubmit}
        cartao={editingCartao}
        loading={cardModalLoading}
      />

      {/* Delete card confirmation */}
      <DeleteCardConfirmModal
        open={deletingCartao}
        onClose={() => {
          setDeletingCartao(false);
          setCartaoToDelete(null);
        }}
        onConfirm={handleDeleteCard}
        cartao={cartaoToDelete}
        loading={cardModalLoading}
      />

      {/* Toast */}
      {toast && (
        <div className={`board-toast board-toast--${toast.type}`}>
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
