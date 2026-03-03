# Notas de Progresso — Plan Things (Front-End)

## Etapa 1 — Base autenticada e infraestrutura

### Status: Concluida

### Observacoes gerais

- Back-end usa autenticacao stateless (sem JWT, sem sessao server-side)
- `POST /api/v1/perfil/login` retorna dados do usuario (id, email, nome, sobrenome, telefone)
- Nao ha token no response — sessao gerenciada client-side via `localStorage` (chave: `planthings_session`)
- `apiClient.js` atualizado: removido Bearer token (backend nao usa), adicionada normalizacao de erros com `normalizeError()`
- Front-end usa React 18 + Vite + Tailwind CSS com design glass-morphism
- Dependencias ja instaladas e utilizadas: react-hook-form, zod, axios, lucide-react

### Decisoes tecnicas

- **Sessao client-side**: Dados do usuario (id, email, nome, sobrenome, telefone) persistidos em `localStorage` sob a chave `planthings_session`. O `AuthContext` expoe `user`, `perfilId`, `isAuthenticated`, `login()` e `logout()`.
- **Interceptor 401**: O `apiClient` limpa a sessao e redireciona para `/login` ao receber HTTP 401.
- **Validacao de formulario**: Login usa `react-hook-form` + `zod` com regras alinhadas ao backend (email obrigatorio/valido, senha min 6 chars).
- **Rotas aninhadas**: `/app` usa `PrivateRoute` > `AuthenticatedLayout` (com `<Outlet />`), permitindo que cada sub-rota renderize dentro do shell global.
- **Header global**: Estrutura completa com logo, home, busca global, criar (+), notificacoes, ajuda, tema claro/escuro, avatar com dropdown (perfil + sair).

### Arquivos criados/modificados

| Arquivo | Acao |
|---------|------|
| `src/contexts/AuthContext.jsx` | Criado — contexto de autenticacao |
| `src/lib/apiClient.js` | Modificado — removido Bearer, adicionada `normalizeError()` |
| `src/features/auth/LoginPage.jsx` | Modificado — integrado com API, validacao com zod, estados loading/error |
| `src/components/PrivateRoute.jsx` | Criado — protecao de rotas com redirect |
| `src/components/layout/AuthenticatedLayout.jsx` | Criado — shell global com header Trello-inspired |
| `src/components/layout/styles/authenticated-layout.css` | Criado — estilos do header e dropdown |
| `src/features/planos/PlanosPage.jsx` | Criado — placeholder dashboard de planos |
| `src/features/planos/PlanoBoardPage.jsx` | Criado — placeholder board do plano |
| `src/features/planos/ListaPage.jsx` | Criado — placeholder detalhe de lista |
| `src/features/perfil/PerfilPage.jsx` | Criado — placeholder pagina de perfil |
| `src/App.jsx` | Modificado — adicionadas rotas privadas com layout autenticado |

### Checklist de tarefas

- [x] Criar arquivo `notas-de-progresso.md`
- [x] Criar `AuthContext` para gerenciamento de sessao
- [x] Atualizar `apiClient.js` com normalizacao de erros e integracao com sessao
- [x] Integrar `LoginPage` com API (`POST /api/v1/perfil/login`)
- [x] Criar componente `PrivateRoute`
- [x] Criar `AuthenticatedLayout` com Header Global (logo, busca, avatar, etc.)
- [x] Criar paginas placeholder para `/app/planos`, `/app/planos/:planoId`, `/app/listas/:listaId`, `/app/perfil`
- [x] Atualizar `App.jsx` com todas as novas rotas
- [x] Build de producao (`npm run build`) executado com sucesso

---

## Etapa 2 — Dashboard de Planos (CRUD completo)

### Status: Concluida

### Observacoes gerais

- Backend expoe CRUD completo em `/api/v1/planos/perfil/{perfilId}` (GET, POST, PUT, DELETE)
- Entidade `Plano` possui campos: `id`, `nome` (max 50 chars, obrigatorio), `wallpaperUrl` (max 2048 chars, opcional), `perfilId`
- Tabs "Favoritos", "Compartilhados" e "Arquivados" estao presentes na UI mas desabilitados (backend nao suporta esses filtros ainda)
- Botao "Filtrar" tambem desabilitado (funcionalidade futura)
- Ordenacao funcional: "Recentes" (por id desc) e "A-Z" (alfabetica pt-BR)
- Wallpaper do plano usa gradientes CSS como presets (10 opcoes) — armazenados como string CSS em `wallpaperUrl`
- Cards sem wallpaper recebem gradiente automatico baseado no `id % 8`

