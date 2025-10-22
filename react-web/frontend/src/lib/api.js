import axios from 'axios';

// Base URL definida via variável de ambiente (Opção B)
// Em ambientes como Codespaces/GitHub dev, defina VITE_API_URL para o domínio público da porta 8080
// Ex.: https://SEU-CODENAME-8080.app.github.dev
const baseURL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

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
