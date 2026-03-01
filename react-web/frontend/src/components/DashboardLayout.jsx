import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Settings,
  Plus,
  User,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
  useSidebar,
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
  { title: "Calendario", url: "/calendario", icon: Calendar },
  { title: "Configuracoes", url: "/configuracoes", icon: Settings },
];

function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="glass-sidebar">
        <div
          className={`border-b border-white/10 overflow-hidden transition-all duration-150 ease-out ${
            collapsed
              ? "max-h-0 opacity-0 p-0"
              : "max-h-20 opacity-100 p-4"
          }`}
        >
          <Link
            to="/dashboard"
            className="flex items-center space-x-3 whitespace-nowrap"
          >
            <div className="w-9 h-9 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow-primary flex-shrink-0">
              <LayoutDashboard className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sidebar-foreground text-lg tracking-tight">
              Plan Things
            </span>
          </Link>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel
            className={`text-xs uppercase tracking-wider text-muted-foreground/70 px-4 overflow-hidden whitespace-nowrap transition-all duration-150 ease-out ${
              collapsed
                ? "max-h-0 opacity-0 mt-0 py-0"
                : "max-h-8 opacity-100 mt-2"
            }`}
          >
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`w-full justify-start transition-all duration-150 ease-out rounded-xl ${
                        collapsed ? "mx-0" : "mx-1"
                      } ${
                        isActive
                          ? "bg-primary/10 text-primary shadow-sm border border-primary/20"
                          : "hover:bg-white/10 text-sidebar-foreground"
                      }`}
                    >
                      <Link to={item.url}>
                        <item.icon
                          className={`w-4 h-4 flex-shrink-0 transition-transform duration-150 ease-out ${
                            isActive
                              ? "text-primary"
                              : "text-sidebar-foreground/70"
                          }`}
                        />
                        <span
                          className={`font-medium whitespace-nowrap transition-opacity duration-150 ease-out ${
                            collapsed ? "opacity-0" : "opacity-100"
                          } ${isActive ? "text-primary" : ""}`}
                        >
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div
          className={`mt-auto border-t border-white/10 overflow-hidden transition-all duration-150 ease-out ${
            collapsed
              ? "max-h-0 opacity-0 p-0"
              : "max-h-20 opacity-100 p-4"
          }`}
        >
          <Button
            asChild
            className="w-full bg-gradient-primary hover:opacity-90 shadow-glow-primary transition-all duration-300 rounded-xl whitespace-nowrap"
            size="sm"
          >
            <Link to="/dashboard">
              <Plus className="w-4 h-4 mr-2 flex-shrink-0" />
              Novo Plano
            </Link>
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

export default function DashboardLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          <header className="glass-header h-16 flex items-center justify-between px-6 sticky top-0 z-30">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="hover:bg-white/20 rounded-lg transition-colors" />
            </div>

            <div className="flex items-center space-x-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-white/20 border border-transparent hover:border-white/20 transition-all duration-200"
                  >
                    <User className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="glass-strong rounded-xl border-white/20 min-w-[200px]"
                >
                  <DropdownMenuLabel className="text-xs uppercase tracking-wider text-muted-foreground">
                    Minha Conta
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border/50" />
                  <DropdownMenuItem
                    asChild
                    className="rounded-lg cursor-pointer"
                  >
                    <Link to="/perfil">
                      <User className="w-4 h-4 mr-2" />
                      Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="rounded-lg cursor-pointer"
                  >
                    <Link to="/configuracoes">
                      <Settings className="w-4 h-4 mr-2" />
                      Configuracoes
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border/50" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="rounded-lg cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
