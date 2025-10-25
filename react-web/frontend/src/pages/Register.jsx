import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, User, Mail, Lock, Check, Sparkles, Zap } from "lucide-react";
import api from "@/lib/api";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle registration logic here
    if (formData.password !== formData.confirmPassword) {
      alert("As senhas não coincidem");
      return;
    }

    try {
      // Preparar dados para enviar ao backend
      const perfilData = {
        nome: formData.name,
        email: formData.email,
        senha: formData.password
      };

      // Fazer requisição POST para o endpoint
      const response = await api.post('/perfil', perfilData);
      
      // Sucesso - salvar dados do usuário no localStorage
      console.log('Perfil criado com sucesso:', response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      localStorage.setItem('userId', response.data.id);
      
      alert('Cadastro realizado com sucesso!');
      navigate("/dashboard");
    } catch (error) {
      // Tratamento de erro
      console.error('Erro ao criar perfil:', error);
      if (error.response) {
        alert(`Erro ao cadastrar: ${error.response.data.message || 'Erro no servidor'}`);
      } else if (error.request) {
        alert('Erro de conexão. Verifique se o backend está rodando.');
      } else {
        alert('Erro ao processar cadastro. Tente novamente.');
      }
    }
  };

  const benefits = [
    "Gerenciamento ilimitado de projetos",
    "Colaboração em tempo real",
    "Relatórios e analytics avançados",
    "Suporte prioritário 24/7"
  ];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-36 h-36 bg-primary/15 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 left-10 w-28 h-28 bg-primary/20 rounded-full blur-2xl"></div>
        <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-primary/10 rounded-full blur-lg"></div>
      </div>

      <div className="w-full max-w-5xl relative z-10 flex gap-8 items-center">
        {/* Left side - Benefits */}
        <div className="hidden lg:flex flex-col space-y-8 flex-1">
          <div className="text-foreground">
            <h2 className="text-4xl font-bold mb-4 leading-tight">
              Comece sua jornada de
              <span className="block text-primary">
                produtividade hoje!
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Junte-se a milhares de equipes que já transformaram sua forma de trabalhar
            </p>
          </div>

          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className="flex items-center space-x-3 text-foreground bg-primary/5 p-4 rounded-xl border border-primary/20"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="bg-primary p-1.5 rounded-full">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <span className="font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full max-w-md lg:max-w-lg">
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
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
              <CardTitle className="text-3xl text-center font-bold text-primary">
                Criar conta gratuita
              </CardTitle>
              <CardDescription className="text-center text-muted-foreground text-base">
                Configure sua conta em menos de 2 minutos
              </CardDescription>
            </CardHeader>
            
            <CardContent className="px-8 pb-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold text-foreground">Nome completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Seu nome completo"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="pl-10 h-12 bg-background/50 border-2 border-border hover:border-primary/50 focus:border-primary transition-all duration-300 rounded-lg"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-foreground">Email profissional</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="seu@empresa.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="pl-10 h-12 bg-background/50 border-2 border-border hover:border-primary/50 focus:border-primary transition-all duration-300 rounded-lg"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-semibold text-foreground">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="pl-10 h-12 bg-background/50 border-2 border-border hover:border-primary/50 focus:border-primary transition-all duration-300 rounded-lg"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-semibold text-foreground">Confirmar</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        className="pl-10 h-12 bg-background/50 border-2 border-border hover:border-primary/50 focus:border-primary transition-all duration-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
                  <p>Ao criar sua conta, você concorda com nossos Termos de Uso e Política de Privacidade.</p>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-primary hover:bg-primary/90 hover:shadow-strong transform hover:-translate-y-0.5 transition-all duration-300 text-white font-semibold text-base rounded-lg border-0"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Criar minha conta gratuita
                </Button>
              </form>
            </CardContent>
            
            <CardFooter className="bg-muted/30 px-8 py-6 border-t">
              <div className="text-sm text-center text-muted-foreground w-full">
                Já é membro?{" "}
                <Link 
                  to="/login" 
                  className="text-primary hover:text-primary-dark transition-colors duration-300 font-semibold hover:underline"
                >
                  Faça login aqui
                </Link>
              </div>
            </CardFooter>
          </Card>
          
          {/* Trust indicators */}
          <div className="mt-6 flex justify-center items-center space-x-6 text-muted-foreground text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>SSL seguro</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>LGPD compliance</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Sem cartão</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
