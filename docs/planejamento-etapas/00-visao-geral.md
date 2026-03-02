# Planejamento de páginas e implementações faltantes (front-end x back-end)

## 1) Diagnóstico da cobertura atual

Atualmente o front-end possui somente três rotas públicas:

- `/` (homepage)
- `/login`
- `/cadastro`

Já o back-end possui recursos de produto para o fluxo completo de gestão (perfil, planos, listas, cartões, tarefas e eventos), com endpoints de consulta e manutenção.

**Conclusão:** existem endpoints disponíveis sem páginas equivalentes no front-end. Este documento define o planejamento para fechar esse gap com foco técnico + definição visual de interface.

---

## 2) Endpoints existentes sem cobertura de páginas no front-end

### 2.1 Perfil

- `GET /api/v1/perfil`
- `GET /api/v1/perfil/{id}`
- `PUT /api/v1/perfil/{id}`
- `DELETE /api/v1/perfil/{id}`
- `POST /api/v1/perfil/login`

### 2.2 Planos

- `GET /api/v1/planos/perfil/{perfilId}`
- `GET /api/v1/planos/perfil/{perfilId}/{id}`
- `POST /api/v1/planos/perfil/{perfilId}`
- `PUT /api/v1/planos/perfil/{perfilId}/{id}`
- `DELETE /api/v1/planos/perfil/{perfilId}/{id}`

### 2.3 Listas (por plano)

- `GET /api/v1/listas/perfil/{perfilId}/plano/{planoId}`
- `GET /api/v1/listas/perfil/{perfilId}/{id}`
- `POST /api/v1/listas/perfil/{perfilId}/plano/{planoId}`
- `PUT /api/v1/listas/perfil/{perfilId}/{id}`
- `DELETE /api/v1/listas/perfil/{perfilId}/{id}`

### 2.4 Cartões

- `GET /api/v1/cartoes/perfil/{perfilId}/lista/{listaId}`
- `GET /api/v1/cartoes/perfil/{perfilId}/{id}`
- `DELETE /api/v1/cartoes/perfil/{perfilId}/{id}`

### 2.5 Tarefas

- `GET /api/v1/tarefas/perfil/{perfilId}/lista/{listaId}`
- `GET /api/v1/tarefas/perfil/{perfilId}/{id}`
- `POST /api/v1/tarefas/perfil/{perfilId}/lista/{listaId}`
- `PUT /api/v1/tarefas/perfil/{perfilId}/{id}`
- `DELETE /api/v1/tarefas/perfil/{perfilId}/{id}`

### 2.6 Eventos

- `GET /api/v1/eventos/perfil/{perfilId}/lista/{listaId}`
- `GET /api/v1/eventos/perfil/{perfilId}/{id}`
- `POST /api/v1/eventos/perfil/{perfilId}/lista/{listaId}`
- `PUT /api/v1/eventos/perfil/{perfilId}/{id}`
- `DELETE /api/v1/eventos/perfil/{perfilId}/{id}`

---

## 3) Diretriz visual obrigatória (base para as novas páginas)

As novas telas devem seguir a referência de **Layout de Interface Web Inspirado no Trello** e, ao mesmo tempo, manter o padrão já aplicado no front-end atual (tipografia, escala de espaçamentos, botões, campos, estados, contraste e identidade visual).

> Regra mandatória: **não criar linguagem visual paralela**. Evoluir em cima do padrão existente com os comportamentos e composição visual abaixo.

### 3.1 Dashboard Principal (Home do Usuário)

**Objetivo da página:** ser o hub do usuário para visualizar planos, criar novos planos e navegar entre projetos.

**Estrutura macro:**

1. Cabeçalho global (fixo)
2. Barra secundária (filtros e contexto)
3. Grid de planos responsivo

**Wireframe estrutural:**

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

**Cabeçalho global:**

- **Esquerda:** logo, botão Home/Dashboard, Workspaces.
- **Centro:** busca global.
- **Direita:** Criar (+), notificações, ajuda, avatar.

**Comportamentos UX:**

- Header fixo.
- Campo de busca expansível.
- Menu dropdown no avatar.

**Barra secundária:**

- Título da área.
- Tabs: Recentes, Favoritos, Compartilhados, Arquivados.
- Filtros e ordenação.

**Grid de planos (responsivo):**

- Desktop: 4–6 colunas.
- Tablet: 2–3 colunas.
- Mobile: 1 coluna.

