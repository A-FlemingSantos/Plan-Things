# Plan Things — Frontend

Frontend React da aplicação Plan Things para gerenciamento de projetos de pequenas equipes.

## Tecnologias

- [React](https://react.dev/) com [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [React Router](https://reactrouter.com/)
- [TanStack Query](https://tanstack.com/query)
- [Axios](https://axios-http.com/)

## Pré-requisitos

- Node.js 18+ e npm

## Como rodar

```bash
npm install
npm run dev
```

O servidor de desenvolvimento inicia na porta `5173`.

## Variáveis de ambiente

Copie o modelo e ajuste conforme necessário:

```bash
cp .env.example .env
```

| Variável | Descrição |
|----------|-----------|
| `VITE_API_URL` | URL base da API do backend (ex: `http://localhost:8080/api/v1`) |

Veja detalhes de resolução dinâmica em [`src/lib/api.js`](src/lib/api.js).

## Proxy no Vite (Desenvolvimento)

O Vite possui proxy configurado em [`vite.config.js`](vite.config.js):

- Todas as requisições para `/api` são encaminhadas automaticamente ao backend.
- O target é derivado de `VITE_API_URL` ou `http://localhost:8080` como fallback.

Isso permite chamadas relativas como `/api/v1/perfil` sem lidar com CORS durante o desenvolvimento.

## Estrutura principal

```
src/
  components/   # Componentes reutilizáveis (UI, seções)
  pages/        # Páginas da aplicação (Login, Register, Dashboard, Profile)
  lib/          # Utilitários (api client, helpers)
  hooks/        # Custom hooks
  assets/       # Imagens e recursos estáticos
```
