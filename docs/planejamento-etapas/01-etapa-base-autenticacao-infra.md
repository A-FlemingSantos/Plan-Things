# Etapa 1 — Base autenticada e infraestrutura

## Objetivo da etapa

Criar a fundação técnica e visual da área logada para suportar as próximas etapas sem retrabalho.

## Contexto funcional (por que essa etapa existe)

Hoje o front-end está restrito a rotas públicas (`/`, `/login`, `/cadastro`), enquanto o back-end já expõe recursos de produto para perfil, planos, listas, cartões, tarefas e eventos.

Sem esta etapa, as próximas páginas não terão:

- proteção de acesso;
- contexto de sessão (`perfilId`);
- padrão único de integração HTTP e tratamento de erros;
- base visual de navegação global.

## Escopo técnico obrigatório

1. `AuthenticatedLayout` para `/app/*`.
2. `PrivateRoute` com redirecionamento para `/login` sem sessão válida.
3. Definição inicial de rotas:
   - `/app/planos`
   - `/app/planos/:planoId`
   - `/app/listas/:listaId`
   - `/app/perfil`
4. `apiClient` central com:
   - URL base da API;
   - normalização de erros;
   - integração com sessão/logoff.
5. Sessão:
   - login real via `POST /api/v1/perfil/login`;
   - armazenamento de dados mínimos;
   - propagação de `perfilId` para serviços.

## Estrutura visual base obrigatória (aplicada em todas as próximas páginas)

### Shell global da aplicação

```text
┌──────────────────────────────────────────────┐
│ Cabeçalho Global                             │
├──────────────────────────────────────────────┤
│ Barra secundária / contexto da página        │
├──────────────────────────────────────────────┤
│ Conteúdo da rota ativa                       │
└──────────────────────────────────────────────┘
```

### Cabeçalho Global (requisito de implementação)

**Esquerda**
- Logo do sistema
- Botão Home / Dashboard
- Workspaces

**Centro**
- Campo de busca global

**Direita**
- Botão Criar (+)
- Notificações
- Ajuda
- Avatar do usuário

**Comportamento UX**
- Header fixo
- Busca expansível
- Menu dropdown do usuário

> Esta estrutura visual é dependência obrigatória das etapas 2, 3, 4 e 5.

## Endpoints relevantes desta etapa

- `POST /api/v1/perfil/login`

## Requisitos transversais que já devem entrar aqui

- Estados de tela padronizados (`loading`, `empty`, `error`, `success`).
- Tratamento amigável para `400`, `401`, `404`, `409`, `500`.
- Acessibilidade mínima: foco visível, labels e navegação por teclado.

## Critérios de pronto da etapa

- Usuário autentica e entra na área `/app/*`.
- Rotas privadas bloqueiam acesso sem sessão.
- Estrutura global (layout + navegação) reutilizável pelas próximas etapas.
- Erros de autenticação e API tratados de forma consistente.
