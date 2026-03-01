import { Card, CardContent } from "@/components/ui/card";
import { Users, Target, BarChart3, Clock, Shield, Zap } from "lucide-react";
import collaborationImg from "@/assets/feature-collaboration.jpg";
import tasksImg from "@/assets/feature-tasks.jpg";
import analyticsImg from "@/assets/feature-analytics.jpg";
import { useInView } from "@/hooks/useInView";

const mainFeatures = [
  {
    icon: Users,
    title: "Colaboracao em Tempo Real",
    description:
      "Trabalhe junto com sua equipe em projetos, compartilhe arquivos e mantenha todos alinhados.",
    image: collaborationImg,
  },
  {
    icon: Target,
    title: "Gestao Inteligente de Tarefas",
    description:
      "Organize tarefas, defina prioridades e acompanhe o progresso com kanban boards intuitivos.",
    image: tasksImg,
  },
  {
    icon: BarChart3,
    title: "Relatorios e Analytics",
    description:
      "Visualize metricas de produtividade, identifique gargalos e otimize seus processos.",
    image: analyticsImg,
  },
];

const additionalFeatures = [
  {
    icon: Clock,
    title: "Controle de Tempo",
    description: "Track de tempo automatico para projetos e tarefas",
  },
  {
    icon: Shield,
    title: "Seguranca Avancada",
    description: "Seus dados protegidos com criptografia de ponta",
  },
  {
    icon: Zap,
    title: "Integracoes",
    description: "Conecte com suas ferramentas favoritas",
  },
];

export const Features = () => {
  const [ref, isInView] = useInView();

  return (
    <section
      ref={ref}
      className={`py-28 relative transition-all duration-1000 ${
        isInView ? "animate-fade-in-up" : "opacity-0 translate-y-10"
      }`}
    >
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full glass-subtle border border-primary/10 mb-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Recursos
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Tudo que Voce Precisa em
            <span className="block text-gradient-primary mt-1">
              Uma So Plataforma
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Simplifique o gerenciamento de projetos com ferramentas poderosas e
            intuitivas
          </p>
        </div>

        {/* Main features grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {mainFeatures.map((feature, index) => (
            <Card
              key={index}
              className="group glass-card rounded-2xl border-white/20 overflow-hidden"
            >
              <CardContent className="p-0">
                {/* Feature image */}
                <div className="relative overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>

                <div className="p-8">
                  {/* Icon */}
                  <div className="w-14 h-14 bg-gradient-primary rounded-2xl flex items-center justify-center mb-6 shadow-glow-primary group-hover:scale-110 transition-transform duration-300 -mt-12 relative z-10 border-4 border-white/80">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional features */}
        <div className="grid md:grid-cols-3 gap-6">
          {additionalFeatures.map((feature, index) => (
            <div
              key={index}
              className="glass-card rounded-2xl p-8 text-center group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary-light rounded-xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300 shadow-md">
                <feature.icon className="h-5 w-5 text-white" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">
                {feature.title}
              </h4>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
