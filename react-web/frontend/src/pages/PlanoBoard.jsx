import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Plus,
  Trash2,
  ArrowLeft,
  Calendar,
  CheckSquare,
  MoreVertical,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import api from "@/lib/api";

export default function PlanoBoard() {
  const { planoId } = useParams();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [plano, setPlano] = useState(null);
  const [listas, setListas] = useState([]);
  const [cartoesPorLista, setCartoesPorLista] = useState({});
  const [loading, setLoading] = useState(true);

  // Create lista state
  const [showCreateLista, setShowCreateLista] = useState(false);
  const [newLista, setNewLista] = useState({ nome: "", cor: "#3B82F6" });

  // Edit lista state
  const [editingLista, setEditingLista] = useState(null);
  const [editListaData, setEditListaData] = useState({ nome: "", cor: "" });

  // Create card state
  const [showCreateCard, setShowCreateCard] = useState(null);
  const [cardType, setCardType] = useState("tarefa");
  const [newCard, setNewCard] = useState({
    nome: "",
    descricao: "",
    cor: "#3B82F6",
    dataConclusao: "",
    dataInicio: "",
    dataFim: "",
  });

  // Edit card state
  const [editingCard, setEditingCard] = useState(null);
  const [editCardData, setEditCardData] = useState({});

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    fetchData();
  }, [planoId, userId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [planoRes, listasRes] = await Promise.all([
        api.get(`/planos/perfil/${userId}/${planoId}`),
        api.get(`/listas/perfil/${userId}/plano/${planoId}`),
      ]);
      setPlano(planoRes.data);
      setListas(listasRes.data);

      const cartoesMap = {};
      await Promise.all(
        listasRes.data.map(async (lista) => {
          try {
            const res = await api.get(
              `/cartoes/perfil/${userId}/lista/${lista.id}`
            );
            cartoesMap[lista.id] = res.data;
          } catch {
            cartoesMap[lista.id] = [];
          }
        })
      );
      setCartoesPorLista(cartoesMap);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLista = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/listas/perfil/${userId}/plano/${planoId}`, newLista);
      setNewLista({ nome: "", cor: "#3B82F6" });
      setShowCreateLista(false);
      fetchData();
    } catch (err) {
      console.error("Erro ao criar lista:", err);
      alert("Erro ao criar lista.");
    }
  };

  const handleEditLista = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/listas/perfil/${userId}/${editingLista.id}`, editListaData);
      setEditingLista(null);
      fetchData();
    } catch (err) {
      console.error("Erro ao atualizar lista:", err);
      alert("Erro ao atualizar lista.");
    }
  };

  const handleDeleteLista = async (listaId) => {
    if (!confirm("Remover esta lista e todos os seus cartões?")) return;
    try {
      await api.delete(`/listas/perfil/${userId}/${listaId}`);
      fetchData();
    } catch (err) {
      console.error("Erro ao remover lista:", err);
      alert("Erro ao remover lista.");
    }
  };

  const handleCreateCard = async (e) => {
    e.preventDefault();
    const listaId = showCreateCard;
    try {
      if (cardType === "tarefa") {
        await api.post(`/tarefas/perfil/${userId}/lista/${listaId}`, {
          nome: newCard.nome,
          descricao: newCard.descricao || null,
          cor: newCard.cor,
          dataConclusao: newCard.dataConclusao
            ? newCard.dataConclusao + "T23:59:59"
            : null,
        });
      } else {
        await api.post(`/eventos/perfil/${userId}/lista/${listaId}`, {
          nome: newCard.nome,
          descricao: newCard.descricao || null,
          cor: newCard.cor,
          dataInicio: newCard.dataInicio
            ? newCard.dataInicio + "T00:00:00"
            : null,
          dataFim: newCard.dataFim ? newCard.dataFim + "T23:59:59" : null,
        });
      }
      setNewCard({
        nome: "",
        descricao: "",
        cor: "#3B82F6",
        dataConclusao: "",
        dataInicio: "",
        dataFim: "",
      });
      setShowCreateCard(null);
      fetchData();
    } catch (err) {
      console.error("Erro ao criar cartão:", err);
      alert("Erro ao criar cartão.");
    }
  };

  const handleDeleteCard = async (cardId, e) => {
    if (e) {
      e.stopPropagation();
    }
    if (!confirm("Remover este cartão?")) return;
    try {
      await api.delete(`/cartoes/perfil/${userId}/${cardId}`);
      fetchData();
    } catch (err) {
      console.error("Erro ao remover cartão:", err);
    }
  };

  const openEditCard = (card) => {
    setEditingCard(card);
    setEditCardData({
      nome: card.nome,
      descricao: card.descricao || "",
      cor: card.cor || "#3B82F6",
      dataConclusao: card.dataConclusao
        ? card.dataConclusao.slice(0, 10)
        : "",
      dataInicio: card.dataInicio ? card.dataInicio.slice(0, 10) : "",
      dataFim: card.dataFim ? card.dataFim.slice(0, 10) : "",
    });
  };

  const handleSaveEditCard = async (e) => {
    e.preventDefault();
    try {
      if (editingCard.tipo === "TAREFA") {
        await api.put(`/tarefas/perfil/${userId}/${editingCard.id}`, {
          nome: editCardData.nome,
          descricao: editCardData.descricao || null,
          cor: editCardData.cor,
          dataConclusao: editCardData.dataConclusao
            ? editCardData.dataConclusao + "T23:59:59"
            : null,
        });
      } else if (editingCard.tipo === "EVENTO") {
        await api.put(`/eventos/perfil/${userId}/${editingCard.id}`, {
          nome: editCardData.nome,
          descricao: editCardData.descricao || null,
          cor: editCardData.cor,
          dataInicio: editCardData.dataInicio
            ? editCardData.dataInicio + "T00:00:00"
            : null,
          dataFim: editCardData.dataFim
            ? editCardData.dataFim + "T23:59:59"
            : null,
        });
      }
      setEditingCard(null);
      fetchData();
    } catch (err) {
      console.error("Erro ao atualizar cartão:", err);
      alert("Erro ao atualizar cartão.");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("pt-BR");
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-muted rounded" />
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-80 h-96 bg-muted rounded-xl flex-shrink-0" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {plano?.nome}
            </h2>
            <p className="text-sm text-muted-foreground">
              {listas.length} lista(s)
            </p>
          </div>
        </div>
        <Button onClick={() => setShowCreateLista(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Lista
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex gap-4 h-full pb-4">
          {listas.map((lista) => (
            <div
              key={lista.id}
              className="w-80 flex-shrink-0 flex flex-col bg-muted/30 rounded-xl border border-border/50 max-h-full"
            >
              {/* Lista Header */}
              <div
                className="p-4 flex items-center justify-between rounded-t-xl"
                style={{
                  borderTop: `3px solid ${lista.cor}`,
                }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: lista.cor }}
                  />
                  <h3 className="font-semibold text-sm">{lista.nome}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {(cartoesPorLista[lista.id] || []).length}
                  </Badge>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => {
                        setEditingLista(lista);
                        setEditListaData({ nome: lista.nome, cor: lista.cor });
                      }}
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      Editar Lista
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteLista(lista.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remover Lista
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Cards */}
              <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                {(cartoesPorLista[lista.id] || []).map((card) => (
                  <Card
                    key={card.id}
                    className="group cursor-pointer hover:shadow-md transition-shadow border-l-4"
                    style={{ borderLeftColor: card.cor }}
                    onClick={() => openEditCard(card)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {card.tipo === "TAREFA" ? (
                              <CheckSquare className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                            ) : (
                              <Calendar className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                            )}
                            <span className="font-medium text-sm truncate">
                              {card.nome}
                            </span>
                          </div>
                          {card.descricao && (
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                              {card.descricao}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <Badge variant="outline" className="text-xs">
                              {card.tipo === "TAREFA" ? "Tarefa" : "Evento"}
                            </Badge>
                            {card.tipo === "TAREFA" && card.dataConclusao && (
                              <span className="text-xs text-muted-foreground">
                                {formatDate(card.dataConclusao)}
                              </span>
                            )}
                            {card.tipo === "EVENTO" && card.dataInicio && (
                              <span className="text-xs text-muted-foreground">
                                {formatDate(card.dataInicio)} -{" "}
                                {formatDate(card.dataFim)}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 flex-shrink-0"
                          onClick={(e) => handleDeleteCard(card.id, e)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button
                  variant="ghost"
                  className="w-full justify-start text-muted-foreground hover:text-foreground text-sm"
                  onClick={() => {
                    setShowCreateCard(lista.id);
                    setCardType("tarefa");
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar cartão
                </Button>
              </div>
            </div>
          ))}

          {/* Add new lista column */}
          <div
            className="w-80 flex-shrink-0 flex items-center justify-center bg-muted/10 rounded-xl border-2 border-dashed border-border/50 hover:border-primary/50 cursor-pointer transition-colors min-h-[200px]"
            onClick={() => setShowCreateLista(true)}
          >
            <div className="text-center space-y-2">
              <Plus className="w-8 h-8 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground font-medium">
                Nova Lista
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Lista Dialog */}
      <Dialog open={showCreateLista} onOpenChange={setShowCreateLista}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Lista</DialogTitle>
            <DialogDescription>
              Crie uma nova lista para organizar seus cartões.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateLista} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="listaNome">Nome</Label>
              <Input
                id="listaNome"
                placeholder="Ex: A Fazer"
                value={newLista.nome}
                onChange={(e) =>
                  setNewLista((p) => ({ ...p, nome: e.target.value }))
                }
                maxLength={50}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="listaCor">Cor</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  id="listaCor"
                  value={newLista.cor}
                  onChange={(e) =>
                    setNewLista((p) => ({ ...p, cor: e.target.value }))
                  }
                  className="w-10 h-10 rounded cursor-pointer border-0"
                />
                <Input
                  value={newLista.cor}
                  onChange={(e) =>
                    setNewLista((p) => ({ ...p, cor: e.target.value }))
                  }
                  className="flex-1"
                  placeholder="#3B82F6"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateLista(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Criar Lista</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Lista Dialog */}
      <Dialog
        open={editingLista !== null}
        onOpenChange={() => setEditingLista(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Lista</DialogTitle>
            <DialogDescription>
              Atualize o nome e a cor da lista.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditLista} className="space-y-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input
                value={editListaData.nome}
                onChange={(e) =>
                  setEditListaData((p) => ({ ...p, nome: e.target.value }))
                }
                maxLength={50}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Cor</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={editListaData.cor}
                  onChange={(e) =>
                    setEditListaData((p) => ({ ...p, cor: e.target.value }))
                  }
                  className="w-10 h-10 rounded cursor-pointer border-0"
                />
                <Input
                  value={editListaData.cor}
                  onChange={(e) =>
                    setEditListaData((p) => ({ ...p, cor: e.target.value }))
                  }
                  className="flex-1"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingLista(null)}
              >
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Create Card Dialog */}
      <Dialog
        open={showCreateCard !== null}
        onOpenChange={() => setShowCreateCard(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Cartão</DialogTitle>
            <DialogDescription>
              Adicione uma tarefa ou evento à lista.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateCard} className="space-y-4">
            <div className="flex gap-2">
              <Button
                type="button"
                variant={cardType === "tarefa" ? "default" : "outline"}
                size="sm"
                onClick={() => setCardType("tarefa")}
              >
                <CheckSquare className="w-4 h-4 mr-1" /> Tarefa
              </Button>
              <Button
                type="button"
                variant={cardType === "evento" ? "default" : "outline"}
                size="sm"
                onClick={() => setCardType("evento")}
              >
                <Calendar className="w-4 h-4 mr-1" /> Evento
              </Button>
            </div>
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input
                placeholder="Nome do cartão"
                value={newCard.nome}
                onChange={(e) =>
                  setNewCard((p) => ({ ...p, nome: e.target.value }))
                }
                maxLength={50}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Descrição (opcional)</Label>
              <Textarea
                placeholder="Descreva o cartão..."
                value={newCard.descricao}
                onChange={(e) =>
                  setNewCard((p) => ({ ...p, descricao: e.target.value }))
                }
                maxLength={500}
              />
            </div>
            <div className="space-y-2">
              <Label>Cor</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={newCard.cor}
                  onChange={(e) =>
                    setNewCard((p) => ({ ...p, cor: e.target.value }))
                  }
                  className="w-10 h-10 rounded cursor-pointer border-0"
                />
                <Input
                  value={newCard.cor}
                  onChange={(e) =>
                    setNewCard((p) => ({ ...p, cor: e.target.value }))
                  }
                  className="flex-1"
                />
              </div>
            </div>
            {cardType === "tarefa" ? (
              <div className="space-y-2">
                <Label>Data de Conclusão</Label>
                <Input
                  type="date"
                  value={newCard.dataConclusao}
                  onChange={(e) =>
                    setNewCard((p) => ({
                      ...p,
                      dataConclusao: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data Início</Label>
                  <Input
                    type="date"
                    value={newCard.dataInicio}
                    onChange={(e) =>
                      setNewCard((p) => ({
                        ...p,
                        dataInicio: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Data Fim</Label>
                  <Input
                    type="date"
                    value={newCard.dataFim}
                    onChange={(e) =>
                      setNewCard((p) => ({
                        ...p,
                        dataFim: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateCard(null)}
              >
                Cancelar
              </Button>
              <Button type="submit">Criar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Card Dialog */}
      <Dialog
        open={editingCard !== null}
        onOpenChange={() => setEditingCard(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Editar {editingCard?.tipo === "TAREFA" ? "Tarefa" : "Evento"}
            </DialogTitle>
            <DialogDescription>
              Atualize as informações do cartão.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveEditCard} className="space-y-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input
                value={editCardData.nome || ""}
                onChange={(e) =>
                  setEditCardData((p) => ({ ...p, nome: e.target.value }))
                }
                maxLength={50}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea
                value={editCardData.descricao || ""}
                onChange={(e) =>
                  setEditCardData((p) => ({
                    ...p,
                    descricao: e.target.value,
                  }))
                }
                maxLength={500}
              />
            </div>
            <div className="space-y-2">
              <Label>Cor</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={editCardData.cor || "#3B82F6"}
                  onChange={(e) =>
                    setEditCardData((p) => ({ ...p, cor: e.target.value }))
                  }
                  className="w-10 h-10 rounded cursor-pointer border-0"
                />
                <Input
                  value={editCardData.cor || ""}
                  onChange={(e) =>
                    setEditCardData((p) => ({ ...p, cor: e.target.value }))
                  }
                  className="flex-1"
                />
              </div>
            </div>
            {editingCard?.tipo === "TAREFA" && (
              <div className="space-y-2">
                <Label>Data de Conclusão</Label>
                <Input
                  type="date"
                  value={editCardData.dataConclusao || ""}
                  onChange={(e) =>
                    setEditCardData((p) => ({
                      ...p,
                      dataConclusao: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            )}
            {editingCard?.tipo === "EVENTO" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data Início</Label>
                  <Input
                    type="date"
                    value={editCardData.dataInicio || ""}
                    onChange={(e) =>
                      setEditCardData((p) => ({
                        ...p,
                        dataInicio: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Data Fim</Label>
                  <Input
                    type="date"
                    value={editCardData.dataFim || ""}
                    onChange={(e) =>
                      setEditCardData((p) => ({
                        ...p,
                        dataFim: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  handleDeleteCard(editingCard.id);
                  setEditingCard(null);
                }}
              >
                Remover
              </Button>
              <div className="flex-1" />
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingCard(null)}
              >
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
