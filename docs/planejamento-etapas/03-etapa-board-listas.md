# Etapa 3 — Página do Plano (Board) e Listas

## Objetivo da etapa

Entregar o board do plano com gestão completa de listas e estrutura de colunas horizontais.

## Dependências

- Etapa 1 (infra autenticada).
- Etapa 2 (dashboard e navegação por plano).

## Escopo funcional

CRUD de listas dentro de um plano:

- listar listas do plano;
- criar lista;
- editar lista;
- excluir lista.

## Endpoints desta etapa

- `GET /api/v1/listas/perfil/{perfilId}/plano/{planoId}`
- `POST /api/v1/listas/perfil/{perfilId}/plano/{planoId}`
- `PUT /api/v1/listas/perfil/{perfilId}/{id}`
- `DELETE /api/v1/listas/perfil/{perfilId}/{id}`

## Estrutura visual detalhada da página (obrigatória)

### Estrutura geral do Board

```text
┌──────────────────────────────────────────────┐
│ Header Global                                │
├──────────────────────────────────────────────┤
│ Header do Plano                              │
├──────────────────────────────────────────────┤
│ Lista   Lista   Lista   + Nova Lista         │
│ │       │       │                            │
│ │Card   │Card   │Card                        │
│ │Card   │Card   │                            │
└──────────────────────────────────────────────┘
```

### Header do Plano

**Esquerda**
- Nome do plano editável
- Favoritar
- Workspace

**Centro**
- Avatares dos membros
- Botão convidar

**Direita**
- Filtros
- Automations
- Integrações
- Menu do plano

### Listas Horizontais

- Scroll horizontal
- Cada lista é uma coluna independente

### Estrutura da Lista

```text
┌───────────────┐
│ Nome da Lista │
├───────────────┤
│ Cartão        │
│ Cartão        │
│ Cartão        │
│               │
│ + Adicionar   │
└───────────────┘
```

Componentes obrigatórios:
- Header da lista
- Área de cartões
- Botão adicionar cartão

## UX e interação

- Criação/edição rápida de lista (inline/modal leve).
- Confirmação de exclusão.
- Persistência do contexto do plano (nome/identidade visual).

## Informações transversais importantes para esta etapa

- Hierarquia visual deve ficar explícita: Plano > Lista > Cartão > Detalhes.
- Scroll behavior já deve respeitar o padrão: board horizontal, listas verticais.
- Feedback constante para ações de CRUD (loading/sucesso/erro).

## Critérios de pronto da etapa

- Usuário cria e organiza listas no board sem sair da página.
- Estrutura visual do board pronta para receber cartões da etapa 4.
- Experiência mantém consistência com o padrão visual existente.
