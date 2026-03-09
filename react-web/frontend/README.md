# Plan Things — Frontend

Frontend React da aplicação Plan Things para gerenciamento de projetos de pequenas equipes.

## Tecnologias

- [React](https://react.dev/) com [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [React Router](https://reactrouter.com/)
- [Axios](https://axios-http.com/)
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)

## Pré-requisitos

- Node.js 18+ e npm

## Como rodar

```bash
npm install
npm run dev
```

O servidor de desenvolvimento inicia na porta `5173`.

## Variáveis de ambiente

A resolução da URL do backend é feita automaticamente por [`vite.config.js`](vite.config.js):

- Em localhost, usa `http://localhost:8080/api/v1` como fallback.
- Em GitHub Codespaces, o target é detectado automaticamente via variável de ambiente.

Caso precise sobrescrever, defina `VITE_API_URL` antes de rodar o servidor.

## Proxy no Vite (Desenvolvimento)

O Vite possui proxy configurado em [`vite.config.js`](vite.config.js):

- Todas as requisições para `/api` são encaminhadas automaticamente ao backend.
- O target é derivado de `VITE_API_URL` ou `http://localhost:8080` como fallback.

Isso permite chamadas relativas como `/api/v1/perfil` sem lidar com CORS durante o desenvolvimento.

## Estrutura principal

```
src/
  components/    # Componentes reutilizáveis (PrivateRoute, layouts)
  contexts/      # Contextos globais (AuthContext, ThemeContext)
  features/      # Funcionalidades por domínio
    auth/        # Login, cadastro e layout de autenticação
    homepage/    # Página pública inicial
    perfil/      # Gerenciamento de perfil do usuário
    planos/      # Board de planos, listas e cartões
  lib/           # Utilitários (apiClient.js)
```