### Decisoes tecnicas

- **Arquitetura de componentes**: Dashboard dividido em componentes isolados — `PlanoCard`, `PlanoFormModal`, `DeleteConfirmModal`
- **Estados da pagina**: Maquina de estados simples (`loading` | `success` | `error` | `empty`) controlando renderizacao condicional
- **Skeleton loading**: 8 skeletons com animacao `shimmer` e delay escalonado para efeito cascata
- **Toast feedback**: Componente inline com auto-dismiss (3.5s), suporte a tipos `success` e `error`
- **Modais**: Fecham com Escape, click no overlay, e botao X. Focus trap basico (auto-focus no input/botao)
- **Cards navegaveis**: Cada card redireciona para `/app/planos/:planoId` (board do plano, etapa 3)
- **Hover actions**: Botoes de editar/excluir aparecem no hover do card com animacao fade+slide
- **CSS isolado**: Estilos em `planos-page.css` usando nomenclatura BEM-like consistente com `authenticated-layout.css`
- **Validacao inline**: Nome obrigatorio e max 50 chars validado no cliente antes de enviar ao backend
- **Sem dependencias novas**: Nenhuma biblioteca adicional foi instalada

### Endpoints utilizados

| Metodo | Endpoint | Uso |
|--------|----------|-----|
| GET | `/api/v1/planos/perfil/{perfilId}` | Listar todos os planos do usuario |
| POST | `/api/v1/planos/perfil/{perfilId}` | Criar novo plano |
| PUT | `/api/v1/planos/perfil/{perfilId}/{id}` | Editar plano existente |
| DELETE | `/api/v1/planos/perfil/{perfilId}/{id}` | Excluir plano |

### Arquivos criados/modificados

| Arquivo | Acao |
|---------|------|
| `src/features/planos/PlanosPage.jsx` | Reescrito — dashboard completo com CRUD, estados, tabs, grid |
| `src/features/planos/styles/planos-page.css` | Criado — estilos glass-morphism para cards, grid, modais, skeletons, toasts |
| `src/features/planos/components/PlanoCard.jsx` | Criado — card de plano com cover, hover actions, navegacao |
| `src/features/planos/components/PlanoFormModal.jsx` | Criado — modal de criacao/edicao com picker de wallpaper |
| `src/features/planos/components/DeleteConfirmModal.jsx` | Criado — modal de confirmacao de exclusao |

### Checklist de tarefas

- [x] Criar CSS do dashboard (`planos-page.css`) com glass-morphism
- [x] Criar componente `PlanoCard` com cover, nome, hover actions
- [x] Criar componente `PlanoFormModal` para criar/editar planos
- [x] Criar componente `DeleteConfirmModal` para confirmacao de exclusao
- [x] Reescrever `PlanosPage` com integracao API, grid responsivo, tabs, ordenacao
- [x] Implementar estados: loading (skeleton), empty (CTA), error (retry), success (grid)
- [x] Implementar toast de feedback (sucesso/erro)
- [x] Build de producao (`npm run build`) executado com sucesso

---

## Etapa 3 — Board do Plano e CRUD de Listas

### Status: Concluida

### Observacoes gerais

