import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Save,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import api from "@/lib/api";

export default function Configuracoes() {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    sobrenome: "",
    email: "",
    telefone: "",
  });
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const res = await api.get(`/perfil/${userId}`);
      setForm({
        nome: res.data.nome || "",
        sobrenome: res.data.sobrenome || "",
        email: res.data.email || "",
        telefone: res.data.telefone || "",
      });
    } catch (err) {
      console.error("Erro ao buscar perfil:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSuccessMsg("");
      await api.put(`/perfil/${userId}`, {
        nome: form.nome,
        sobrenome: form.sobrenome,
        email: form.email,
        telefone: form.telefone,
      });
      // Update localStorage
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUser = { ...currentUser, ...form };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setSuccessMsg("Perfil atualizado com sucesso!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error("Erro ao atualizar:", err);
      alert(
        err.response?.data?.message ||
          "Erro ao atualizar perfil. Tente novamente."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async () => {
    if (
      !confirm(
        "Tem certeza que deseja desativar sua conta? Você não poderá mais acessar a plataforma."
      )
    )
      return;
    try {
      await api.delete(`/perfil/${userId}`);
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
      navigate("/login");
    } catch (err) {
      console.error("Erro ao desativar conta:", err);
      alert("Erro ao desativar conta.");
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-2xl mx-auto space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-4 w-72 bg-muted rounded" />
          <div className="h-64 bg-muted rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Configurações</h2>
        <p className="text-muted-foreground mt-1">
          Gerencie suas informações de conta
        </p>
      </div>

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
          <CardDescription>Atualize seus dados de perfil.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="nome"
                    value={form.nome}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, nome: e.target.value }))
                    }
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sobrenome">Sobrenome</Label>
                <Input
                  id="sobrenome"
                  value={form.sobrenome}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, sobrenome: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="telefone"
                  value={form.telefone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, telefone: e.target.value }))
                  }
                  className="pl-10"
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>

            {successMsg && (
              <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
                {successMsg}
              </div>
            )}

            <Button type="submit" disabled={saving} className="w-full sm:w-auto">
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Separator />

      {/* Danger Zone */}
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Zona de Perigo
          </CardTitle>
          <CardDescription>
            Ações irreversíveis para sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Ao desativar sua conta, seus dados serão preservados mas você não
            poderá mais acessar a plataforma.
          </p>
          <Button variant="destructive" onClick={handleDeactivate}>
            <Trash2 className="w-4 h-4 mr-2" />
            Desativar Conta
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
