import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { AuthLayout } from "./AuthLayout";
import { useAuth } from "@/contexts/AuthContext";
import apiClient, { normalizeError } from "@/lib/apiClient";

const registerSchema = z.object({
  nome: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(50, "Nome deve ter no máximo 50 caracteres"),
  email: z
    .string()
    .min(1, "E-mail é obrigatório")
    .email("Formato de e-mail inválido")
    .max(320, "E-mail deve ter no máximo 320 caracteres"),
  senha: z
    .string()
    .min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [apiError, setApiError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { nome: "", email: "", senha: "" },
  });

  async function onSubmit(data) {
    setApiError(null);

    try {
      await apiClient.post("/perfil", {
        nome: data.nome,
        email: data.email,
        senha: data.senha,
      });

      const loginResponse = await apiClient.post("/perfil/login", {
        email: data.email,
        senha: data.senha,
      });

      login(loginResponse.data);
      const from = location.state?.from?.pathname ?? "/app/planos";
      navigate(from, { replace: true });
    } catch (err) {
      const normalized = normalizeError(err);
      setApiError(normalized.message);
    }
  }

  return (
    <AuthLayout
      title="Crie sua conta"
      subtitle="Comece gratuitamente e centralize suas tarefas, times e entregas em um só lugar."
      altText="Já tem uma conta?"
      altHref="/login"
      altAction="Fazer login"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {apiError && (
          <div
            role="alert"
            className="rounded-xl border border-red-300 dark:border-red-500/40 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-300"
          >
            {apiError}
          </div>
        )}

        <div>
          <label
            htmlFor="nome"
            className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-2"
          >
            Nome completo
          </label>
          <input
            id="nome"
            type="text"
            placeholder="Seu nome"
            className="auth-input"
            aria-invalid={!!errors.nome}
            aria-describedby={errors.nome ? "nome-error" : undefined}
            {...register("nome")}
          />
          {errors.nome && (
            <p id="nome-error" className="mt-1.5 text-sm text-red-600 dark:text-red-400">
              {errors.nome.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-2"
          >
            E-mail
          </label>
          <input
            id="email"
            type="email"
            placeholder="seuemail@empresa.com"
            className="auth-input"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
          />
          {errors.email && (
            <p id="email-error" className="mt-1.5 text-sm text-red-600 dark:text-red-400">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="senha"
            className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-2"
          >
            Senha
          </label>
          <input
            id="senha"
            type="password"
            placeholder="Crie uma senha segura"
            className="auth-input"
            aria-invalid={!!errors.senha}
            aria-describedby={errors.senha ? "senha-error" : undefined}
            {...register("senha")}
          />
          {errors.senha && (
            <p id="senha-error" className="mt-1.5 text-sm text-red-600 dark:text-red-400">
              {errors.senha.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="glass-button-primary w-full py-3.5 rounded-xl text-white font-medium flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Criando conta...
            </>
          ) : (
            "Criar conta"
          )}
        </button>
      </form>
    </AuthLayout>
  );
}
