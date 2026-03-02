import { AuthLayout } from "./AuthLayout";

export function RegisterPage() {
  return (
    <AuthLayout
      title="Crie sua conta"
      subtitle="Comece gratuitamente e centralize suas tarefas, times e entregas em um só lugar."
      altText="Já tem uma conta?"
      altHref="/login"
      altAction="Fazer login"
    >
      <form className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-2">Nome completo</label>
          <input id="name" type="text" placeholder="Seu nome" className="auth-input" />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-2">E-mail</label>
          <input id="email" type="email" placeholder="seuemail@empresa.com" className="auth-input" />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-2">Senha</label>
          <input id="password" type="password" placeholder="Crie uma senha segura" className="auth-input" />
        </div>

        <button type="submit" className="glass-button-primary w-full py-3.5 rounded-xl text-white font-medium">
          Criar conta
        </button>
      </form>
    </AuthLayout>
  );
}