- Backend expoe CRUD de listas em `/api/v1/listas/perfil/{perfilId}/plano/{planoId}` (GET, POST) e `/api/v1/listas/perfil/{perfilId}/{id}` (GET, PUT, DELETE)
- Entidade `Lista` possui campos: `id` (long), `nome` (max 50 chars, obrigatorio), `cor` (hex #RRGGBB, opcional), `planoId` (long)
- Board usa layout horizontal com scroll (estilo Trello) — listas como colunas, cada uma com header, area de cartoes e footer
- Plano header mostra nome do plano com botao de voltar para o dashboard
- Botoes "Filtrar" e menu do plano estao presentes mas desabilitados (funcionalidade futura)
- Criacao de lista feita inline (formulario rapido no final do board) — permite criacao sequencial rapida
- Edicao de nome da lista feita inline (click no nome para editar) com commit on Enter/blur e cancel on Escape
- Edicao completa (nome + cor) disponivel via modal dedicado
- Exclusao com confirmacao via modal
- Listas podem ter cor opcional (barra de acento no topo da coluna) com 10 presets de cores
- Botao "Adicionar cartao" presente nas listas mas desabilitado (preparado para etapa 4)

### Decisoes tecnicas

- **Layout full-height**: Board usa `height: calc(100vh - 48px)` para ocupar todo o viewport abaixo do header global
- **Board header secundario**: Sub-header com botao de voltar, separador, nome do plano, filtros e menu (56px)
- **Scroll horizontal**: `board-canvas` usa `overflow-x: auto` com `flex-shrink: 0` em cada coluna
- **Largura fixa de colunas**: 272px (padrao Trello) com scroll vertical interno nos cartoes
- **Criacao inline**: Formulario minimo (input + botoes) aparece ao clicar "Adicionar outra lista" — sem modal para criacao rapida
- **Edicao inline de nome**: Click no nome da lista transforma em input editavel. Blur/Enter commitam, Escape cancela
- **Modal de edicao completa**: `ListFormModal` permite editar nome + cor via modal com picker de cores
- **Modal de exclusao**: `DeleteListConfirmModal` reutiliza padroes visuais da etapa 2 (overlay blur, botoes, icone warning)
- **Color accent bar**: Cada lista pode ter uma barra colorida de 4px no topo, usando o campo `cor` da entidade
- **Estados de pagina**: Mesma maquina de estados das etapas anteriores (loading/success/error/empty)
- **Skeleton do board**: 3 colunas skeleton com cards placeholder e animacao shimmer escalonada
- **Empty state**: Estado vazio com icone, texto e CTA para criar primeira lista
- **Toast feedback**: Mesmo padrao da etapa 2 — auto-dismiss 3.5s, tipos success/error
- **CSS isolado**: Estilos em `board-page.css` usando nomenclatura BEM-like consistente com etapas anteriores
- **Sem dependencias novas**: Nenhuma biblioteca adicional foi instalada

### Endpoints utilizados

| Metodo | Endpoint | Uso |
|--------|----------|-----|
| GET | `/api/v1/planos/perfil/{perfilId}/{planoId}` | Buscar dados do plano (nome, wallpaper) para o header |
| GET | `/api/v1/listas/perfil/{perfilId}/plano/{planoId}` | Listar todas as listas do plano |
| POST | `/api/v1/listas/perfil/{perfilId}/plano/{planoId}` | Criar nova lista |
| PUT | `/api/v1/listas/perfil/{perfilId}/{id}` | Editar lista existente |
| DELETE | `/api/v1/listas/perfil/{perfilId}/{id}` | Excluir lista |

### Arquivos criados/modificados

| Arquivo | Acao |
|---------|------|
| `src/features/planos/PlanoBoardPage.jsx` | Reescrito — board completo com CRUD de listas, header, estados, inline creation |
| `src/features/planos/styles/board-page.css` | Criado — estilos glass-morphism para board, colunas, inline forms, skeletons, toasts |
| `src/features/planos/components/ListColumn.jsx` | Criado — coluna individual de lista com header editavel, area de cartoes, hover actions |
| `src/features/planos/components/ListFormModal.jsx` | Criado — modal de edicao de lista com picker de cores (10 presets) |
| `src/features/planos/components/DeleteListConfirmModal.jsx` | Criado — modal de confirmacao de exclusao de lista |

### Checklist de tarefas

- [x] Criar CSS do board (`board-page.css`) com glass-morphism
- [x] Criar componente `ListColumn` com header editavel, area de cartoes, hover actions
- [x] Criar componente `ListFormModal` para editar lista (nome + cor)
- [x] Criar componente `DeleteListConfirmModal` para confirmacao de exclusao
- [x] Reescrever `PlanoBoardPage` com board horizontal, header do plano, CRUD inline
- [x] Implementar criacao rapida inline de listas (input + submit no final do board)
- [x] Implementar edicao inline do nome da lista (click-to-edit)
- [x] Implementar exclusao com modal de confirmacao
- [x] Implementar estados: loading (skeleton), empty (CTA), error (retry), success (board)
- [x] Implementar toast de feedback (sucesso/erro)
- [x] Build de producao (`npm run build`) executado com sucesso

---

## Etapa 4 — Cartoes, Tarefas e Eventos

### Status: Concluida

### Observacoes gerais

- Backend usa heranca JPA (JOINED strategy): `Cartao` e classe abstrata, `Tarefa` e `Evento` sao subclasses concretas
- `CartaoController` retorna `CartaoResponse` com campo `tipo` ("TAREFA" ou "EVENTO") — resposta polimorfica
- Cartoes sao listados via endpoint generico (`/cartoes/perfil/{perfilId}/lista/{listaId}`), que retorna tarefas e eventos misturados
- Criacao e edicao usam endpoints tipados separados (`/tarefas/...` e `/eventos/...`)
- Exclusao usa endpoint generico (`/cartoes/perfil/{perfilId}/{id}`) que funciona para ambos os tipos
- Entidade `Tarefa` exige campo `dataConclusao` (LocalDateTime, obrigatorio)
- Entidade `Evento` exige campos `dataInicio` e `dataFim` (LocalDateTime, ambos obrigatorios; dataFim >= dataInicio)
- Campos comuns: `nome` (max 50, obrigatorio), `descricao` (max 500, opcional), `cor` (#RRGGBB, opcional)
- Backend nao possui endpoints para reordenacao de cartoes ou movimentacao entre listas — drag-and-drop de reordenacao nao implementado nesta etapa
- Backend nao possui endpoints para checklist, comentarios, anexos ou atividade — modal de cartao implementado com campos disponiveis na API

### Decisoes tecnicas

- **Cartoes por lista**: Estado armazenado como mapa `{ [listaId]: cartao[] }` no `PlanoBoardPage`, com loading state separado por lista (`cartoesLoadingMap`)
- **Fetch paralelo**: Cartoes de todas as listas sao carregados em paralelo via `Promise.allSettled` para melhor performance
- **Refresh granular**: Apos criar/editar/excluir cartao, apenas a lista afetada e recarregada (nao recarrega todas)
- **Tipo de cartao**: Na criacao, usuario escolhe entre Tarefa e Evento via seletor visual (toggle buttons). Na edicao, tipo e exibido como badge (nao editavel)
- **Badge visual**: Tarefa exibe badge azul com icone CheckSquare, Evento exibe badge roxo com icone Calendar
- **Datas**: Campos `datetime-local` nativos do HTML5. Evento usa layout side-by-side (Inicio | Fim) com fallback para coluna unica em mobile
- **Cor do cartao**: Barra de 3px no topo do card-item. Reutiliza o mesmo color-picker de 10 cores ja existente nas listas
- **Add card dropdown**: Menu flutuante posicionado acima do botao "Adicionar cartao" com opcoes Tarefa e Evento. Fecha ao clicar fora
- **Skeleton loading**: 2 card-skeletons por lista enquanto cartoes estao carregando (animacao shimmer escalonada)
- **Modal de formulario**: `CardFormModal` unificado para criacao e edicao de ambos os tipos. Campos dinamicos conforme o tipo selecionado
- **Modal de exclusao**: `DeleteCardConfirmModal` reutiliza padroes visuais existentes (overlay blur, botoes, icone warning). Label dinamico conforme tipo
- **CSS isolado**: Estilos de cartoes adicionados ao `board-page.css` usando nomenclatura BEM-like consistente com etapas anteriores
- **Sem dependencias novas**: Nenhuma biblioteca adicional foi instalada

### Endpoints utilizados

| Metodo | Endpoint | Uso |
|--------|----------|-----|
| GET | `/api/v1/cartoes/perfil/{perfilId}/lista/{listaId}` | Listar todos os cartoes (tarefas + eventos) de uma lista |
| DELETE | `/api/v1/cartoes/perfil/{perfilId}/{id}` | Excluir cartao (generico) |
| POST | `/api/v1/tarefas/perfil/{perfilId}/lista/{listaId}` | Criar nova tarefa |
| PUT | `/api/v1/tarefas/perfil/{perfilId}/{id}` | Editar tarefa existente |
| POST | `/api/v1/eventos/perfil/{perfilId}/lista/{listaId}` | Criar novo evento |
| PUT | `/api/v1/eventos/perfil/{perfilId}/{id}` | Editar evento existente |

### Arquivos criados/modificados

| Arquivo | Acao |
|---------|------|
| `src/features/planos/components/CardItem.jsx` | Criado — componente de cartao individual com badge de tipo, titulo, data, hover actions |
| `src/features/planos/components/CardFormModal.jsx` | Criado — modal unificado para criacao/edicao de tarefa e evento com seletor de tipo, campos dinamicos, color picker |
| `src/features/planos/components/DeleteCardConfirmModal.jsx` | Criado — modal de confirmacao de exclusao de cartao |
| `src/features/planos/components/ListColumn.jsx` | Modificado — integrado com cartoes (exibicao, loading, add-card dropdown com tipo) |
| `src/features/planos/PlanoBoardPage.jsx` | Modificado — adicionado gerenciamento de estado de cartoes (cartoesMap, cartoesLoadingMap), CRUD completo, modais de cartao |
| `src/features/planos/styles/board-page.css` | Modificado — adicionados estilos para card-item, badges, type-selector, textarea, date-row, add-card-dropdown, card-skeleton |

### Checklist de tarefas

- [x] Criar componente `CardItem` com badge de tipo, titulo, datas, hover actions
- [x] Criar componente `CardFormModal` para criar/editar tarefa e evento
- [x] Criar componente `DeleteCardConfirmModal` para confirmacao de exclusao
- [x] Adicionar estilos CSS para cartoes (card-item, badges, skeletons, dropdown, type-selector)
- [x] Atualizar `ListColumn` para exibir cartoes, loading state e botao add-card funcional
- [x] Atualizar `PlanoBoardPage` com fetch paralelo de cartoes, CRUD completo, modais de cartao
- [x] Build de producao (`npm run build`) executado com sucesso

### Drag-and-Drop de Cartoes (complemento Etapa 4)

#### Observacoes gerais

- Implementacao customizada usando Pointer Events do browser (nao usa HTML5 DnD API nem bibliotecas externas)
- Suporte a arrastar cartoes dentro da mesma lista (reordenacao vertical) e entre listas diferentes (movimentacao horizontal)
- Interacao visual inspirada no Trello: ghost flutuante com rotacao e sombra elevada, placeholder com borda tracejada na posicao de destino
- Backend possui endpoint de reordenacao `PATCH /api/v1/cartoes/perfil/{perfilId}/reorder` — posicao e lista persistidas no banco

#### Mecanica de Drag

- **Ativacao**: Drag inicia apos segurar o ponteiro por 120ms (`DRAG_DELAY_MS`) OU ao mover mais de 4px (`DRAG_MOVE_THRESHOLD`) durante o hold
- **Ghost element**: Clone DOM do cartao posicionado como `position: fixed`, seguindo o cursor em tempo real. Estilizado com `rotate(2deg) scale(1.04)`, sombra elevada e `opacity: 0.92`
- **Cartao original**: Colapsado com `opacity: 0; height: 0` durante o arrasto via classe `.card-item--dragging`
- **Placeholder**: Exatamente UM placeholder ativo por vez — apenas na lista-alvo (`isDragOver`). Renderizacao com flag `placeholderInserted` impede duplicacao
- **Calculo de destino**: `getTargetListaId(clientX)` encontra coluna sob o cursor via `getBoundingClientRect`. `getDropIndex(listaId, clientY)` encontra posicao vertical comparando `midY` de cada cartao
- **Auto-scroll**: Loop `requestAnimationFrame` que scrolla o canvas horizontalmente e a area de cartoes verticalmente quando o cursor esta dentro de 60px das bordas (`AUTO_SCROLL_ZONE`)
- **Drop**: Ghost anima para a posicao do placeholder com transicao CSS (`card-drag-ghost--dropping`), depois `commitDrop()` atualiza o `cartoesMap` local e chama `persistCardPositions()` para salvar no backend
- **Protecao de click**: `dragClickBlocked` ref previne que o click de soltar abra o modal de edicao do cartao
- **Listeners no document**: Pointer events registrados em `document` (nao no elemento do cartao) para sobreviver ao unmount do React durante re-render

#### Persistencia de posicao

- Campo `posicao` (INT NOT NULL, default 0) adicionado a tabela `Cartao` via migracao Flyway `V2__add_posicao_to_cartao.sql`
- Endpoint `PATCH /api/v1/cartoes/perfil/{perfilId}/reorder` aceita `ReorderRequest` com lista de `{ cardId, listaId, posicao }`
- `CartaoService.reorder()` valida ownership (perfil e listas), atualiza lista + posicao de cada cartao, e salva em batch
- `CartaoRepository` ordena por `posicao ASC` ao listar cartoes (`findByListaIdAndListaPlanoPerfilIdOrderByPosicaoAsc`)
- Novos cartoes recebem `posicao = count(listaId)` automaticamente via `CartaoService.getNextPosicao()`
- `CartaoResponse` inclui campo `posicao` para o frontend

#### Bugs corrigidos

- **Reordenacao bidirecional**: `commitDrop()` usava `adjustedIndex` que desajustava ao mover de cima para baixo (double-adjustment). Corrigido para usar `dropIndex` diretamente, pois `getDropIndex()` ja retorna indice relativo a lista filtrada (sem o cartao arrastado)
- **Placeholders duplicados**: Multiplas condicoes no `ListColumn.renderCards()` podiam gerar 2+ placeholders (ex: `dropIdx >= filteredCards.length` E `filteredCards.length === 0 && isDragOver`). Reescrito com flag `placeholderInserted` garantindo exatamente 1 placeholder
- **Listeners perdidos**: Pointer events registrados no elemento do cartao eram perdidos quando o React desmontava o DOM durante re-render. Migrado para `document`-level listeners com `removeDragListeners` ref para cleanup

#### Decisoes tecnicas

- **Pointer Events vs HTML5 DnD**: Escolhido Pointer Events para controle visual total — HTML5 DnD nao permite customizar a aparencia do ghost nem posicionar livremente
- **Refs para performance**: `dragStartInfo`, `latestDropTarget`, `autoScrollRef` usam `useRef` para evitar re-renders excessivos durante `pointermove` (disparado ~60fps)
- **Estado dividido**: `dragState` (React state) controla a renderizacao (ghost, classes CSS). Coordenadas do cursor ficam em refs para performance
- **DOM queries para hit-testing**: `querySelectorAll("[data-lista-id]")` e `querySelectorAll(".card-item")` usados para calculo de posicao — simples e eficaz sem mapa de coordenadas em memoria
- **Cleanup robusto**: `useEffect` de unmount limpa timer, auto-scroll e ghost. `cleanupDrag()` centraliza reset de todos os estados de drag
- **Persistencia otimista**: Estado visual atualizado imediatamente no `commitDrop()`, API de reordenacao chamada em seguida. Erro exibido via toast sem reverter (fire-and-forget)

#### Arquivos criados/modificados (Backend)

| Arquivo | Acao |
|---------|------|
| `src/main/resources/db/migration/V2__add_posicao_to_cartao.sql` | Criado — adiciona coluna `posicao` e inicializa posicoes existentes |
| `src/main/java/.../model/entity/Cartao.java` | Modificado — adicionado campo `posicao` (Integer, default 0) |
| `src/main/java/.../model/dto/CartaoResponse.java` | Modificado — adicionado campo `posicao` no construtor e getters/setters |
| `src/main/java/.../model/dto/ReorderRequest.java` | Criado — DTO com lista de `CardPosition { cardId, listaId, posicao }` |
| `src/main/java/.../model/repository/CartaoRepository.java` | Modificado — `findByListaIdAndListaPlanoPerfilIdOrderByPosicaoAsc`, `findAllByIdInAndListaPlanoPerfilId`, `countByListaId` |
| `src/main/java/.../model/services/CartaoService.java` | Modificado — adicionados `getNextPosicao()` e `reorder()` |
| `src/main/java/.../controller/CartaoController.java` | Modificado — adicionado endpoint `PATCH .../reorder` |
| `src/main/java/.../model/services/TarefaService.java` | Modificado — auto-assign `posicao` no `save()` |
| `src/main/java/.../model/services/EventoService.java` | Modificado — auto-assign `posicao` no `save()` |

#### Arquivos modificados (Frontend)

| Arquivo | Mudanca |
|---------|---------|
| `src/features/planos/components/CardItem.jsx` | Props `isDragging` e `onDragPointerDown`, classe `.card-item--dragging`, `data-card-id`, handler `onPointerDown` |
| `src/features/planos/components/ListColumn.jsx` | Props `dragState`, `dropTarget`, `onDragPointerDown`, `data-lista-id`, `data-cards-area`, logica de placeholder reescrita com flag `placeholderInserted` |
| `src/features/planos/PlanoBoardPage.jsx` | Logica DnD completa: `commitDrop` corrigido (sem double-adjustment), `persistCardPositions()` adicionado, listeners em `document` |
| `src/features/planos/styles/board-page.css` | Estilos DnD: `.card-drag-ghost`, `.card-item--dragging`, `.card-drop-placeholder`, `.board-canvas--dragging`, `.card-drag-ghost--dropping`, `.list-column--drag-over` |

#### Checklist de tarefas (DnD)

- [x] Adicionar estilos CSS para drag-and-drop (ghost, placeholder, dragging states)
- [x] Atualizar `CardItem` com suporte a drag (isDragging, onPointerDown)
- [x] Atualizar `ListColumn` com renderizacao de placeholder unico (sem duplicacao)
- [x] Implementar logica completa de DnD no `PlanoBoardPage` (ativacao, ghost, hit-testing, auto-scroll, drop, cleanup)
- [x] Corrigir reordenacao bidirecional (mover para cima e para baixo)
- [x] Corrigir placeholders duplicados ao mover entre listas
- [x] Adicionar campo `posicao` na entidade Cartao (backend)
- [x] Criar endpoint `PATCH .../reorder` para persistir posicoes
- [x] Implementar `persistCardPositions()` no frontend apos cada drop
- [x] Auto-assign posicao ao criar novos cartoes (TarefaService, EventoService)
- [x] Ordenar cartoes por posicao no repository
- [x] Build de producao (backend + frontend) executado com sucesso
- [x] 29 testes backend passando sem falhas

---

## Etapa 5 — Perfil, Acessibilidade e Polimento Final

### Status: Concluida

### Observacoes gerais

- Backend expoe CRUD de perfil em `/api/v1/perfil/{id}` (GET, PUT, DELETE)
- Entidade `Perfil` possui campos: `id`, `email` (max 320, unico, obrigatorio), `nome` (max 50, obrigatorio), `sobrenome` (max 50, opcional), `telefone` (regex `^[0-9+() -]{1,20}$`, opcional)
- `DELETE /api/v1/perfil/{id}` realiza soft-delete (inativacao via `codStatus = false`), nao exclusao permanente
- `PUT /api/v1/perfil/{id}` atualiza nome, sobrenome, telefone e opcionalmente senha — email enviado no payload mas nao atualizado pelo backend (service so atualiza nome/sobrenome/telefone)
- Backend usa `Perfil` entity diretamente como DTO para create/update (sem PerfilRequest/PerfilResponse dedicados)
- Senha armazenada como SHA-256 hash em `VARBINARY(32)`, campo `@JsonIgnore` — nunca retornada nas respostas

### Decisoes tecnicas

- **AuthContext atualizado**: Adicionado metodo `updateUser()` ao contexto de autenticacao para sincronizar dados do perfil no localStorage e estado React apos edicao
- **Fetch do perfil via API**: Pagina carrega dados do perfil via `GET /api/v1/perfil/{id}` ao montar, garantindo dados atualizados (nao depende apenas da sessao local)
- **Maquina de estados**: Mesma abordagem das etapas anteriores — `LOADING` (skeleton), `SUCCESS` (formulario), `ERROR` (retry)
- **Skeleton loading**: Skeleton anatomico com avatar circular, campos label+input e grid 2-colunas com animacao shimmer escalonada
- **Modo view/edit**: Alternancia entre visualizacao read-only e formulario editavel. Botao "Editar" no header da secao, auto-focus no campo nome ao entrar em edicao
- **Validacao client-side**: Nome obrigatorio (max 50), email obrigatorio/valido (max 320), sobrenome max 50, telefone regex `^[0-9+() -]{1,20}$`
- **Feedback inline**: Erros de campo exibidos abaixo de cada input, erro de API exibido como alert no topo do formulario
- **Contador de caracteres**: Exibido abaixo dos campos nome e sobrenome (ex: `12/50`)
- **Zona de risco**: Secao visual separada com borda vermelha, icone Shield, titulo vermelho, descricao e botao outline-danger
- **Modal de inativacao**: Confirmacao forte com icone AlertTriangle, texto detalhado, botoes Cancelar/Inativar. Loading state com spinner. Apos inativacao, logout automatico com redirect para `/login`
- **Toast feedback**: Mesmo padrao das etapas anteriores — auto-dismiss 3.5s, tipos success/error
- **Atualizacao de sessao**: Apos salvar perfil com sucesso, `updateUser()` sincroniza o header global (avatar, nome no dropdown)
- **CSS isolado**: Estilos em `perfil-page.css` usando nomenclatura BEM-like consistente com etapas anteriores
- **Acessibilidade**: Labels associados a campos (htmlFor/id), role dialog/alert/status, aria-label em botoes, aria-modal em modais, focus visible, navegacao por teclado (Escape fecha modal)
- **Sem dependencias novas**: Nenhuma biblioteca adicional foi instalada

### Endpoints utilizados

| Metodo | Endpoint | Uso |
|--------|----------|-----|
| GET | `/api/v1/perfil/{id}` | Buscar dados do perfil do usuario logado |
| PUT | `/api/v1/perfil/{id}` | Atualizar dados cadastrais (nome, sobrenome, telefone) |
| DELETE | `/api/v1/perfil/{id}` | Inativar perfil (soft-delete via codStatus = false) |

### Arquivos criados/modificados

| Arquivo | Acao |
|---------|------|
| `src/contexts/AuthContext.jsx` | Modificado — adicionado metodo `updateUser()` para sincronizar perfil |
| `src/features/perfil/PerfilPage.jsx` | Reescrito — pagina completa com CRUD, estados, skeleton, modal, toast |
| `src/features/perfil/styles/perfil-page.css` | Criado — estilos glass-morphism para perfil, formulario, skeleton, modal, toast, danger zone |

### Checklist de tarefas

- [x] Adicionar metodo `updateUser()` ao `AuthContext`
- [x] Criar CSS da pagina de perfil (`perfil-page.css`) com glass-morphism
- [x] Reescrever `PerfilPage` com integracao API, modo view/edit, validacao, avatar
- [x] Implementar estados: loading (skeleton), error (retry), success (formulario)
- [x] Implementar zona de risco com botao de inativacao e modal de confirmacao
- [x] Implementar toast de feedback (sucesso/erro)
- [x] Garantir acessibilidade: labels, aria-*, focus visible, navegacao por teclado
- [x] Sincronizar sessao (AuthContext + localStorage) apos edicao de perfil
- [x] Build de producao (`npm run build`) executado com sucesso

### Checklist de qualidade transversal (Etapa 5)

- [x] Estados de interface: loading/empty/error/success padronizados em todas as paginas
- [x] Tratamento de erros HTTP: cobertura para 400, 401, 404, 409, 500 via `normalizeError()`
- [x] Acessibilidade: foco visivel, semantica correta, labels associados, navegacao por teclado
- [x] Consistencia visual: aderencia ao padrao glass-morphism do front-end
- [x] Principios UX: baixa friccao, interface espacial, interacao direta, feedback constante

---

## Ajuste visual — Remocao de gradientes dos cards, forms e popups

### Status: Concluida

### Descricao

Removidos todos os gradientes CSS de cards, formularios de criacao (modais), mensagens de confirmacao (popups) e botoes internos. Substituidos por cores solidas consistentes com o tema claro e escuro.

### Alteracoes realizadas

| Arquivo | Alteracao |
|---------|-----------|
| `src/features/homepage/styles/homepage-gemini.css` | `--glass-bg`, `--glass-card-bg`, `--glass-card-hover` — gradientes substituidos por cores solidas (light + dark). Botao CTA da homepage tambem corrigido. |
| `src/features/planos/styles/planos-page.css` | `.plano-btn--primary` e `.plano-btn--danger` — gradientes substituidos por cor solida azul/vermelha. |
| `src/features/planos/styles/board-page.css` | `.board-add-list__submit` e `.board-empty__cta` — gradientes substituidos por cor solida azul. |
| `src/features/perfil/styles/perfil-page.css` | `.perfil-btn--primary`, `.perfil-btn--danger` e `.perfil-avatar` — gradientes substituidos por cor solida. |
| `src/components/layout/styles/authenticated-layout.css` | `.app-header-btn--primary` e `.app-avatar` — gradientes substituidos por cor solida azul. |

### Observacoes

- Gradientes de skeleton loading (shimmer animation) foram mantidos — sao efeitos de animacao, nao backgrounds visuais.
- Gradiente de overlay do card cover (`plano-card__cover::after`) mantido — necessario para legibilidade do texto sobre a imagem.
- Presets de wallpaper (PlanoFormModal/PlanoCard) mantidos como gradiente — sao dados de design do plano, nao UI chrome.
- Build de producao validado com sucesso apos alteracoes.