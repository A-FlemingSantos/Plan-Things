# Resumo da auditoria

## Concluido ate aqui

- `CQ-2`: removido o arquivo morto `react-web/frontend/src/features/planos/PlanooardPage.jsx`.
- `AR-2`: corrigido o `README.md`, removendo a referencia quebrada para `INTEGRATION_GUIDE.md`.
- `BL-3`: atualizado o modal de exclusao de plano para avisar que listas e cartoes tambem sao removidos.
- `DP-1`: ESLint passou a cobrir `js/jsx`; foi adicionado `eslint-plugin-react` e ajustado o frontend para o lint real.
- `AR-1`: `PerfilController` agora usa `PerfilRequest` e `PerfilResponse`, com testes reforcando o shape da resposta.
- `SR-3`: removidos os fallbacks versionados de `DB_URL`, `DB_USERNAME` e `DB_PASSWORD`; o `README.md` foi alinhado.
- `SR-4`: CORS restringido para origens locais explicitas e origem exata do Codespaces; teste de integracao adicionado.
- `DP-2`: removidas dependencias de frontend sem uso herdadas do template.
- `CQ-1`: a tela `/cadastro` passou a validar dados, chamar `POST /api/v1/perfil` e redirecionar para `/login` com mensagem de sucesso.
- `BL-1`: falhas no carregamento de cartoes deixaram de aparecer como lista vazia; cada lista agora mostra erro recuperavel com retry.
- `BL-2`: o reorder de cartoes agora faz rollback local e refetch das listas afetadas quando a persistencia falha.
- `CQ-3`: `PlanoBoardPage.jsx` foi modularizada em componentes visuais e um hook dedicado para drag-and-drop.
- `PI-2`: create/edit/delete de planos, listas e cartoes agora atualizam estado local sem refetch integral da colecao.
- `PI-1`: criado `GET /api/v1/planos/perfil/{perfilId}/{planoId}/board`, e o board passou a carregar plano, listas e cartoes em uma unica requisicao inicial.
- `PI-3`: novos wallpapers em base64 deixaram de ser aceitos; o modal agora usa apenas capas predefinidas e o backend bloqueia novos `data:`, preservando compatibilidade de leitura com capas antigas.
- `TG-2`: adicionado perfil `migrationtest` com Flyway ativo, migrations H2 alinhadas por versao, teste de alinhamento de scripts e integracao real via `MockMvc` cobrindo controller -> service -> repository -> DB.
- `TG-1`: adicionada stack de testes de frontend com `vitest` + Testing Library, cobrindo login, cadastro, CRUD de planos, retry do board e rollback/refetch no reorder via `useBoardDrag`.
- `SR-2`: o backend passou a usar `BCrypt` via `PasswordEncoder`, com migracao da coluna `senha` para `VARBINARY(100)` e upgrade automatico de hashes SHA-256 legados no login bem-sucedido.
- `SR-1`: a autenticacao deixou de confiar em `perfilId` enviado pelo cliente; o login agora cria sessao HTTP no backend, as rotas protegidas migraram para caminhos `/me`, o frontend parou de montar URLs com `perfilId`, e foi adicionada cobertura provando que uma sessao autenticada nao consegue ler nem excluir o plano de outro perfil.
- `TG-3`: fechada a cobertura dos caminhos criticos restantes com testes dirigidos para garantir que login invalido nao cria sessao, logout invalida a sessao autenticada e um perfil autenticado recebe `404` ao tentar abrir o board de outro perfil; com isso, o achado passou a ficar coberto junto dos testes ja existentes de `BCrypt`/hash legado e rollback do reorder.

## Validacao realizada

- Frontend validado com `npm run test` (`11` testes, `0` failures), `npm run lint` (`0` erros e `2` warnings preexistentes) e `npm run build`.
- Backend validado com `./mvnw test` (`52` testes, `0` failures, `0` errors) nas etapas que afetaram a API.
- Os diagnosicos do editor foram checados nas etapas recentes e permaneceram sem erros.

## Proximas etapas

1. Nenhuma etapa pendente do relatorio original; a auditoria foi concluida.
