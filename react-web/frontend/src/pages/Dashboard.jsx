import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FolderOpen,
  Plus,
  Search,
  Trash2,
  Image,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import api from "@/lib/api";

export default function Dashboard() {
  const [planos, setPlanos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newPlano, setNewPlano] = useState({ nome: "", wallpaperUrl: "" });
  const [creating, setCreating] = useState(false);
  const [editingPlano, setEditingPlano] = useState(null);
  const [editData, setEditData] = useState({ nome: "", wallpaperUrl: "" });
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    fetchPlanos();
  }, [userId]);

  const fetchPlanos = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/planos/perfil/${userId}`);
      setPlanos(response.data);
    } catch (err) {
      console.error("Erro ao buscar planos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlano = async (e) => {
    e.preventDefault();
    if (!newPlano.nome.trim()) return;
    try {
      setCreating(true);
      await api.post(`/planos/perfil/${userId}`, {
        nome: newPlano.nome,
        wallpaperUrl: newPlano.wallpaperUrl || null,
      });
      setNewPlano({ nome: "", wallpaperUrl: "" });
      setShowCreate(false);
      fetchPlanos();
    } catch (err) {
      console.error("Erro ao criar plano:", err);
      alert("Erro ao criar plano. Tente novamente.");
    } finally {
      setCreating(false);
    }
  };

  const handleEditPlano = async (e) => {
    e.preventDefault();
    if (!editData.nome.trim()) return;
    try {
      setSaving(true);
      await api.put(`/planos/perfil/${userId}/${editingPlano.id}`, {
        nome: editData.nome,
        wallpaperUrl: editData.wallpaperUrl || null,
      });
      setEditingPlano(null);
      fetchPlanos();
    } catch (err) {
      console.error("Erro ao atualizar plano:", err);
      alert("Erro ao atualizar plano.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePlano = async (planoId) => {
    if (
      !confirm(
        "Tem certeza que deseja remover este plano e todos os seus dados?"
      )
    )
      return;
    try {
      await api.delete(`/planos/perfil/${userId}/${planoId}`);
      fetchPlanos();
    } catch (err) {
      console.error("Erro ao remover plano:", err);
      alert("Erro ao remover plano.");
    }
  };

  const openEdit = (plano, e) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingPlano(plano);
    setEditData({ nome: plano.nome, wallpaperUrl: plano.wallpaperUrl || "" });
  };

  const filteredPlanos = planos.filter((p) =>
    p.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Meus Planos</h2>
          <p className="text-muted-foreground mt-1">
            Gerencie seus projetos e planos de trabalho
          </p>
        </div>
        <Button
          size="lg"
          className="bg-gradient-primary hover:opacity-90 shadow-glow-primary rounded-xl transition-all duration-300"
          onClick={() => setShowCreate(true)}
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Plano
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground/50 w-4 h-4" />
        <Input
          placeholder="Buscar planos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 glass-input rounded-xl"
        />
      </div>

      {/* Planos Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass rounded-2xl animate-pulse p-6">
              <div className="h-12 w-12 bg-muted/50 rounded-xl" />
              <div className="h-5 w-32 bg-muted/50 rounded mt-4" />
              <div className="h-4 w-full bg-muted/50 rounded mt-3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPlanos.map((plano) => (
            <Card
              key={plano.id}
              className="group glass-card rounded-2xl border-white/20 overflow-hidden relative"
            >
              <Link to={`/plano/${plano.id}`} className="block">
                {plano.wallpaperUrl && (
                  <div className="h-32 overflow-hidden">
                    <img
                      src={plano.wallpaperUrl}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                )}
                <CardHeader className="space-y-3 pb-4">
                  {!plano.wallpaperUrl && (
                    <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow-primary">
                      <FolderOpen className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {plano.nome}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Clique para abrir o quadro
                    </CardDescription>
                  </div>
                </CardHeader>
              </Link>
              {/* Action buttons */}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 glass-strong rounded-lg hover:bg-primary/20"
                  onClick={(e) => openEdit(plano, e)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 glass-strong rounded-lg hover:bg-destructive/20 hover:text-destructive"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDeletePlano(plano.id);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}

          {/* Add New Plano Card */}
          <div
            className="group glass-subtle rounded-2xl border-2 border-dashed border-white/20 hover:border-primary/40 flex items-center justify-center min-h-[200px] cursor-pointer transition-all duration-300 hover:bg-primary/5"
            onClick={() => setShowCreate(true)}
          >
            <div className="text-center space-y-3 p-6">
              <div className="w-12 h-12 mx-auto rounded-xl glass flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div>
                <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                  Novo Plano
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Clique para criar
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && filteredPlanos.length === 0 && planos.length === 0 && (
        <div className="text-center py-16">
          <div className="glass-subtle inline-flex p-6 rounded-2xl mb-6">
            <FolderOpen className="w-16 h-16 text-muted-foreground/30" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Nenhum plano ainda
          </h3>
          <p className="text-muted-foreground mb-6">
            Crie seu primeiro plano para comecar a organizar seus projetos.
          </p>
          <Button
            onClick={() => setShowCreate(true)}
            className="bg-gradient-primary hover:opacity-90 shadow-glow-primary rounded-xl"
          >
            <Plus className="w-4 h-4 mr-2" />
            Criar Primeiro Plano
          </Button>
        </div>
      )}

      {/* Create Plano Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="glass-strong rounded-2xl border-white/20">
          <DialogHeader>
            <DialogTitle>Criar Novo Plano</DialogTitle>
            <DialogDescription>
              De um nome ao seu novo plano de trabalho.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreatePlano} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Plano</Label>
              <Input
                id="nome"
                placeholder="Ex: Projeto Website"
                value={newPlano.nome}
                onChange={(e) =>
                  setNewPlano((p) => ({ ...p, nome: e.target.value }))
                }
                maxLength={50}
                required
                className="glass-input rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wallpaper">
                URL da Imagem de Capa (opcional)
              </Label>
              <div className="relative">
                <Image className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                <Input
                  id="wallpaper"
                  placeholder="https://exemplo.com/imagem.jpg"
                  value={newPlano.wallpaperUrl}
                  onChange={(e) =>
                    setNewPlano((p) => ({
                      ...p,
                      wallpaperUrl: e.target.value,
                    }))
                  }
                  className="pl-10 glass-input rounded-xl"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreate(false)}
                className="rounded-xl"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={creating}
                className="bg-gradient-primary hover:opacity-90 rounded-xl"
              >
                {creating ? "Criando..." : "Criar Plano"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Plano Dialog */}
      <Dialog
        open={editingPlano !== null}
        onOpenChange={() => setEditingPlano(null)}
      >
        <DialogContent className="glass-strong rounded-2xl border-white/20">
          <DialogHeader>
            <DialogTitle>Editar Plano</DialogTitle>
            <DialogDescription>
              Atualize as informacoes do plano.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditPlano} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editNome">Nome do Plano</Label>
              <Input
                id="editNome"
                value={editData.nome}
                onChange={(e) =>
                  setEditData((p) => ({ ...p, nome: e.target.value }))
                }
                maxLength={50}
                required
                className="glass-input rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editWallpaper">
                URL da Imagem de Capa (opcional)
              </Label>
              <div className="relative">
                <Image className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                <Input
                  id="editWallpaper"
                  placeholder="https://exemplo.com/imagem.jpg"
                  value={editData.wallpaperUrl}
                  onChange={(e) =>
                    setEditData((p) => ({
                      ...p,
                      wallpaperUrl: e.target.value,
                    }))
                  }
                  className="pl-10 glass-input rounded-xl"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingPlano(null)}
                className="rounded-xl"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-gradient-primary hover:opacity-90 rounded-xl"
              >
                {saving ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
