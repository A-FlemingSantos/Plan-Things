import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, Mail, Phone, Settings } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          setError(
            "Usuário não autenticado. Faça login para acessar seu perfil."
          );
          setLoading(false);
          return;
        }
        const response = await api.get(`/perfil/${userId}`);
        setProfile(response.data);
      } catch (err) {
        console.error("Erro ao buscar perfil:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Erro ao carregar perfil"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-4 w-80 mt-2" />
          </div>
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
            <Card>
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <Skeleton className="w-24 h-24 rounded-full mb-4" />
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-32 mt-2" />
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-7 w-52" />
                <Skeleton className="h-4 w-72 mt-2" />
              </CardHeader>
              <CardContent className="space-y-6 pt-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center">
                    <Skeleton className="w-5 h-5 mr-3" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="text-center text-destructive mt-8">
          <h2 className="text-2xl font-bold">Erro</h2>
          <p className="mt-2">{error}</p>
          <Button onClick={() => navigate("/login")} className="mt-4">
            Fazer Login
          </Button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>Perfil não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            Perfil do Usuário
          </h2>
          <p className="text-muted-foreground mt-1">
            Visualize suas informações pessoais.
          </p>
        </div>
        <Button asChild>
          <Link to="/configuracoes">
            <Settings className="w-4 h-4 mr-2" />
            Editar Perfil
          </Link>
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                  {profile?.nome?.charAt(0) || "U"}
                  {profile?.sobrenome?.charAt(0) || ""}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold">
                {profile?.nome || ""} {profile?.sobrenome || ""}
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                {profile?.email}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Conta</CardTitle>
              <CardDescription>
                Detalhes de contato e informações pessoais.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <User className="w-5 h-5 mr-3 text-muted-foreground" />
                <span className="font-medium">Nome Completo:</span>
                <span className="ml-2 text-muted-foreground">
                  {profile?.nome || ""} {profile?.sobrenome || ""}
                </span>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-muted-foreground" />
                <span className="font-medium">Email:</span>
                <span className="ml-2 text-muted-foreground">
                  {profile?.email || "Não informado"}
                </span>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-muted-foreground" />
                <span className="font-medium">Telefone:</span>
                <span className="ml-2 text-muted-foreground">
                  {profile?.telefone || "Não informado"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