**Card de plano:**

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

Elementos obrigatórios do card:

- Background visual (wallpaper/capa).
- Nome do plano.
- Indicadores (membros/favorito).
- Ações rápidas em hover.

CTA obrigatório:

- `[ + Criar novo plano ]`

### 3.2 Página do Plano (Board View)

**Estrutura macro:**

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

**Header do plano:**

- **Esquerda:** nome editável, favoritar, workspace.
- **Centro:** avatares de membros e botão convidar.
- **Direita:** filtros, automations, integrações, menu do plano.

**Listas horizontais:**

- Scroll horizontal da página/board.
- Cada lista como coluna independente.

**Estrutura de lista:**

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

Componentes:

- Header da lista.
- Área de cartões.
- Botão “adicionar cartão”.

### 3.3 Cartões e Modal

**Card visual:**

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

Elementos mínimos:

- Título.
- Etiquetas.
- Checklist.
- Comentários.
- Anexos.
- Data limite.
- Membros atribuídos.

**Interações obrigatórias:**

- Drag and drop.
- Clique no cartão abre modal de detalhes.

**Modal do cartão:**

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

Seções mínimas do modal:

- Descrição.
- Checklist.
- Comentários.
- Anexos.
- Atividade.

### 3.4 Comportamento de scroll e hierarquia visual

**Scroll behavior:**

- Página (board): scroll horizontal.
- Lista: scroll vertical.
- Cartões: drag livre entre listas.

**Hierarquia visual:**

1. Plano
2. Lista
3. Cartão
4. Detalhes do cartão

**Princípios UX que devem guiar implementação:**

- Baixa fricção.
- Interface espacial.
- Interação direta.
- Feedback constante.

---

## 4) Planejamento de páginas e implementação (ordem sugerida)

## Fase 1 — Base autenticada e infraestrutura

### Estrutura: Layout autenticado + proteção de rotas

**Entregas técnicas:**

1. Criar `AuthenticatedLayout` com Header Global + área de conteúdo.
2. Implementar `PrivateRoute` para todo `/app/*`.
3. Definir rotas iniciais:
   - `/app/planos` (dashboard de planos)
   - `/app/planos/:planoId` (board)
   - `/app/listas/:listaId` (foco da lista / detalhe operacional)
   - `/app/perfil`
4. Criar `apiClient` com configuração centralizada de erros.

**Entregas visuais:**

- Header fixo com composição esquerda/centro/direita conforme seção 3.
- Busca global expansível.
- Comportamentos de dropdown consistentes.

---

## Fase 2 — Dashboard principal / Meus Planos (`/app/planos`)

**Objetivo funcional:** listar, criar, editar e excluir planos.

**Endpoints:**

- `GET /api/v1/planos/perfil/{perfilId}`
- `POST /api/v1/planos/perfil/{perfilId}`
- `PUT /api/v1/planos/perfil/{perfilId}/{id}`
- `DELETE /api/v1/planos/perfil/{perfilId}/{id}`

**Escopo visual obrigatório:**

- Cabeçalho global fixo.
- Barra secundária com tabs e filtros.
- Grid responsivo de cards de plano.
- Card com capa, nome, membros/favorito e ações de hover.
- Card “Criar novo plano” em destaque.

**Escopo de UX:**

- Estados de loading/skeleton.
- Estado vazio com CTA principal.
- Confirmação de exclusão.
- Feedback (sucesso/erro) em padrão único.

---

## Fase 3 — Página do Plano / Board (`/app/planos/:planoId`)

**Objetivo funcional:** listar e gerir listas do plano e preparar fluxo operacional de cartões.

**Endpoints:**

- `GET /api/v1/listas/perfil/{perfilId}/plano/{planoId}`
- `POST /api/v1/listas/perfil/{perfilId}/plano/{planoId}`
- `PUT /api/v1/listas/perfil/{perfilId}/{id}`
- `DELETE /api/v1/listas/perfil/{perfilId}/{id}`

**Escopo visual obrigatório:**

- Header do plano com nome editável/favorito/workspace.
- Área central com membros e convite.
- Área de ações à direita (filtros/automations/integrações/menu).
- Colunas horizontais de listas com scroll do board.
- Coluna “+ Nova lista”.

**Escopo de UX:**

- Criação de lista inline.
- Edição de nome/cor com feedback imediato.
- Exclusão com confirmação.

---

