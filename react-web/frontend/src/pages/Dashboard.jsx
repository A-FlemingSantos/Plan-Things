import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  FolderOpen, 
  Users, 
  Calendar, 
  Settings, 
  Plus,
  Search,
  Bell,
  User,
  LogOut,
  BarChart3,
  CheckSquare,
  Clock,
  TrendingUp,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const sidebarItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Projetos", url: "/projetos", icon: FolderOpen },
  { title: "Equipe", url: "/equipe", icon: Users },
  { title: "Calendário", url: "/calendario", icon: Calendar },
  { title: "Relatórios", url: "/relatorios", icon: BarChart3 },
  { title: "Configurações", url: "/configuracoes", icon: Settings },
];

const recentProjects = [
  { id: 1, name: "Redesign Website", status: "Em Andamento", progress: 75, team: 4 },
  { id: 2, name: "App Mobile", status: "Concluído", progress: 100, team: 3 },
  { id: 3, name: "Marketing Q4", status: "Planejamento", progress: 25, team: 5 },
];

const tasks = [
  { id: 1, title: "Revisar design do header", priority: "Alta", dueDate: "Hoje" },
  { id: 2, title: "Implementar autenticação", priority: "Média", dueDate: "Amanhã" },
  { id: 3, title: "Testes de usabilidade", priority: "Baixa", dueDate: "Próxima semana" },
];

function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  
  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="bg-sidebar-background">
        {!collapsed && (
          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-light rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-sidebar-foreground">WorkSpace</span>
            </div>
          </div>
        )}
        
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton className="w-full justify-start hover:bg-sidebar-accent">
                    <item.icon className="w-4 h-4 text-sidebar-foreground" />
                    {!collapsed && <span className="text-sidebar-foreground">{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {!collapsed && (
          <div className="mt-auto p-4 border-t border-sidebar-border">
            <Button className="w-full" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Novo Projeto
            </Button>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    // Limpar localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    
    // Redirecionar para página de login
    navigate('/login');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <SidebarTrigger />
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-semibold text-foreground">Área de Trabalho</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar projetos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-4 h-4" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-destructive">
                  3
                </Badge>
              </Button>
              
              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/perfil">
                      <User className="w-4 h-4 mr-2" />
                      Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Configurações
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-8 space-y-8 overflow-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Área de Trabalho</h2>
                <p className="text-muted-foreground mt-1">Gerencie seus projetos de forma eficiente</p>
              </div>
              <Button size="lg" className="shadow-md">
                <Plus className="w-5 h-5 mr-2" />
                Novo Projeto
              </Button>
            </div>

            {/* Recentes Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-foreground">Recentes</h3>
                <Button variant="ghost" size="sm">Ver todos</Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recentProjects.map((project) => (
                  <Card 
                    key={project.id} 
                    className="group hover:shadow-elegant transition-all duration-300 cursor-pointer border-border/50 hover:border-primary/30 overflow-hidden"
                  >
                    <CardHeader className="space-y-3 pb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-md">
                        <FolderOpen className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {project.name}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {project.team} membros da equipe
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant={project.status === "Concluído" ? "default" : 
                                 project.status === "Em Andamento" ? "secondary" : "outline"}
                          className="shadow-sm"
                        >
                          {project.status}
                        </Badge>
                        <span className="text-sm font-medium text-primary">
                          {project.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-secondary/30 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-gradient-primary h-2 rounded-full transition-all duration-500 shadow-sm"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {/* Add New Project Card */}
                <Card className="group hover:shadow-elegant transition-all duration-300 cursor-pointer border-dashed border-2 border-border/50 hover:border-primary/50 bg-muted/20 flex items-center justify-center min-h-[240px]">
                  <div className="text-center space-y-3 p-6">
                    <div className="w-12 h-12 mx-auto rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                        Novo Projeto
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Clique para criar
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
