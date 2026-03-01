import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Twitter, Linkedin, Instagram, Mail } from "lucide-react";

const footerLinks = {
  product: [
    { name: "Recursos", href: "#" },
    { name: "Precos", href: "#" },
    { name: "Integracoes", href: "#" },
    { name: "API", href: "#" },
  ],
  company: [
    { name: "Sobre Nos", href: "#" },
    { name: "Carreiras", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Contato", href: "#" },
  ],
  support: [
    { name: "Central de Ajuda", href: "#" },
    { name: "Documentacao", href: "#" },
    { name: "Status", href: "#" },
    { name: "Seguranca", href: "#" },
  ],
  legal: [
    { name: "Privacidade", href: "#" },
    { name: "Termos", href: "#" },
    { name: "Cookies", href: "#" },
    { name: "LGPD", href: "#" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Instagram, href: "#", label: "Instagram" },
];

export const Footer = () => {
  return (
    <footer className="relative bg-foreground text-white overflow-hidden">
      {/* Subtle glass overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

      {/* Newsletter section */}
      <div className="border-b border-white/10 relative z-10">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-bold mb-4">
              Fique por Dentro das Novidades
            </h3>
            <p className="text-white/70 mb-8 text-lg">
              Receba dicas de produtividade, novos recursos e ofertas exclusivas
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Seu melhor email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 rounded-xl h-12"
              />
              <Button className="bg-gradient-primary hover:opacity-90 whitespace-nowrap rounded-xl h-12 shadow-glow-primary">
                <Mail className="mr-2 h-4 w-4" />
                Inscrever-se
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-2xl font-bold mb-6">Plan Things</h3>
            <p className="text-white/60 mb-6 text-sm leading-relaxed">
              A plataforma de gerenciamento de projetos que pequenas equipes
              adoram usar.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links columns */}
          <div>
            <h4 className="font-semibold mb-6 text-white text-sm uppercase tracking-wider">
              Produto
            </h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-white/60 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-white text-sm uppercase tracking-wider">
              Empresa
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-white/60 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-white text-sm uppercase tracking-wider">
              Suporte
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-white/60 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-white text-sm uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-white/60 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/50 text-sm mb-4 md:mb-0">
            &copy; 2025 Plan Things. Todos os direitos reservados.
          </p>
          <div className="text-white/50 text-sm">Feito com amor no Brasil</div>
        </div>
      </div>
    </footer>
  );
};
