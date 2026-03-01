import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, User, Mail, Lock, Check, Sparkles, Zap } from "lucide-react";
import api from "@/lib/api";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("As senhas nao coincidem");
      return;
    }

    try {
      const perfilData = {
        nome: formData.name,
        email: formData.email,
        senha: formData.password,
      };

      const response = await api.post("/perfil", perfilData);

      console.log("Perfil criado com sucesso:", response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      localStorage.setItem("userId", response.data.id);

      alert("Cadastro realizado com sucesso!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Erro ao criar perfil:", error);
      if (error.response) {
        alert(
          `Erro ao cadastrar: ${
            error.response.data.message || "Erro no servidor"
          }`
        );
      } else if (error.request) {
        alert("Erro de conexao. Verifique se o backend esta rodando.");
      } else {
        alert("Erro ao processar cadastro. Tente novamente.");
      }
    }
  };

  const benefits = [
    "Gerenciamento ilimitado de projetos",
    "Colaboracao em tempo real",
    "Relatorios e analytics avancados",
    "Suporte prioritario 24/7",
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Mesh background */}
      <div className="absolute inset-0 bg-background">
        <div
          className="absolute inset-0"
          style={{ backgroundImage: "var(--mesh-gradient)" }}
        />
      </div>

      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-[350px] h-[350px] bg-accent-violet/6 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-10 left-10 w-[280px] h-[280px] bg-primary/8 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="w-full max-w-5xl relative z-10 flex gap-10 items-center">
        {/* Left side - Benefits */}
        <div className="hidden lg:flex flex-col space-y-8 flex-1">
          <div className="text-foreground">
            <h2 className="text-4xl font-bold mb-4 leading-tight">
              Comece sua jornada de
              <span className="block text-gradient-primary">
                produtividade hoje!
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Junte-se a milhares de equipes que ja transformaram sua forma de
              trabalhar
            </p>
          </div>

          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 glass-card p-4 rounded-xl animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="bg-gradient-primary p-1.5 rounded-full shadow-glow-primary">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <span className="font-medium text-foreground">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full max-w-md lg:max-w-lg">
          {/* Back button */}
          <Link
            to="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-all duration-300 glass-subtle px-4 py-2 rounded-full border border-white/20 hover:border-primary/30"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para pagina inicial
          </Link>

          <Card className="glass-strong rounded-2xl border-white/20 overflow-hidden shadow-glass-lg animate-fade-in-up">
            {/* Gradient top bar */}
            <div className="h-1.5 bg-gradient-hero" />

            <CardHeader className="space-y-4 pb-6 pt-8">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-accent-violet/20 rounded-2xl blur-xl scale-150" />
                  <div className="relative bg-gradient-hero p-4 rounded-2xl shadow-glow-violet">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
              <CardTitle className="text-3xl text-center font-bold text-foreground">
                Criar conta gratuita
              </CardTitle>
              <CardDescription className="text-center text-muted-foreground text-base">
                Configure sua conta em menos de 2 minutos
              </CardDescription>
            </CardHeader>

            <CardContent className="px-8 pb-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-semibold text-foreground"
                  >
                    Nome completo
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground/50" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Seu nome completo"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="pl-10 h-12 glass-input rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-semibold text-foreground"
                  >
                    Email profissional
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground/50" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="seu@empresa.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="pl-10 h-12 glass-input rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-semibold text-foreground"
                    >
                      Senha
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground/50" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="........"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="pl-10 h-12 glass-input rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm font-semibold text-foreground"
                    >
                      Confirmar
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground/50" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="........"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        className="pl-10 h-12 glass-input rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground/70 glass-subtle p-3 rounded-xl border border-white/10">
                  <p>
                    Ao criar sua conta, voce concorda com nossos Termos de Uso e
                    Politica de Privacidade.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-primary hover:opacity-90 shadow-glow-primary hover:shadow-glow-violet text-white font-semibold text-base rounded-xl transition-all duration-300"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Criar minha conta gratuita
                </Button>
              </form>
            </CardContent>

            <CardFooter className="glass-subtle px-8 py-6 border-t border-white/10">
              <div className="text-sm text-center text-muted-foreground w-full">
                Ja e membro?{" "}
                <Link
                  to="/login"
                  className="text-primary hover:text-primary/80 transition-colors duration-300 font-semibold hover:underline"
                >
                  Faca login aqui
                </Link>
              </div>
            </CardFooter>
          </Card>

          {/* Trust indicators */}
          <div className="mt-6 flex justify-center items-center gap-4 flex-wrap">
            {["SSL seguro", "LGPD compliance", "Sem cartao"].map((label) => (
              <div
                key={label}
                className="glass-subtle flex items-center gap-2 px-4 py-2 rounded-full"
              >
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                <span className="text-xs text-muted-foreground/70">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
