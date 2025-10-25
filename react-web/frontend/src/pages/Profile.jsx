import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, User, Mail, Phone, Edit, ArrowLeft } from "lucide-react";
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
        // Obter o ID do usuário do localStorage
        const userId = localStorage.getItem('userId');
        
        if (!userId) {
          setError("Usuário não autenticado. Faça login para acessar seu perfil.");
          setLoading(false);
          return;
        }
        
        const response = await api.get(`/perfil/${userId}`);
        setProfile(response.data);
      } catch (err) {
        console.error("Erro ao buscar perfil:", err);
        setError(err.response?.data?.message || err.message || "Erro ao carregar perfil");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 p-8 space-y-8 bg-background">
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
                <Skeleton className="h-9 w-28 mt-4" />
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
                <div className="flex items-center">
                  <Skeleton className="w-5 h-5 mr-3" />
                  <Skeleton className="h-5 w-full" />
                </div>
                <div className="flex items-center">
                  <Skeleton className="w-5 h-5 mr-3" />
                  <Skeleton className="h-5 w-full" />
                </div>
                <div className="flex items-center">
                  <Skeleton className="w-5 h-5 mr-3" />
                  <Skeleton className="h-5 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-8 bg-background min-h-screen">
        <Link 
          to="/dashboard" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors duration-300 bg-primary/5 px-4 py-2 rounded-full border border-primary/20 hover:bg-primary/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao Dashboard
        </Link>
        <div className="text-center text-destructive mt-8">
          <h2 className="text-2xl font-bold">Erro</h2>
          <p className="mt-2">{error}</p>
          <Button onClick={() => navigate('/login')} className="mt-4">
            Fazer Login
          </Button>
        </div>
      </div>
    );
  }

  // Adiciona uma verificação para garantir que o perfil existe antes de renderizar
  if (!profile) {
    return (
      <div className="flex-1 p-8 text-center text-muted-foreground">
        <p>Perfil não encontrado ou ainda carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 space-y-8 bg-background min-h-screen">
      <Link 
        to="/dashboard" 
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4 transition-colors duration-300 bg-primary/5 px-4 py-2 rounded-full border border-primary/20 hover:bg-primary/10"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar ao Dashboard
      </Link>
      
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Perfil do Usuário</h2>
          <p className="text-muted-foreground mt-1">Visualize e edite suas informações.</p>
        </div>
        <Button>
          <Edit className="w-4 h-4 mr-2" />
          Editar Perfil
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>
                  {profile?.nome?.charAt(0) || 'U'}{profile?.sobrenome?.charAt(0) || 'S'}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold">{profile?.nome || ''} {profile?.sobrenome || ''}</h3>
              <p className="text-muted-foreground">Desenvolvedor Full-Stack</p>
              <Button variant="outline" size="sm" className="mt-4">
                Mudar Foto
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Conta</CardTitle>
              <CardDescription>Detalhes de contato e informações pessoais.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <User className="w-5 h-5 mr-3 text-muted-foreground" />
                <span className="font-medium">Nome Completo:</span>
                <span className="ml-2 text-muted-foreground">{profile?.nome || ''} {profile?.sobrenome || ''}</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-muted-foreground" />
                <span className="font-medium">Email:</span>
                <span className="ml-2 text-muted-foreground">{profile?.email || 'Não informado'}</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-muted-foreground" />
                <span className="font-medium">Telefone:</span>
                <span className="ml-2 text-muted-foreground">{profile?.telefone || "Não informado"}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
