import { Link } from "react-router-dom";
import { ArrowLeft, Layers, Moon, Sun } from "lucide-react";
import "@/features/homepage/styles/homepage-gemini.css";
import "./styles/auth-pages.css";
import { useTheme } from "@/contexts/ThemeContext";

function AmbientBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-70 animate-blob" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-70 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-cyan-600/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-70 animate-blob animation-delay-4000" />
    </div>
  );
}

export function AuthLayout({
  title,
  subtitle,
  children,
  altText,
  altHref,
  altAction,
}) {
  const { toggleTheme } = useTheme();

  const handleThemeToggle = () => {
    toggleTheme();
  };

  return (
    <div className="min-h-screen antialiased selection:bg-brand-500 selection:text-white auth-page-wrapper">
      <AmbientBackground />

      <header className="pt-6 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200 hover:text-brand-700 dark:hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar para homepage
          </Link>

          <button
            onClick={handleThemeToggle}
            className="p-2 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-900/5 dark:hover:bg-white/10 transition-colors focus:outline-none"
            aria-label="Toggle Theme"
          >
            <Sun className="w-5 h-5 hidden dark:block" />
            <Moon className="w-5 h-5 block dark:hidden" />
          </button>
        </div>
      </header>

      <main className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 sm:p-8 relative z-10">
        <section className="glass-panel w-full max-w-md rounded-3xl p-8 sm:p-10 border border-slate-900/10 dark:border-white/10 shadow-2xl">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/30">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-950 dark:text-white">Plan Things</span>
          </div>

          <h1 className="text-3xl font-bold text-slate-950 dark:text-white mb-3">{title}</h1>
          <p className="text-slate-700 dark:text-slate-300 mb-8">{subtitle}</p>

          {children}

          <p className="text-sm text-center text-slate-700 dark:text-slate-300 mt-8">
            {altText}{" "}
            <Link to={altHref} className="font-semibold text-brand-700 dark:text-brand-300 hover:text-brand-500">
              {altAction}
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}
