/**
 * apiClient.js — cliente HTTP centralizado da aplicação
 *
 * A baseURL é resolvida automaticamente pelo vite.config.js:
 *   - GitHub Codespaces → URL pública gerada a partir das variáveis de ambiente do Codespace
 *   - Desenvolvimento local → http://localhost:8080/api/v1
 *   - .env explícito → valor de VITE_API_URL (prioridade máxima)
 *
 * Em desenvolvimento (vite dev), todas as requisições /api/* também passam
 * pelo proxy do Vite — útil como fallback caso o CORS do backend não esteja
 * configurado para aceitar a origem do frontend.
 */

import axios from "axios";

// import.meta.env.VITE_API_URL é sempre injetado pelo vite.config.js via `define`,
// garantindo o valor correto independentemente do que estiver no .env.
const BASE_URL = import.meta.env.VITE_API_URL || "/api/v1";

const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // envia cookies de sessão/autenticação automaticamente
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15_000, // 15 s — evita requisições penduradas
});

// ─── Interceptor de requisição ────────────────────────────────────────────────
// Anexa o Bearer token (se existir) em todos os requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Interceptor de resposta ──────────────────────────────────────────────────
// Trata erros HTTP globalmente
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Sessão expirada ou inválida — limpa o estado e redireciona para login
      localStorage.removeItem("authToken");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    // Repassa o erro para o chamador tratar conforme o contexto
    return Promise.reject(error);
  }
);

export default apiClient;
