import axios from 'axios';

// Base URL dinâmica para Codespaces ou variável de ambiente
function getDynamicApiUrl() {
  // 1. Se VITE_API_URL estiver definida, use-a
  if (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim() !== '') {
    return import.meta.env.VITE_API_URL.replace(/\/$/, '');
  }
  // 2. Detecta se está rodando em Codespaces
  const host = window?.location?.host;
  // Exemplo de host: cuddly-pancake-pjw77pj79vr5f559-3000.app.github.dev
  if (host && host.endsWith('.app.github.dev')) {
    // Substitui a porta do frontend (ex: 3000) por 8080
    const apiHost = host.replace(/-(\d+)\.app\.github\.dev$/, '-8080.app.github.dev');
    return `https://${apiHost}/api/v1`;
  }
  // 3. Fallback para localhost
  return 'http://localhost:8080/api/v1';
}

const baseURL = getDynamicApiUrl();

// Configuração base do Axios
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor para requisições (opcional - pode adicionar tokens de autenticação aqui)
api.interceptors.request.use(
  (config) => {
    // Você pode adicionar tokens de autenticação aqui se necessário
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para respostas (opcional - tratamento global de erros)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Tratamento global de erros
    if (error.response) {
      // O servidor respondeu com um status code fora do range 2xx
      console.error('Erro na resposta:', error.response.data);
      console.error('Status:', error.response.status);
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      console.error('Erro na requisição:', error.request);
    } else {
      // Algo aconteceu ao configurar a requisição
      console.error('Erro:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
