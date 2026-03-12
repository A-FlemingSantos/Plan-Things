/**
 * apiClient.js — cliente HTTP centralizado da aplicacao
 *
 * A baseURL e resolvida automaticamente pelo vite.config.js:
 *   - GitHub Codespaces → URL publica gerada a partir das variaveis de ambiente do Codespace
 *   - Desenvolvimento local → http://localhost:8080/api/v1
 *   - .env explicito → valor de VITE_API_URL (prioridade maxima)
 *
 * As rotas protegidas agora usam sessao HTTP do backend.
 * Por isso, o cliente envia cookies automaticamente com `withCredentials: true`
 * e a aplicacao deve preferir a base `/api/v1` proxied pelo Vite.
 *
 * Em desenvolvimento (vite dev), todas as requisicoes /api/* tambem passam
 * pelo proxy do Vite — util como fallback caso o CORS do backend nao esteja
 * configurado para aceitar a origem do frontend.
 */

import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "/api/v1";

const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15_000,
});

// ─── Mensagens de erro amigaveis por status HTTP ────────────────────────────
const ERROR_MESSAGES = {
  400: "Dados inválidos. Verifique os campos e tente novamente.",
  401: "Credenciais inválidas ou sessão expirada.",
  403: "Você não tem permissão para realizar esta ação.",
  404: "Recurso não encontrado.",
  409: "Conflito — este recurso já existe ou está em uso.",
  422: "Os dados enviados não puderam ser processados.",
  500: "Erro interno do servidor. Tente novamente mais tarde.",
};

/**
 * Normaliza erros HTTP em um formato previsivel para os componentes.
 */
export function normalizeError(error) {
  if (!error.response) {
    return {
      status: null,
      message: "Sem conexão com o servidor. Verifique sua internet.",
      field: null,
      raw: error,
    };
  }

  const { status, data } = error.response;
  const serverMessage = data?.message || data?.error;

  return {
    status,
    message: serverMessage || ERROR_MESSAGES[status] || `Erro inesperado (${status}).`,
    field: data?.field || null,
    raw: data,
  };
}

// ─── Interceptor de resposta ──────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem("planthings_session");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
