import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Ghost } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Mesh background */}
      <div className="absolute inset-0 bg-background">
        <div
          className="absolute inset-0"
          style={{ backgroundImage: "var(--mesh-gradient)" }}
        />
      </div>

      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-accent-violet/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "3s" }}
        />
      </div>

      <div className="relative z-10 text-center px-6">
        <div className="glass-strong inline-flex p-8 rounded-3xl mb-8 shadow-glass-lg">
          <Ghost className="w-20 h-20 text-muted-foreground/40" />
        </div>
        <h1 className="text-8xl font-bold text-gradient-primary mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto">
          A pagina que voce procura nao foi encontrada ou foi movida.
        </p>
        <Button
          asChild
          className="bg-gradient-primary hover:opacity-90 shadow-glow-primary rounded-xl h-12 px-8 text-base"
        >
          <Link to="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para o inicio
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
