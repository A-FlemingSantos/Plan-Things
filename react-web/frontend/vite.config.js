import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isTest = mode === "test";

  // ─── Carrega variáveis do .env ────────────────────────────────────────────
  const env = loadEnv(mode, process.cwd(), "");

  // ─── Detecção automática de ambiente ─────────────────────────────────────
  // GitHub Codespaces expõe estas variáveis de processo no servidor Node.js
  const isCodespaces = process.env.CODESPACES === "true";
  const codespaceName = process.env.CODESPACE_NAME ?? "";
  const csFwDomain =
    process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN ?? "app.github.dev";

  // ─── Portas configuráveis ─────────────────────────────────────────────────
  const devPort = parseInt(env.VITE_DEV_PORT ?? "5173", 10);
  const previewPort = parseInt(env.VITE_PREVIEW_PORT ?? "4173", 10);
  const backendPort = parseInt(env.VITE_BACKEND_PORT ?? "8080", 10);

  // ─── Resolução da URL base da API ─────────────────────────────────────────
  // Prioridade: VITE_API_URL explícita no .env → Codespaces automático → localhost
  let apiBaseUrl;
  if (env.VITE_API_URL) {
    // Valor explícito no .env tem prioridade máxima
    apiBaseUrl = env.VITE_API_URL;
  } else if (isCodespaces && codespaceName) {
    // Constrói automaticamente a URL pública do backend no Codespaces
    apiBaseUrl = `https://${codespaceName}-${backendPort}.${csFwDomain}/api/v1`;
  } else {
    // Desenvolvimento local padrão
    apiBaseUrl = `http://localhost:${backendPort}/api/v1`;
  }

  // Extrai a origem (origin) para configurar o proxy do Vite
  let apiProxyTarget;
  try {
    apiProxyTarget = new URL(apiBaseUrl).origin;
  } catch {
    apiProxyTarget = `http://localhost:${backendPort}`;
  }

  // ─── allowedHosts para Codespaces ────────────────────────────────────────
  // No Codespaces o domínio é dinâmico; "all" é necessário para o HMR funcionar
  const allowedHosts = isCodespaces ? "all" : undefined;

  // ─── HMR: ajuste de WebSocket para Codespaces ────────────────────────────
  // O HMR do Vite precisa saber o host público quando atrás de um túnel
  const hmrConfig = isCodespaces
    ? {
        protocol: "wss",
        host: `${codespaceName}-${devPort}.${csFwDomain}`,
        clientPort: 443,
      }
    : undefined;

  // ─── Injeção de variáveis no cliente ─────────────────────────────────────
  // Garante que import.meta.env.VITE_API_URL seja sempre resolvido corretamente,
  // mesmo que o .env esteja vazio – sem necessidade de edição manual.
  const clientDefines = {
    "import.meta.env.VITE_API_URL": JSON.stringify(apiBaseUrl),
    "import.meta.env.VITE_IS_CODESPACES": JSON.stringify(
      String(isCodespaces)
    ),
  };

  // Log de diagnóstico (visível apenas ao iniciar o servidor)
  if (!isTest) {
    console.log(
      `\n  🌐 Ambiente: ${isCodespaces ? "GitHub Codespaces" : "Local"}` +
        `\n  📡 API target: ${apiBaseUrl}` +
        `\n  🚀 Dev port:   ${devPort}\n`
    );
  }

  return {
    // ─── Servidor de desenvolvimento ───────────────────────────────────────
    server: {
      // 0.0.0.0 é obrigatório em containers (Codespaces, Docker, devcontainers)
      host: "0.0.0.0",
      port: devPort,
      strictPort: false,
      allowedHosts,
      hmr: hmrConfig,
      proxy: {
        // Redireciona /api/* para o backend, evitando problemas de CORS em dev
        "/api": {
          target: apiProxyTarget,
          changeOrigin: true,
          secure: apiProxyTarget.startsWith("https"),
        },
      },
    },

    // ─── Servidor de preview (vite preview) ────────────────────────────────
    preview: {
      host: "0.0.0.0",
      port: previewPort,
      strictPort: false,
      allowedHosts,
      proxy: {
        "/api": {
          target: apiProxyTarget,
          changeOrigin: true,
          secure: apiProxyTarget.startsWith("https"),
        },
      },
    },

    // ─── Define: variáveis disponíveis em import.meta.env ──────────────────
    define: clientDefines,

    // ─── Plugins ───────────────────────────────────────────────────────────
    plugins: [
      react(),
      mode === "development" && componentTagger(),
    ].filter(Boolean),

    // ─── Aliases de importação ─────────────────────────────────────────────
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },

    test: {
      environment: "jsdom",
      setupFiles: "./src/test/setup.js",
      css: true,
      clearMocks: true,
      restoreMocks: true,
    },
  };
});
