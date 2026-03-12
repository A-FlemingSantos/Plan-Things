import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import apiClient, { normalizeError } from "@/lib/apiClient";
import { BoardCanvas } from "./components/BoardCanvas";
import { BoardHeader } from "./components/BoardHeader";
import {
  BoardEmptyState,
  BoardErrorState,
  BoardSkeletons,
  BoardToast,
} from "./components/BoardStateViews";
import { ListFormModal } from "./components/ListFormModal";
import { DeleteListConfirmModal } from "./components/DeleteListConfirmModal";
import { CardFormModal } from "./components/CardFormModal";
import { DeleteCardConfirmModal } from "./components/DeleteCardConfirmModal";
import { useBoardDrag } from "./hooks/useBoardDrag";
import "./styles/board-page.css";

function resolveBoardPageState(listas) {
  return listas.length === 0 ? "empty" : "success";
}

function normalizeCardResponse(tipo, card) {
  return {
    ...card,
    tipo,
  };
}

export function PlanoBoardPage() {
  const { planoId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [plano, setPlano] = useState(null);
  const [listas, setListas] = useState([]);
  const [cartoesMap, setCartoesMap] = useState({});
  const [cartoesLoadingMap, setCartoesLoadingMap] = useState({});
  const [cartoesErrorMap, setCartoesErrorMap] = useState({});

  const [pageState, setPageState] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");

  const [addingList, setAddingList] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [addingLoading, setAddingLoading] = useState(false);
  const addListInputRef = useRef(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editingLista, setEditingLista] = useState(null);
  const [deletingLista, setDeletingLista] = useState(false);
  const [listaToDelete, setListaToDelete] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const [cardFormOpen, setCardFormOpen] = useState(false);
  const [cardFormLista, setCardFormLista] = useState(null);
  const [cardFormTipo, setCardFormTipo] = useState("TAREFA");
  const [editingCartao, setEditingCartao] = useState(null);
  const [deletingCartao, setDeletingCartao] = useState(false);
  const [cartaoToDelete, setCartaoToDelete] = useState(null);
  const [cardModalLoading, setCardModalLoading] = useState(false);

  const [toast, setToast] = useState(null);

  const showToast = useCallback((type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const fetchCartoesForList = useCallback(async (listaId) => {
    if (!user) return;

    setCartoesLoadingMap((prev) => ({ ...prev, [listaId]: true }));
    setCartoesErrorMap((prev) => ({ ...prev, [listaId]: "" }));

    try {
      const res = await apiClient.get(`/cartoes/me/lista/${listaId}`);
      setCartoesMap((prev) => ({ ...prev, [listaId]: res.data }));
    } catch (err) {
      const normalized = normalizeError(err);
      setCartoesErrorMap((prev) => ({ ...prev, [listaId]: normalized.message }));
    } finally {
      setCartoesLoadingMap((prev) => ({ ...prev, [listaId]: false }));
    }
  }, [user]);

  const applyBoardData = useCallback((boardData) => {
    const boardListas = boardData?.listas ?? [];
    const nextListas = boardListas.map((lista) => ({
      id: lista.id,
      nome: lista.nome,
      cor: lista.cor,
      planoId: lista.planoId,
    }));
    const nextCartoesMap = {};
    const nextLoadingMap = {};
    const nextErrorMap = {};

    boardListas.forEach((lista) => {
      nextCartoesMap[lista.id] = lista.cartoes ?? [];
      nextLoadingMap[lista.id] = false;
      nextErrorMap[lista.id] = "";
    });

    setPlano(boardData?.plano ?? null);
    setListas(nextListas);
    setCartoesMap(nextCartoesMap);
    setCartoesLoadingMap(nextLoadingMap);
    setCartoesErrorMap(nextErrorMap);
    setPageState(resolveBoardPageState(nextListas));
  }, []);

  const fetchAll = useCallback(async () => {
    if (!user || !planoId) return;

    setPageState("loading");
    setErrorMessage("");
    try {
      const res = await apiClient.get(`/planos/me/${planoId}/board`);
      applyBoardData(res.data);
    } catch (err) {
      const normalized = normalizeError(err);
      setErrorMessage(normalized.message);
      setPageState("error");
    }
  }, [applyBoardData, user, planoId]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    if (!addingList) {
      return undefined;
    }

    const timer = setTimeout(() => {
      addListInputRef.current?.focus();
    }, 50);

    return () => clearTimeout(timer);
  }, [addingList]);

  const startAddingList = useCallback(() => {
    setAddingList(true);
  }, []);

  const cancelAddingList = useCallback(() => {
    setAddingList(false);
    setNewListName("");
  }, []);

  const closeListForm = useCallback(() => {
    setFormOpen(false);
    setEditingLista(null);
  }, []);

  const closeDeleteListConfirm = useCallback(() => {
    setDeletingLista(false);
    setListaToDelete(null);
  }, []);

  const closeCardForm = useCallback(() => {
    setCardFormOpen(false);
    setEditingCartao(null);
    setCardFormLista(null);
  }, []);

  const closeDeleteCardConfirm = useCallback(() => {
    setDeletingCartao(false);
    setCartaoToDelete(null);
  }, []);

  const syncBoardPageState = useCallback((nextListas) => {
    setPageState(resolveBoardPageState(nextListas));
  }, []);

  const openDeleteList = useCallback((lista) => {
    setListaToDelete(lista);
    setDeletingLista(true);
  }, []);

  const openAddCard = useCallback((lista, tipo) => {
    setCardFormLista(lista);
    setCardFormTipo(tipo);
    setEditingCartao(null);
    setCardFormOpen(true);
  }, []);

  const openEditCard = useCallback((cartao) => {
    setEditingCartao(cartao);
    setCardFormLista(null);
    setCardFormOpen(true);
  }, []);

  const openDeleteCard = useCallback((cartao) => {
    setCartaoToDelete(cartao);
    setDeletingCartao(true);
  }, []);

  async function handleInlineCreate() {
    const trimmed = newListName.trim();
    if (!trimmed || trimmed.length > 50) return;

    setAddingLoading(true);
    try {
      const response = await apiClient.post(`/listas/me/plano/${planoId}`, {
        nome: trimmed,
        cor: null,
      });
      const createdLista = response.data;

      setListas((prev) => {
        const next = [...prev, createdLista];
        syncBoardPageState(next);
        return next;
      });
      setCartoesMap((prev) => ({ ...prev, [createdLista.id]: [] }));
      setCartoesLoadingMap((prev) => ({ ...prev, [createdLista.id]: false }));
      setCartoesErrorMap((prev) => ({ ...prev, [createdLista.id]: "" }));
      setNewListName("");
      showToast("success", "Lista criada com sucesso!");
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
      cancelAddingList();
    }
  }

  async function handleInlineEdit(lista, data) {
    try {
      const response = await apiClient.put(`/listas/me/${lista.id}`, data);
      const updatedLista = response.data;

      setListas((prev) =>
        prev.map((item) => (item.id === updatedLista.id ? updatedLista : item))
      );

      showToast("success", "Lista atualizada com sucesso!");
    } catch (err) {
      const normalized = normalizeError(err);
      showToast("error", normalized.message);
    }
  }

  async function handleModalEdit(data) {
    if (!editingLista) return;

    setModalLoading(true);
    try {
      const response = await apiClient.put(`/listas/me/${editingLista.id}`, data);
      const updatedLista = response.data;

      setListas((prev) =>
        prev.map((item) => (item.id === updatedLista.id ? updatedLista : item))
      );

      closeListForm();
      showToast("success", "Lista atualizada com sucesso!");
    } catch (err) {
      const normalized = normalizeError(err);
      showToast("error", normalized.message);
    } finally {
      setModalLoading(false);
    }
  }

  async function handleDeleteList(lista) {
    setModalLoading(true);
    try {
      await apiClient.delete(`/listas/me/${lista.id}`);

      setListas((prev) => {
        const next = prev.filter((item) => item.id !== lista.id);
        syncBoardPageState(next);
        return next;
      });
      setCartoesMap((prev) => {
        const next = { ...prev };
        delete next[lista.id];
        return next;
      });
      setCartoesLoadingMap((prev) => {
        const next = { ...prev };
        delete next[lista.id];
        return next;
      });
      setCartoesErrorMap((prev) => {
        const next = { ...prev };
        delete next[lista.id];
        return next;
      });

      closeDeleteListConfirm();
      showToast("success", "Lista excluída com sucesso!");
    } catch (err) {
      const normalized = normalizeError(err);
      showToast("error", normalized.message);
    } finally {
      setModalLoading(false);
    }
  }

  async function handleCardFormSubmit(tipo, data) {
    setCardModalLoading(true);

    try {
      const endpoint = tipo === "TAREFA" ? "tarefas" : "eventos";

      if (editingCartao) {
        const response = await apiClient.put(`/${endpoint}/me/${editingCartao.id}`, data);
        const updatedCartao = normalizeCardResponse(tipo, response.data);

        setCartoesMap((prev) => {
          const listaId = updatedCartao.listaId ?? editingCartao.listaId;
          if (!listaId) return prev;

          return {
            ...prev,
            [listaId]: (prev[listaId] || []).map((item) =>
              item.id === updatedCartao.id ? updatedCartao : item
            ),
          };
        });
        setCartoesErrorMap((prev) => ({
          ...prev,
          [updatedCartao.listaId ?? editingCartao.listaId]: "",
        }));
        showToast("success", `${tipo === "TAREFA" ? "Tarefa" : "Evento"} atualizado com sucesso!`);
      } else if (cardFormLista) {
        const response = await apiClient.post(`/${endpoint}/me/lista/${cardFormLista.id}`, data);
        const createdCartao = normalizeCardResponse(tipo, response.data);

        setCartoesMap((prev) => ({
          ...prev,
          [cardFormLista.id]: [...(prev[cardFormLista.id] || []), createdCartao],
        }));
        setCartoesLoadingMap((prev) => ({
          ...prev,
          [cardFormLista.id]: false,
        }));
        setCartoesErrorMap((prev) => ({
          ...prev,
          [cardFormLista.id]: "",
        }));
        showToast("success", `${tipo === "TAREFA" ? "Tarefa" : "Evento"} criado com sucesso!`);
      }

      closeCardForm();
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
      await apiClient.delete(`/cartoes/me/${cartao.id}`);

      if (cartao.listaId) {
        setCartoesMap((prev) => ({
          ...prev,
          [cartao.listaId]: (prev[cartao.listaId] || []).filter((item) => item.id !== cartao.id),
        }));
        setCartoesErrorMap((prev) => ({
          ...prev,
          [cartao.listaId]: "",
        }));
      }

      closeDeleteCardConfirm();
      showToast("success", `${cartao.tipo === "TAREFA" ? "Tarefa" : "Evento"} excluído com sucesso!`);
    } catch (err) {
      const normalized = normalizeError(err);
      showToast("error", normalized.message);
    } finally {
      setCardModalLoading(false);
    }
  }

  const {
    boardCanvasRef,
    dragState,
    dropTarget,
    handleDragPointerDown,
    isCardClickBlocked,
  } = useBoardDrag({
    cartoesMap,
    setCartoesMap,
    fetchCartoesForList,
    showToast,
  });

  const handleEditCardSafe = useCallback((cartao) => {
    if (isCardClickBlocked()) return;
    openEditCard(cartao);
  }, [isCardClickBlocked, openEditCard]);

  const goBack = useCallback(() => {
    navigate("/app/planos");
  }, [navigate]);

  const showBoard = pageState === "success" || (pageState === "empty" && addingList);

  return (
    <div className="board-shell">
      <BoardHeader
        isLoading={pageState === "loading"}
        planoNome={plano?.nome}
        onBack={goBack}
      />

      {pageState === "loading" && <BoardSkeletons />}
      {pageState === "empty" && !addingList && (
        <BoardEmptyState onCreateFirstList={startAddingList} />
      )}
      {pageState === "error" && (
        <BoardErrorState errorMessage={errorMessage} onRetry={fetchAll} />
      )}
      {showBoard && (
        <BoardCanvas
          boardCanvasRef={boardCanvasRef}
          listas={listas}
          cartoesMap={cartoesMap}
          cartoesLoadingMap={cartoesLoadingMap}
          cartoesErrorMap={cartoesErrorMap}
          onEditList={handleInlineEdit}
          onDeleteList={openDeleteList}
          onAddCard={openAddCard}
          onEditCard={handleEditCardSafe}
          onDeleteCard={openDeleteCard}
          onRetryCards={fetchCartoesForList}
          dragState={dragState}
          dropTarget={dropTarget}
          onDragPointerDown={handleDragPointerDown}
          addingList={addingList}
          addListInputRef={addListInputRef}
          newListName={newListName}
          onNewListNameChange={setNewListName}
          onInlineKeyDown={handleInlineKeyDown}
          onInlineCreate={handleInlineCreate}
          addingLoading={addingLoading}
          onStartAddingList={startAddingList}
          onCancelAddingList={cancelAddingList}
        />
      )}

      <ListFormModal
        open={formOpen}
        onClose={closeListForm}
        onSubmit={handleModalEdit}
        lista={editingLista}
        loading={modalLoading}
      />

      <DeleteListConfirmModal
        open={deletingLista}
        onClose={closeDeleteListConfirm}
        onConfirm={handleDeleteList}
        lista={listaToDelete}
        loading={modalLoading}
      />

      <CardFormModal
        open={cardFormOpen}
        onClose={closeCardForm}
        onSubmit={handleCardFormSubmit}
        cartao={editingCartao}
        initialType={cardFormTipo}
        loading={cardModalLoading}
      />

      <DeleteCardConfirmModal
        open={deletingCartao}
        onClose={closeDeleteCardConfirm}
        onConfirm={handleDeleteCard}
        cartao={cartaoToDelete}
        loading={cardModalLoading}
      />

      <BoardToast toast={toast} />
    </div>
  );
}
