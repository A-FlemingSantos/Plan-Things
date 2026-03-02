# Etapa 4 — Cartões, tarefas e eventos

## Objetivo da etapa

Implementar o núcleo operacional do board: cartões, drag-and-drop, modal detalhado e formulários por tipo (tarefa/evento).

## Dependências

- Etapa 3 concluída (board e listas funcionais).
- Camada de serviços e tratamento de erro padronizados.

## Escopo funcional

### 1) Visão agregada de cartões por lista

- listar cartões da lista;
- abrir detalhes de cartão;
- excluir cartão.

Endpoints:

- `GET /api/v1/cartoes/perfil/{perfilId}/lista/{listaId}`
- `GET /api/v1/cartoes/perfil/{perfilId}/{id}`
- `DELETE /api/v1/cartoes/perfil/{perfilId}/{id}`

### 2) Fluxos de tarefas

- listar por lista;
- criar;
- editar;
- excluir.

Endpoints:

- `GET /api/v1/tarefas/perfil/{perfilId}/lista/{listaId}`
- `GET /api/v1/tarefas/perfil/{perfilId}/{id}`
- `POST /api/v1/tarefas/perfil/{perfilId}/lista/{listaId}`
- `PUT /api/v1/tarefas/perfil/{perfilId}/{id}`
- `DELETE /api/v1/tarefas/perfil/{perfilId}/{id}`

### 3) Fluxos de eventos

- listar por lista;
- criar;
- editar;
- excluir.

Endpoints:

- `GET /api/v1/eventos/perfil/{perfilId}/lista/{listaId}`
- `GET /api/v1/eventos/perfil/{perfilId}/{id}`
- `POST /api/v1/eventos/perfil/{perfilId}/lista/{listaId}`
- `PUT /api/v1/eventos/perfil/{perfilId}/{id}`
- `DELETE /api/v1/eventos/perfil/{perfilId}/{id}`

## Estrutura visual detalhada de cartões e detalhes (obrigatória)

### Cartões

```text
┌──────────────────┐
│ Label Colorida   │
│                  │
│ Título do Card   │
│                  │
│ 📎 💬 ✔          │
│ 👤 👤            │
└──────────────────┘
```

Elementos:
- Título
- Etiquetas
- Checklist
- Comentários
- Anexos
- Data limite
- Membros atribuídos

### Interações

- Drag and Drop
- Clique abre modal

### Modal do Cartão

```text
┌──────────────────────────┐
│ Conteúdo principal        │
│ descrição                │
│ checklist                │
│ comentários              │
├───────────────┬──────────┤
│ ações rápidas │ sidebar   │
└───────────────┴──────────┘
```

Contém:
- Descrição
- Checklist
- Comentários
- Anexos
- Atividade

### Scroll Behavior

- Página → scroll horizontal
- Lista → scroll vertical
- Cartões → drag livre

## Regras de formulário por tipo

- **Tarefa**: exige campo de data de conclusão.
- **Evento**: exige início e fim.
- Validar e exibir mensagens de erro de forma contextual.

## Informações transversais importantes para esta etapa

### Hierarquia Visual

1. Plano
2. Lista
3. Cartão
4. Detalhes do cartão

### Princípios UX

- Baixa fricção
- Interface espacial
- Interação direta
- Feedback constante

## Critérios de pronto da etapa

- Usuário manipula cartões de forma fluida no board.
- Modal centraliza detalhes e ações sem perda de contexto.
- Tarefa e evento funcionam com validações e feedback padronizados.