## Fase 4 — Cartões, tarefas e eventos (board + detalhe)

### 4.1 Visão do board (cartões na lista)

**Objetivo funcional:** exibir cartões por lista e permitir movimentação/edição.

**Endpoints de base:**

- `GET /api/v1/cartoes/perfil/{perfilId}/lista/{listaId}`
- `GET /api/v1/cartoes/perfil/{perfilId}/{id}`
- `DELETE /api/v1/cartoes/perfil/{perfilId}/{id}`

**Escopo visual obrigatório:**

- Cartões com label/título/ícones/metadados.
- Ação “+ Adicionar” no rodapé de cada lista.
- Drag and drop entre listas.

### 4.2 Formulários por tipo (tarefa e evento)

**Endpoints de tarefas:**

- `GET /api/v1/tarefas/perfil/{perfilId}/lista/{listaId}`
- `GET /api/v1/tarefas/perfil/{perfilId}/{id}`
- `POST /api/v1/tarefas/perfil/{perfilId}/lista/{listaId}`
- `PUT /api/v1/tarefas/perfil/{perfilId}/{id}`
- `DELETE /api/v1/tarefas/perfil/{perfilId}/{id}`

**Endpoints de eventos:**

- `GET /api/v1/eventos/perfil/{perfilId}/lista/{listaId}`
- `GET /api/v1/eventos/perfil/{perfilId}/{id}`
- `POST /api/v1/eventos/perfil/{perfilId}/lista/{listaId}`
- `PUT /api/v1/eventos/perfil/{perfilId}/{id}`
- `DELETE /api/v1/eventos/perfil/{perfilId}/{id}`

**Escopo de modal obrigatório:**

- Área principal: descrição/checklist/comentários.
- Sidebar: ações rápidas e metadados.
- Campos condicionais:
  - Tarefa: data de conclusão.
  - Evento: início e fim.

---

## Fase 5 — Página de Perfil (`/app/perfil`)

**Objetivo funcional:** manutenção cadastral e ciclo de vida da conta.

**Endpoints:**

- `GET /api/v1/perfil/{id}`
- `PUT /api/v1/perfil/{id}`
- `DELETE /api/v1/perfil/{id}`

**Escopo visual/UX:**

- Formulário claro e acessível.
- Separação visual de ações comuns e ações destrutivas.
- Confirmação forte para inativação/exclusão.

---

## 5) Implementações transversais obrigatórias

1. **Autenticação e sessão**
   - Integrar login com `POST /api/v1/perfil/login`.
   - Persistir sessão e injetar `perfilId` nas chamadas.

2. **Camada de serviços por domínio**
   - `perfilService`, `planoService`, `listaService`, `cartaoService`, `tarefaService`, `eventoService`.

3. **Estados de interface padronizados**
   - `loading`, `empty`, `error`, `success` em todas as páginas.

4. **Tratamento de erro padronizado**
   - Mensagens amigáveis para `400`, `401`, `404`, `409`, `500`.

5. **Acessibilidade**
   - Foco visível, labels, hierarquia semântica, teclado, contraste.

6. **Consistência visual**
   - Todas as páginas devem seguir o padrão de design já aplicado no front-end.
   - Reuso de componentes, tokens e padrões já existentes.

---

## 6) Roadmap de execução (sprints sugeridas)

### Sprint 1

- Base autenticada, `apiClient`, sessão, layout global, rotas privadas.

### Sprint 2

- Dashboard principal de planos com grid responsivo e CRUD completo.

### Sprint 3

- Página do plano (board) com listas horizontais, CRUD de listas e header do plano.

### Sprint 4

- Cartões com drag and drop + modal detalhado + integrações de tarefas/eventos.

### Sprint 5

- Perfil, polimento de UX, acessibilidade e padronização final de feedbacks.

---

## 7) Critérios de aceite

- Todos os recursos de API existentes devem possuir fluxo navegável no front-end.
- Jornada completa disponível: **Planos → Listas → Cartões → Detalhes**.
- A interface final deve respeitar os princípios: baixa fricção, interação direta e feedback constante.
- Todas as novas páginas devem seguir a referência visual inspirada no Trello e o padrão de design já aplicado no produto.

---

## 8) Resultado esperado

Ao final, o front-end passa de uma camada institucional para uma aplicação operacional completa, cobrindo os endpoints já existentes no back-end com páginas funcionais, consistentes e visualmente alinhadas ao padrão da plataforma.
