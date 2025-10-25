import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega as variáveis de ambiente do .env
  const env = loadEnv(mode, process.cwd(), '');

  // Extrai a URL base da variável de ambiente
  // Ex: de "https://...-8080.app.github.dev/api/v1" para "https://...-8080.app.github.dev"
  const apiTarget = env.VITE_API_URL ? new URL(env.VITE_API_URL).origin : 'http://localhost:8080';

  return {
    server: {
      host: "::",
      port: 5173,
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }
});
