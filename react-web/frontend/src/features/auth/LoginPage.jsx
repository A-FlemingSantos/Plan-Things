import { AuthLayout } from "./AuthLayout";

export function LoginPage() {
  return (
    <AuthLayout
      title="Bem-vindo de volta"
      subtitle="Acesse sua conta para continuar organizando seus projetos com foco total."
      altText="Ainda não possui conta?"
      altHref="/cadastro"
      altAction="Criar cadastro"
    >
      <form className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-2">E-mail</label>
          <input id="email" type="email" placeholder="seuemail@empresa.com" className="auth-input" />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-2">Senha</label>
          <input id="password" type="password" placeholder="••••••••" className="auth-input" />
        </div>

        <button type="submit" className="glass-button-primary w-full py-3.5 rounded-xl text-white font-medium">
          Entrar
        </button>
      </form>
    </AuthLayout>
  );
}
