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
import { ArrowLeft, Lock, Mail, Sparkles } from "lucide-react";
import api from "@/lib/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post("/perfil/login", {
        email: email,
        senha: password,
      });

      console.log("Login realizado com sucesso:", response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      localStorage.setItem("userId", response.data.id);

      alert("Login realizado com sucesso!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      if (error.response && error.response.status === 401) {
        alert(error.response.data.message || "Email ou senha invalidos");
      } else if (error.response) {
        alert(
          `Erro ao fazer login: ${
            error.response.data.message || "Erro no servidor"
          }`
        );
      } else if (error.request) {
        alert("Erro de conexao. Verifique se o backend esta rodando.");
      } else {
        alert("Erro ao processar login. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

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
        <div className="absolute top-20 left-20 w-[300px] h-[300px] bg-primary/8 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 right-20 w-[400px] h-[400px] bg-accent-violet/6 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "3s" }}
        />
      </div>

      <div className="w-full max-w-md relative z-10">
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
          <div className="h-1.5 bg-gradient-primary" />

          <CardHeader className="space-y-4 pb-6 pt-8">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl scale-150" />
                <div className="relative bg-gradient-primary p-4 rounded-2xl shadow-glow-primary">
                  <Lock className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            <CardTitle className="text-3xl text-center font-bold text-foreground">
              Bem-vindo de volta!
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground text-base">
              Entre com seus dados e continue sua jornada
            </CardDescription>
          </CardHeader>

          <CardContent className="px-8 pb-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-semibold text-foreground"
                >
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground/50" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 h-12 glass-input rounded-xl"
                  />
                </div>
              </div>
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
                    type="password"
                    placeholder="........"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 h-12 glass-input rounded-xl"
                  />
                </div>
              </div>

              <div className="text-right">
                <span className="text-sm text-muted-foreground/60 cursor-not-allowed">
                  Esqueceu sua senha?
                </span>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-primary hover:opacity-90 shadow-glow-primary hover:shadow-glow-violet text-white font-semibold text-base rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                {isLoading ? "Entrando..." : "Entrar na minha conta"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="glass-subtle px-8 py-6 border-t border-white/10">
            <div className="text-sm text-center text-muted-foreground w-full">
              Novo por aqui?{" "}
              <Link
                to="/cadastro"
                className="text-primary hover:text-primary/80 transition-colors duration-300 font-semibold hover:underline"
              >
                Crie sua conta gratuitamente
              </Link>
            </div>
          </CardFooter>
        </Card>

        {/* Trust indicator */}
        <div className="mt-8 text-center">
          <div className="glass-subtle inline-flex items-center px-5 py-2.5 rounded-full">
            <p className="text-muted-foreground/70 text-sm">
              Seus dados estao protegidos com criptografia de ponta
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
