# Instruções do projeto — Plan-Things (front-end)

## Objetivo

Implementar as páginas e rotas ainda inexistentes no front-end React (`react-web/frontend/src/`) para cobrir todos os endpoints já disponíveis no back-end Spring Boot (`react-web/backend/`).

## Plano de implementação

O plano está dividido em 5 etapas sequenciais. Cada etapa tem dependência das anteriores.

| Etapa | Descrição | Referência |
|-------|-----------|------------|
| 1 | Base autenticada, `AuthenticatedLayout`, `PrivateRoute`, `apiClient`, sessão | `/workspaces/Plan-Things/docs/planejamento-etapas/01-etapa-base-autenticacao-infra.md` |
| 2 | Dashboard de planos — CRUD completo em `/app/planos` | `/workspaces/Plan-Things/docs/planejamento-etapas/02-etapa-dashboard-planos.md` |
| 3 | Board do plano e CRUD de listas em `/app/planos/:planoId` | `/workspaces/Plan-Things/docs/planejamento-etapas/03-etapa-board-listas.md` |
| 4 | Cartões (drag-and-drop + modal), tarefas e eventos | `/workspaces/Plan-Things/docs/planejamento-etapas/04-etapa-cartoes-tarefas-eventos.md` |
| 5 | Página de perfil, acessibilidade e polimento final em `/app/perfil` | `/workspaces/Plan-Things/docs/planejamento-etapas/05-etapa-perfil-polimento.md` |

## Documentação de referência

- Índice geral: `/workspaces/Plan-Things/PLANEJAMENTO_PAGINAS_E_IMPLEMENTACOES_FALTANTES.md`
- Visão consolidada (snapshot): `/workspaces/Plan-Things/docs/planejamento-etapas/00-visao-geral.md`

## Premissas técnicas

- Stack: React + Vite + Tailwind CSS (`react-web/frontend/`)
- Back-end: Spring Boot REST em `react-web/backend/` (já operacional)
- Diretriz visual: inspirada no Trello — sem criar linguagem paralela ao padrão já existente
- Padrões obrigatórios: estados `loading/empty/error/success`, erros HTTP tratados, acessibilidade mínima

> **Observação 1:** ao implementar novas páginas, o padrão de design já existente no front-end deve ser rigorosamente respeitado — tipografia, escala de espaçamentos, botões, campos, estados, contraste e identidade visual. Nenhuma linguagem visual paralela deve ser criada; todas as adições devem evoluir sobre o padrão atual.

> **Observação 2:** ao executar qualquer etapa do plano, matenha o arquivo `/workspaces/Plan-Things/notas-de-progresso.md` atualizado — registrando observações, comentários e checklists das tarefas já realizadas. Caso o arquivo ainda não exista, deve ser criado. O conteúdo desse arquivo deve ser lido e levado em consideração antes de iniciar qualquer implementação, evitando retrabalho e perda de contexto.

> **Observação 3:** todas as páginas devem ser implementadas com alto nível de qualidade visual e técnica. Aplicar habilidades de web design para criar interfaces robustas, bem proporcionadas e esteticamente refinadas — com atenção a hierarquia visual, espaçamento, tipografia, contraste, microinterações e responsividade. O resultado final deve parecer uma aplicação profissional de mercado.
