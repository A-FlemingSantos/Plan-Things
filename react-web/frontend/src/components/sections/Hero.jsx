import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Mesh animated background */}
      <div className="absolute inset-0 bg-background">
        <div className="absolute inset-0" style={{ backgroundImage: 'var(--mesh-gradient)' }} />
      </div>

      {/* Floating glass orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-[500px] h-[500px] bg-primary/8 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-10 -right-20 w-[600px] h-[600px] bg-accent-violet/6 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Glass badge */}
          <div className="inline-flex items-center px-5 py-2.5 rounded-full glass border border-white/30 mb-10 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary mr-2" />
            <span className="text-sm font-medium text-foreground/80">
              Gerencie projetos com eficiencia
            </span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight animate-fade-in-up">
            <span className="text-foreground">Agilize o Trabalho</span>
            <span className="block text-gradient-hero mt-2">em Equipe</span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-xl md:text-2xl mb-14 text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            Feito para pequenas equipes que querem crescer sem complicacoes
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <Link to="/cadastro">
              <Button
                size="lg"
                className="w-full sm:w-64 h-14 bg-gradient-primary hover:opacity-90 shadow-glow-primary hover:shadow-glow-violet text-white font-semibold text-base rounded-2xl transition-all duration-300 group"
              >
                Comecar Gratuitamente
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>

            <Link to="/login">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-64 h-14 glass border-white/30 hover:bg-white/20 font-semibold text-base rounded-2xl transition-all duration-300"
              >
                Entrar
              </Button>
            </Link>
          </div>

          {/* Trust indicators with glass effect */}
          <div
            className="mt-20 animate-fade-in-up"
            style={{ animationDelay: "0.6s" }}
          >
            <p className="text-sm mb-6 text-muted-foreground/70">
              Confiado por mais de 1.000 equipes em todo o Brasil
            </p>
            <div className="flex justify-center items-center gap-8">
              {["Startup Inc.", "Tech Solutions", "Creative Agency"].map(
                (name) => (
                  <div
                    key={name}
                    className="glass-subtle px-5 py-2.5 rounded-xl"
                  >
                    <span className="text-sm font-semibold text-muted-foreground/60">
                      {name}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
