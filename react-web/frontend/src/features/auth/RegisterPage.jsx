import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { AuthLayout } from "./AuthLayout";
import apiClient, { normalizeError } from "@/lib/apiClient";

function splitNomeCompleto(nomeCompleto) {
  const partes = nomeCompleto.trim().split(/\s+/).filter(Boolean);

  return {
    nome: partes[0] || "",
    sobrenome: partes.slice(1).join(" ") || undefined,
  };
}

const registerSchema = z.object({
  nomeCompleto: z
    .string()
    .trim()
    .min(1, "Nome é obrigatório")
    .max(101, "Nome completo deve ter no máximo 101 caracteres")
    .refine((value) => splitNomeCompleto(value).nome.length <= 50, {
      message: "Nome deve ter no máximo 50 caracteres",
    })
    .refine((value) => (splitNomeCompleto(value).sobrenome?.length ?? 0) <= 50, {
      message: "Sobrenome deve ter no máximo 50 caracteres",
    }),
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
  const [apiError, setApiError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nomeCompleto: "",
      email: "",
      senha: "",
    },
  });

  async function onSubmit(data) {
    setApiError(null);

    const { nome, sobrenome } = splitNomeCompleto(data.nomeCompleto);

    try {
      await apiClient.post("/perfil", {
        nome,
        sobrenome,
        email: data.email,
        senha: data.senha,
      });

      navigate("/login", {
        replace: true,
        state: {
          message: "Conta criada com sucesso. Faça login para continuar.",
        },
      });
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
            htmlFor="nomeCompleto"
            className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-2"
          >
            Nome completo
          </label>
          <input
            id="nomeCompleto"
            type="text"
            placeholder="Seu nome"
            className="auth-input"
            aria-invalid={!!errors.nomeCompleto}
            aria-describedby={errors.nomeCompleto ? "nome-completo-error" : undefined}
            {...register("nomeCompleto")}
          />
          {errors.nomeCompleto && (
            <p id="nome-completo-error" className="mt-1.5 text-sm text-red-600 dark:text-red-400">
              {errors.nomeCompleto.message}
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
