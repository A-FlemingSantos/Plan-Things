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
            "Usuario nao autenticado. Faca login para acessar seu perfil."
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
            <div className="glass rounded-2xl p-6 flex flex-col items-center">
              <Skeleton className="w-24 h-24 rounded-full mb-4" />
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-32 mt-2" />
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="glass rounded-2xl p-6 space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center">
                  <Skeleton className="w-5 h-5 mr-3" />
                  <Skeleton className="h-5 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="text-center mt-8">
          <div className="glass-subtle inline-flex p-6 rounded-2xl mb-4">
            <User className="w-12 h-12 text-destructive/50" />
          </div>
          <h2 className="text-2xl font-bold text-destructive">Erro</h2>
          <p className="mt-2 text-muted-foreground">{error}</p>
          <Button
            onClick={() => navigate("/login")}
            className="mt-4 bg-gradient-primary hover:opacity-90 rounded-xl"
          >
            Fazer Login
          </Button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>Perfil nao encontrado.</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            Perfil do Usuario
          </h2>
          <p className="text-muted-foreground mt-1">
            Visualize suas informacoes pessoais.
          </p>
        </div>
        <Button
          asChild
          className="bg-gradient-primary hover:opacity-90 shadow-glow-primary rounded-xl"
        >
          <Link to="/configuracoes">
            <Settings className="w-4 h-4 mr-2" />
            Editar Perfil
          </Link>
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card className="glass rounded-2xl border-white/20">
            <CardContent className="pt-8 pb-8 flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl scale-125" />
                <Avatar className="w-24 h-24 relative">
                  <AvatarFallback className="text-2xl bg-gradient-primary text-white font-bold">
                    {profile?.nome?.charAt(0) || "U"}
                    {profile?.sobrenome?.charAt(0) || ""}
                  </AvatarFallback>
                </Avatar>
              </div>
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
          <Card className="glass rounded-2xl border-white/20">
            <CardHeader>
              <CardTitle>Informacoes da Conta</CardTitle>
              <CardDescription>
                Detalhes de contato e informacoes pessoais.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center p-3 glass-subtle rounded-xl">
                <User className="w-5 h-5 mr-3 text-primary" />
                <span className="font-medium">Nome Completo:</span>
                <span className="ml-2 text-muted-foreground">
                  {profile?.nome || ""} {profile?.sobrenome || ""}
                </span>
              </div>
              <div className="flex items-center p-3 glass-subtle rounded-xl">
                <Mail className="w-5 h-5 mr-3 text-primary" />
                <span className="font-medium">Email:</span>
                <span className="ml-2 text-muted-foreground">
                  {profile?.email || "Nao informado"}
                </span>
              </div>
              <div className="flex items-center p-3 glass-subtle rounded-xl">
                <Phone className="w-5 h-5 mr-3 text-primary" />
                <span className="font-medium">Telefone:</span>
                <span className="ml-2 text-muted-foreground">
                  {profile?.telefone || "Nao informado"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
