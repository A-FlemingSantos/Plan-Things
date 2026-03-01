const stats = [
  {
    number: "1000+",
    label: "Equipes Ativas",
    description: "Pequenas equipes usando nossa plataforma",
  },
  {
    number: "50K+",
    label: "Projetos Concluidos",
    description: "Projetos finalizados com sucesso",
  },
  {
    number: "98%",
    label: "Satisfacao",
    description: "Taxa de satisfacao dos usuarios",
  },
  {
    number: "24/7",
    label: "Suporte",
    description: "Assistencia sempre disponivel",
  },
];

export const Stats = () => {
  return (
    <section className="py-28 relative overflow-hidden">
      {/* Gradient background with glass effect */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />

      {/* Decorative orbs */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-white/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Resultados que Falam por Si
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Junte-se a milhares de equipes que ja transformaram sua
            produtividade
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-300 group"
            >
              <div className="mb-4">
                <span className="text-5xl md:text-6xl font-bold text-white block group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {stat.label}
              </h3>
              <p className="text-white/70 text-sm">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
