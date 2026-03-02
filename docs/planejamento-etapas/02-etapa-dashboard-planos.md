# Etapa 2 — Dashboard principal / Meus Planos

## Objetivo da etapa

Entregar a home operacional do usuário para visualizar e gerenciar planos.

## Dependências da etapa anterior

- Área autenticada funcional (`/app/*`).
- `apiClient` e sessão com `perfilId` disponíveis.
- Cabeçalho global fixo implementado na etapa 1.

## Escopo funcional

CRUD completo de planos:

- listar planos;
- criar plano;
- editar plano;
- excluir plano.

## Endpoints desta etapa

- `GET /api/v1/planos/perfil/{perfilId}`
- `POST /api/v1/planos/perfil/{perfilId}`
- `PUT /api/v1/planos/perfil/{perfilId}/{id}`
- `DELETE /api/v1/planos/perfil/{perfilId}/{id}`

## Estrutura visual detalhada da página (obrigatória)

### Estrutura geral do Dashboard

```text
┌──────────────────────────────────────────────┐
│ Cabeçalho Global                             │
├──────────────────────────────────────────────┤
│ Barra secundária / filtros                   │
├──────────────────────────────────────────────┤
│ Grid de Planos                               │
│                                              │
│  [Plano] [Plano] [Plano] [Novo +]            │
│  [Plano] [Plano] [Plano]                     │
│                                              │
└──────────────────────────────────────────────┘
```

### Cabeçalho Global (reuso da etapa 1)

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

### Barra Secundária

Elementos obrigatórios:
- Título da área
- Tabs (Recentes, Favoritos, Compartilhados, Arquivados)
- Filtros
- Ordenação

### Grid de Planos

Layout responsivo obrigatório:
- Desktop: 4–6 colunas
- Tablet: 2–3 colunas
- Mobile: 1 coluna

### Card de Plano

```text
┌─────────────────────┐
│ Background visual   │
│                     │
│ Nome do Plano       │
│                     │
│ 👥 membros          │
│ ⭐ Favorito          │
└─────────────────────┘
```

Elementos mínimos:
- Background visual
- Nome do plano
- Indicadores
- Ações rápidas (hover)

### Criar Novo Plano

```text
[ + Criar novo plano ]
```

## UX e comportamento

- Skeleton/loading na primeira carga.
- Estado vazio com CTA principal.
- Feedback de sucesso/erro padronizado.
- Confirmação para exclusão.

## Critérios de pronto da etapa

- Usuário autenticado consegue gerir planos ponta a ponta.
- Página está responsiva e consistente visualmente com design já aplicado.
- Navegação para `/app/planos/:planoId` disponível a partir de cada card.
