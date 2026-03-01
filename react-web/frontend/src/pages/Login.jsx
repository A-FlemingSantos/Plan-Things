import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
      // Fazer requisição POST para o endpoint de login
      const response = await api.post('/perfil/login', {
        email: email,
        senha: password
      });

      // Sucesso - salvar dados do usuário no localStorage
      console.log('Login realizado com sucesso:', response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      localStorage.setItem('userId', response.data.id);
      
      alert('Login realizado com sucesso!');
      navigate("/dashboard");
    } catch (error) {
      // Tratamento de erro
      console.error('Erro ao fazer login:', error);
      if (error.response && error.response.status === 401) {
        alert(error.response.data.message || 'Email ou senha inválidos');
      } else if (error.response) {
        alert(`Erro ao fazer login: ${error.response.data.message || 'Erro no servidor'}`);
      } else if (error.request) {
        alert('Erro de conexão. Verifique se o backend está rodando.');
      } else {
        alert('Erro ao processar login. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-primary/15 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-primary/10 rounded-full blur-lg"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back button */}
        <Link 
          to="/" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors duration-300 bg-primary/5 px-4 py-2 rounded-full border border-primary/20 hover:bg-primary/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para página inicial
        </Link>

        <Card className="shadow-strong bg-card border border-border overflow-hidden animate-fade-in-up">
          {/* Decorative header */}
          <div className="h-2 bg-primary"></div>
          
          <CardHeader className="space-y-4 pb-6">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg"></div>
                <div className="relative bg-primary p-4 rounded-full shadow-medium">
                  <Lock className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            <CardTitle className="text-3xl text-center font-bold text-primary">
              Bem-vindo de volta!
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground text-base">
              Entre com seus dados e continue sua jornada
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-8 pb-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-foreground">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 h-12 bg-background/50 border-2 border-border hover:border-primary/50 focus:border-primary transition-all duration-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-foreground">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 h-12 bg-background/50 border-2 border-border hover:border-primary/50 focus:border-primary transition-all duration-300 rounded-lg"
                  />
                </div>
              </div>
              
              <div className="text-right">
                <span className="text-sm text-muted-foreground cursor-not-allowed">
                  Esqueceu sua senha?
                </span>
              </div>
              
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-12 bg-primary hover:bg-primary/90 hover:shadow-strong transform hover:-translate-y-0.5 transition-all duration-300 text-white font-semibold text-base rounded-lg border-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                {isLoading ? "Entrando..." : "Entrar na minha conta"}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="bg-muted/30 px-8 py-6 border-t">
            <div className="text-sm text-center text-muted-foreground w-full">
              Novo por aqui?{" "}
              <Link 
                to="/cadastro" 
                className="text-primary hover:text-primary-dark transition-colors duration-300 font-semibold hover:underline"
              >
                Crie sua conta gratuitamente
              </Link>
            </div>
          </CardFooter>
        </Card>
        
        {/* Trust indicator */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground text-sm">
            🔒 Seus dados estão protegidos com criptografia de ponta
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
