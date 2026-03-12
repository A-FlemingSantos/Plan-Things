# Plan-Things Repository Audit Report

## Scope and evidence

This audit reviewed the repository root, `README.md`, the full frontend under `react-web/frontend`, the full backend under `react-web/backend`, Flyway migrations, and the existing automated tests.

Command-based checks executed during the audit:

- `cd react-web/frontend && npm run lint` -> passed
- `cd react-web/frontend && npm run build` -> passed
- `cd react-web/backend && ./mvnw test` -> passed (`29` tests, `0` failures)

Those baseline commands show the repository is currently buildable, but some of the findings below explain why the green status still leaves important gaps.

## 1. Architecture Review

### Current module map

- Frontend boot flow: `react-web/frontend/src/main.jsx` -> `src/App.jsx` -> `ThemeProvider` + `AuthProvider` -> public routes (`/`, `/login`, `/cadastro`) and guarded routes under `/app/*`.
- Frontend auth flow: `src/features/auth/LoginPage.jsx` posts to `/perfil/login`; `src/contexts/AuthContext.jsx` stores the returned profile data in `localStorage` under `planthings_session`; `src/components/PrivateRoute.jsx` only checks whether that local session object exists.
- Frontend data flow: feature pages call `src/lib/apiClient.js` directly. The `planos` workflow is the largest surface and hydrates a board by fetching plan metadata, lists, and cards separately.
- Backend request flow: controllers in `react-web/backend/src/main/java/com/projectmanager/planthings/controller/` delegate to services, which delegate to repositories and entities. Persistence is governed by Flyway SQL migrations in `src/main/resources/db/migration/`.
- Data ownership model: most backend routes are shaped as `/api/v1/<resource>/perfil/{perfilId}/...` and services scope queries with that path parameter.
- Documentation surface: there is no `docs/` directory in the repository, and `README.md` points to a missing `INTEGRATION_GUIDE.md`.

### Finding AR-1: Perfil API is coupled directly to the JPA entity

- **Severity**: Medium
- **Area**: Architecture
- **File path**:
  - `react-web/backend/src/main/java/com/projectmanager/planthings/controller/PerfilController.java`
  - `react-web/backend/src/main/java/com/projectmanager/planthings/model/entity/Perfil.java`
- **Code snippet**:
  ```java
  @PostMapping
  public ResponseEntity<Perfil> save(@Valid @RequestBody Perfil perfil) { ... }

  @GetMapping("/{id}")
  public ResponseEntity<Perfil> findById(@PathVariable Long id) { ... }
  ```
- **Clear explanation of the problem**: `PerfilController` uses the persistence entity as both request and response contract, while the rest of the API uses dedicated DTOs (`PlanoRequest`, `PlanoResponse`, `ListaRequest`, and so on). The current Jackson annotations on `Perfil` avoid exposing password fields, but the controller is still tightly coupled to persistence concerns and entity annotations.
- **Potential impact on the system**: Future persistence changes can break API compatibility; controller behavior becomes harder to evolve safely; the API surface is inconsistent across resources.
- **Recommended fix**: Introduce `PerfilRequest` and `PerfilResponse` DTOs and keep `Perfil` internal to the service/repository layers.
- **Refactored code example**:
  ```java
  public record PerfilResponse(
      Long id,
      String email,
      String nome,
      String sobrenome,
      String telefone
  ) {}
  ```
- **Suggested validation**: Update `PerfilControllerWebMvcTest` to assert the DTO shape explicitly and verify password fields cannot leak through serialization.

### Finding AR-2: Repository documentation map is out of sync with the actual repository

- **Severity**: Low
- **Area**: Architecture
- **File path**: `README.md`
- **Code snippet**:
  ```md
  ## Documentacao adicional
  - Guia de integracao: [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)
  ```
- **Clear explanation of the problem**: The root README points to `INTEGRATION_GUIDE.md`, but that file does not exist. The repository also has no `docs/` directory even though the audit baseline expected one.
- **Potential impact on the system**: Onboarding and maintenance are slower because the documented repository map does not match the real one.
- **Recommended fix**: Either add the missing documentation or remove/update the broken references so the README reflects the current repository shape.
- **Suggested validation**: Open all README links from a clean clone and confirm each referenced file exists.

## 2. Code Quality Issues

### Finding CQ-1: Registration UI exists, but the feature is not implemented

- **Severity**: High
- **Area**: Code Quality
- **File path**:
  - `react-web/frontend/src/features/auth/RegisterPage.jsx`
  - `react-web/backend/src/main/java/com/projectmanager/planthings/controller/PerfilController.java`
- **Code snippet**:
  ```jsx
  <form className="space-y-5">
    <input id="name" type="text" ... />
    <input id="email" type="email" ... />
    <input id="password" type="password" ... />
    <button type="submit">Criar conta</button>
  </form>
  ```
- **Clear explanation of the problem**: The frontend renders a registration form, but it has no `onSubmit`, no validation, and no API call. The backend already exposes `POST /api/v1/perfil`, so the feature appears available in the UI while doing nothing.
- **Potential impact on the system**: Users cannot self-register, and the application presents a broken primary path.
- **Recommended fix**: Implement registration using the same `react-hook-form` + Zod + `apiClient` pattern already used in `LoginPage.jsx`.
- **Refactored code example**:
  ```jsx
  <form onSubmit={handleSubmit(onSubmit)} noValidate>
    {/* fields registered with react-hook-form */}
  </form>
  ```
- **Suggested validation**: Manually create a profile from `/cadastro`, then verify duplicate-email handling and post-registration navigation.

### Finding CQ-2: A dead placeholder board page remains in the repository

- **Severity**: Low
- **Area**: Code Quality
- **File path**:
  - `react-web/frontend/src/features/planos/PlanooardPage.jsx`
  - `react-web/frontend/src/App.jsx`
- **Code snippet**:
  ```jsx
  export function PlanoBoardPage() {
    return <p>Plano #{planoId} — sera implementado na Etapa 3</p>;
  }
  ```
- **Clear explanation of the problem**: `PlanooardPage.jsx` is a misspelled duplicate placeholder that exports the same component name as the real board page. `App.jsx` imports `PlanoBoardPage.jsx`, so the typo file is dead code.
- **Potential impact on the system**: Dead files increase confusion, create a risk of accidental edits in the wrong file, and make refactors harder.
- **Recommended fix**: Remove the placeholder file or archive it outside the runtime source tree.
- **Suggested validation**: Search for `PlanooardPage` after cleanup and confirm only the real board page remains.

### Finding CQ-3: `PlanoBoardPage.jsx` has grown into a 1003-line multi-responsibility component

- **Severity**: Medium
- **Area**: Code Quality
- **File path**: `react-web/frontend/src/features/planos/PlanoBoardPage.jsx`
- **Code snippet**:
  ```jsx
  const [plano, setPlano] = useState(null);
  const [listas, setListas] = useState([]);
  const [cartoesMap, setCartoesMap] = useState({});
  const [formOpen, setFormOpen] = useState(false);
  const [cardFormOpen, setCardFormOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [dragState, setDragState] = useState({ active: false, cardId: null, sourceListaId: null });
  ```
- **Clear explanation of the problem**: The board page currently owns loading, mutation orchestration, drag-and-drop, modal state, optimistic UI, toast state, and rendering. The file is large enough that behavior is hard to reason about locally.
- **Potential impact on the system**: Fixes in the main product workflow are riskier, and targeted tests become difficult to write.
- **Recommended fix**: Split the page into focused hooks and components such as `useBoardData`, `useBoardDnD`, `BoardHeader`, `BoardCanvas`, and modal wrappers.
- **Suggested validation**: Refactor incrementally and verify the board CRUD and drag-drop flows still work end to end.

## 3. Bugs and Logical Errors

### Finding BL-1: Card-loading failures are silently rendered as empty lists

- **Severity**: Medium
- **Area**: Bug
- **File path**: `react-web/frontend/src/features/planos/PlanoBoardPage.jsx`
- **Code snippet**:
  ```jsx
  try {
    const res = await apiClient.get(`/cartoes/perfil/${perfilId}/lista/${listaId}`);
    setCartoesMap((prev) => ({ ...prev, [listaId]: res.data }));
  } catch {
    setCartoesMap((prev) => ({ ...prev, [listaId]: [] }));
  }
  ```
- **Clear explanation of the problem**: When a card request fails, the page silently substitutes an empty array instead of surfacing the error. The same pattern appears in the all-lists hydration path via `Promise.allSettled`.
- **Potential impact on the system**: A backend outage or authorization problem looks identical to "this list has no cards", which can hide data issues and mislead users.
- **Recommended fix**: Track per-list error state and render retry/error UI instead of erasing the distinction between empty and failed.
- **Suggested validation**: Force `/cartoes/perfil/...` to return `500` and verify the UI shows a recoverable error state rather than an empty list.

### Finding BL-2: Drag-and-drop reorder persists changes in fire-and-forget mode

- **Severity**: High
- **Area**: Bug
- **File path**: `react-web/frontend/src/features/planos/PlanoBoardPage.jsx`
- **Code snippet**:
  ```jsx
  apiClient
    .patch(`/cartoes/perfil/${perfilId}/reorder`, { cards: positions })
    .catch((err) => {
      const normalized = normalizeError(err);
      showToast("error", normalized.message);
    });
  ```
- **Clear explanation of the problem**: The UI mutates local card order first, then sends the reorder request without awaiting it. If the backend rejects the request, the page shows an error toast but does not roll back or refetch.
- **Potential impact on the system**: Users can believe an order change succeeded until the next reload snaps the board back to the server state.
- **Recommended fix**: Keep a snapshot before the optimistic move and either roll back on failure or refetch the affected lists after the request completes.
- **Refactored code example**:
  ```jsx
  const previous = currentMapSnapshot;
  try {
    await apiClient.patch(`/cartoes/reorder`, payload);
  } catch (error) {
    setCartoesMap(previous);
    throw error;
  }
  ```
- **Suggested validation**: Simulate a failed reorder request and confirm the UI returns to the prior order.

### Finding BL-3: Plan deletion warning does not reflect the actual cascade behavior

- **Severity**: High
- **Area**: Bug
- **File path**:
  - `react-web/frontend/src/features/planos/components/DeleteConfirmModal.jsx`
  - `react-web/backend/src/main/resources/db/migration/V1__init_schema.sql`
- **Code snippet**:
  ```sql
  CONSTRAINT FK_Plano_Perfil FOREIGN KEY (perfil_id)
      REFERENCES dbo.Perfil(id)
      ON DELETE CASCADE
  ```
  ```jsx
  Esta acao nao pode ser desfeita.
  ```
- **Clear explanation of the problem**: The database cascades plan deletion into lists and cards, but the plan delete modal only says the action cannot be undone. By contrast, the list delete modal explicitly warns about child cards.
- **Potential impact on the system**: Users can delete an entire board hierarchy without understanding the full blast radius.
- **Recommended fix**: At minimum, surface the cascade warning in the plan delete UI. Preferably, show affected counts or implement archive/soft-delete instead of hard delete.
- **Suggested validation**: Delete a plan containing nested lists and cards and verify the confirmation copy accurately describes what will be removed.

## 4. Security Risks

### Finding SR-1: The API trusts a client-supplied `perfilId` instead of an authenticated principal

- **Severity**: Critical
- **Area**: Security
- **File path**:
  - `react-web/frontend/src/features/auth/LoginPage.jsx`
  - `react-web/frontend/src/contexts/AuthContext.jsx`
  - `react-web/backend/src/main/java/com/projectmanager/planthings/model/dto/LoginResponse.java`
  - `react-web/backend/src/main/java/com/projectmanager/planthings/controller/PlanoController.java`
  - `react-web/backend/src/main/java/com/projectmanager/planthings/controller/ListaController.java`
  - `react-web/backend/src/main/java/com/projectmanager/planthings/controller/CartaoController.java`
  - `react-web/backend/pom.xml`
  - `react-web/backend/src/main/java/com/projectmanager/planthings/controller/PerfilController.java`
- **Code snippet**:
  ```jsx
  const session = {
    id: userData.id,
    email: userData.email,
    nome: userData.nome,
    sobrenome: userData.sobrenome,
    telefone: userData.telefone,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  ```
  ```java
  @GetMapping("/perfil/{perfilId}")
  public ResponseEntity<List<PlanoResponse>> findAllByPerfil(@PathVariable Long perfilId) { ... }
  ```
- **Clear explanation of the problem**: Login returns profile data only; no token, session identifier, or server-side principal is established. The frontend stores the raw profile id in `localStorage`, and every protected backend route trusts the caller-provided `perfilId`. The backend also lacks a Spring Security dependency and exposes `GET /api/v1/perfil`, which lists active profiles.
- **Potential impact on the system**: Any caller who can change `localStorage` or send raw HTTP requests can attempt to access another user's data by changing the id in the URL. This is an application-wide authorization failure, not a single-endpoint bug.
- **Recommended fix**: Introduce real authentication and authorization on the backend (JWT or secure session), derive the profile id from the authenticated principal, and remove client-controlled `perfilId` from the main resource paths. Protect or remove profile enumeration endpoints.
- **Refactored code example**:
  ```java
  @GetMapping("/me/planos")
  public ResponseEntity<List<PlanoResponse>> findMine(@AuthenticationPrincipal PerfilPrincipal principal) {
      return ResponseEntity.ok(
          planoService.findAllByPerfilId(principal.id()).stream().map(this::toResponse).toList()
      );
  }
  ```
- **Suggested validation**: Add integration tests proving user A cannot read or mutate user B's plans, lists, cards, tasks, events, or profile.

### Finding SR-2: Password hashing uses unsalted SHA-256

- **Severity**: Critical
- **Area**: Security
- **File path**:
  - `react-web/backend/src/main/java/com/projectmanager/planthings/model/services/PerfilService.java`
  - `react-web/backend/src/main/resources/db/migration/V1__init_schema.sql`
- **Code snippet**:
  ```java
  private byte[] hashSenha(String senhaPura) {
      MessageDigest digest = MessageDigest.getInstance("SHA-256");
      return digest.digest(senhaPura.getBytes(StandardCharsets.UTF_8));
  }
  ```
- **Clear explanation of the problem**: SHA-256 is a fast hashing algorithm and is not suitable for password storage. The implementation also uses no per-password salt and no adaptive work factor.
- **Potential impact on the system**: If the database is compromised, stored passwords are much easier to crack offline with dictionary and rainbow-table attacks.
- **Recommended fix**: Replace custom hashing with `PasswordEncoder` (`BCryptPasswordEncoder` or Argon2), then migrate existing credentials or force a reset.
- **Refactored code example**:
  ```java
  @Service
  public class PerfilService {
      private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

      private String hashSenha(String senhaPura) {
          return passwordEncoder.encode(senhaPura);
      }
  }
  ```
- **Suggested validation**: Add tests that verify two identical passwords produce different hashes and that login still works through the encoder's verify path.

### Finding SR-3: Version-controlled fallback database credentials are present in `application.properties`

- **Severity**: Critical
- **Area**: Security
- **File path**:
  - `react-web/backend/src/main/resources/application.properties`
  - `README.md`
- **Code snippet**:
  ```properties
  spring.datasource.url=${DB_URL:jdbc:sqlserver://<remote-host>;...}
  spring.datasource.username=${DB_USERNAME:<hardcoded-user>}
  spring.datasource.password=${DB_PASSWORD:<hardcoded-password>}
  ```
- **Clear explanation of the problem**: The application ships with committed fallback database connection values. If environment variables are missing, the app will use those defaults automatically.
- **Potential impact on the system**: Secrets are exposed in version control, local development can unintentionally hit a shared remote database, and credential rotation becomes harder because the unsafe default remains in the codebase.
- **Recommended fix**: Remove all credential fallbacks from version control, require secrets through the environment or a secret manager, and rotate the exposed credentials immediately.
- **Suggested validation**: Start the backend without `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` and verify it fails fast with a clear configuration error instead of connecting.

### Finding SR-4: CORS is broader than necessary for development support

- **Severity**: Medium
- **Area**: Security
- **File path**: `react-web/backend/src/main/java/com/projectmanager/planthings/config/CorsConfig.java`
- **Code snippet**:
  ```java
  .allowedOriginPatterns(
      "http://localhost:5173",
      "https://*.github.dev"
  )
  ```
- **Clear explanation of the problem**: Allowing all `*.github.dev` origins is convenient for Codespaces, but it is wider than a tightly-scoped development policy and is not profile-gated.
- **Potential impact on the system**: The origin policy is looser than necessary and easier to carry into production-like deployments by accident.
- **Recommended fix**: Restrict the policy by profile and/or narrow the allow-list to the exact development host pattern in use.
- **Suggested validation**: Add CORS tests or manual preflight checks for dev and non-dev profiles to ensure only intended origins are accepted.

## 5. Performance Issues

### Finding PI-1: Board hydration uses an N+1 HTTP request pattern

- **Severity**: Medium
- **Area**: Performance
- **File path**: `react-web/frontend/src/features/planos/PlanoBoardPage.jsx`
- **Code snippet**:
  ```jsx
  const planoData = await fetchPlano();
  if (planoData) {
    const listasData = await fetchListas();
    if (listasData) {
      await fetchAllCartoes(listasData);
    }
  }
  ```
  ```jsx
  const results = await Promise.allSettled(
    listasData.map((l) => apiClient.get(`/cartoes/perfil/${perfilId}/lista/${l.id}`))
  );
  ```
- **Clear explanation of the problem**: Loading a board requires one request for the plan, one for the lists, then one request per list for cards.
- **Potential impact on the system**: Larger boards accumulate latency and server load quickly, especially over higher-latency networks.
- **Recommended fix**: Add an aggregate board endpoint (for example, plan + lists + cards in one payload) or support batched card fetches by plan.
- **Refactored code example**:
  ```java
  GET /api/v1/planos/me/{planoId}/board
  ```
- **Suggested validation**: Compare network waterfalls for a board with many lists before and after introducing the aggregate endpoint.

### Finding PI-2: Mutations repeatedly re-fetch whole collections

- **Severity**: Medium
- **Area**: Performance
- **File path**:
  - `react-web/frontend/src/features/planos/PlanosPage.jsx`
  - `react-web/frontend/src/features/planos/PlanoBoardPage.jsx`
- **Code snippet**:
  ```jsx
  await apiClient.post(`/planos/perfil/${perfilId}`, data);
  await fetchPlanos();
  ```
  ```jsx
  await apiClient.delete(`/listas/perfil/${perfilId}/${lista.id}`);
  const listasData = await fetchListas();
  if (listasData) await fetchAllCartoes(listasData);
  ```
- **Clear explanation of the problem**: Simple create, update, and delete operations are followed by full list or board rehydration instead of a targeted state update.
- **Potential impact on the system**: Normal user interactions cost extra requests and make the UI feel slower than necessary.
- **Recommended fix**: Use mutation responses to update local state directly or introduce a query cache that invalidates only the affected slice.
- **Suggested validation**: Measure request counts for create/edit/delete on plans, lists, and cards before and after the change.

### Finding PI-3: Wallpaper images are stored as base64 strings in the primary database

- **Severity**: Medium
- **Area**: Performance
- **File path**:
  - `react-web/frontend/src/features/planos/components/PlanoFormModal.jsx`
  - `react-web/backend/src/main/resources/db/migration/V3__expand_wallpaper_url.sql`
  - `react-web/backend/src/main/java/com/projectmanager/planthings/model/dto/PlanoRequest.java`
- **Code snippet**:
  ```jsx
  resolve(canvas.toDataURL("image/jpeg", IMAGE_QUALITY));
  ```
  ```sql
  ALTER TABLE dbo.Plano ALTER COLUMN wallpaper_url VARCHAR(MAX) NULL;
  ```
- **Clear explanation of the problem**: The frontend converts uploaded images into base64 data URLs and stores them in `wallpaper_url`, and the schema was widened to `VARCHAR(MAX)` to support that choice.
- **Potential impact on the system**: Base64 inflates payload size, increases database storage, and makes plan list responses heavier than they need to be.
- **Recommended fix**: Move binary media to object storage (or keep preset IDs / external URLs only) and store a small reference in the database.
- **Suggested validation**: Compare average response payload size and row size before and after moving image storage out of the main table.

## 6. Dependency Problems

### Finding DP-1: Frontend lint does not cover the actual application source

- **Severity**: High
- **Area**: Dependency / Configuration
- **File path**:
  - `react-web/frontend/eslint.config.js`
  - `react-web/frontend/src/`
- **Code snippet**:
  ```js
  files: ["**/*.{ts,tsx}"]
  ```
- **Clear explanation of the problem**: The ESLint config only targets TypeScript files, but the frontend source is almost entirely `.jsx` plus one `.js` file. The only `.ts` file in `src` is `vite-env.d.ts`, and there are no `.tsx` files.
- **Potential impact on the system**: `npm run lint` reports green status while skipping nearly all runtime code, which creates false confidence in the quality gate.
- **Recommended fix**: Expand the config to include `js` and `jsx` files and configure React linting for the current codebase.
- **Refactored code example**:
  ```js
  files: ["**/*.{js,jsx,ts,tsx}"]
  ```
- **Suggested validation**: Intentionally introduce a lint error in a `.jsx` file and verify `npm run lint` fails.

### Finding DP-2: The frontend manifest still contains large sets of unused template dependencies

- **Severity**: Medium
- **Area**: Dependency / Configuration
- **File path**: `react-web/frontend/package.json`
- **Code snippet**:
  ```json
  {
    "@dnd-kit/core": "^6.3.1",
    "@tanstack/react-query": "^5.83.0",
    "next-themes": "^0.3.0",
    "sonner": "^1.7.4"
  }
  ```
- **Clear explanation of the problem**: Searches across `react-web/frontend/src` found no imports for `@dnd-kit/`, `@radix-ui/`, `@tanstack/react-query`, `recharts`, `next-themes`, `sonner`, `vaul`, `cmdk`, `embla-carousel-react`, `input-otp`, or `react-resizable-panels`. The board page also implements custom pointer-based drag-and-drop instead of using the installed `@dnd-kit` packages.
- **Potential impact on the system**: Install size, audit surface, and maintenance overhead are all larger than necessary.
- **Recommended fix**: Remove unused template dependencies or adopt them intentionally and consistently.
- **Suggested validation**: Prune dependencies incrementally and re-run `npm run build` after each cleanup batch.

## 7. Testing Gaps

### Finding TG-1: The frontend has no automated tests

- **Severity**: High
- **Area**: Testing
- **File path**: `react-web/frontend/src/` (no matching `*.test.*` or `*.spec.*` files found)
- **Clear explanation of the problem**: There are no frontend unit, component, or end-to-end tests in the repository, including for login, registration, plans CRUD, profile editing, or board behavior.
- **Potential impact on the system**: The application relies on manual verification for its most interactive flows, which is especially risky in the large `planos` module.
- **Recommended fix**: Add a frontend test stack and begin with critical-path coverage: login, registration, plan CRUD, and board reorder/error handling.
- **Suggested validation**: Add the tests to CI and ensure failures block regressions in core flows.

### Finding TG-2: Backend tests do not validate production migrations or database-specific behavior

- **Severity**: High
- **Area**: Testing
- **File path**:
  - `react-web/backend/src/test/resources/application-test.properties`
  - `react-web/backend/src/test/java/com/projectmanager/planthings/controller/PlanoControllerWebMvcTest.java`
  - `react-web/backend/src/test/java/com/projectmanager/planthings/model/services/PerfilServiceTest.java`
  - `react-web/backend/src/test/java/com/projectmanager/planthings/PlanthingsApplicationTests.java`
- **Code snippet**:
  ```properties
  spring.jpa.hibernate.ddl-auto=create-drop
  spring.flyway.enabled=false
  ```
- **Clear explanation of the problem**: The test profile disables Flyway and lets Hibernate generate the schema in H2. Controller tests mock the service layer, and service tests mock repositories. That means SQL Server migrations, triggers, constraints, and data-shape assumptions are not exercised by the current suite.
- **Potential impact on the system**: The existing `29` passing tests can miss migration drift, DB constraint regressions, and production-only persistence issues.
- **Recommended fix**: Add integration tests that run Flyway against a database that is close to production behavior (preferably Testcontainers with SQL Server, or a carefully-aligned substitute if that is not feasible).
- **Suggested validation**: Run integration tests that execute real migrations and hit actual controller -> service -> repository -> DB flows.

### Finding TG-3: Critical authorization and recovery paths have no coverage

- **Severity**: High
- **Area**: Testing
- **File path**:
  - `react-web/backend/src/test/java/com/projectmanager/planthings/controller/PerfilControllerWebMvcTest.java`
  - `react-web/backend/src/test/java/com/projectmanager/planthings/controller/PlanoControllerWebMvcTest.java`
  - `react-web/frontend/src/features/planos/PlanoBoardPage.jsx`
- **Clear explanation of the problem**: There are no automated tests covering cross-profile authorization, the password hashing strategy, or the board's failed reorder recovery path.
- **Potential impact on the system**: The most security-sensitive and state-sensitive flows can regress silently.
- **Recommended fix**: Add targeted tests for cross-user denial, credential verification, and drag-drop failure rollback.
- **Suggested validation**: Include one negative authorization test and one failed reorder test before addressing lower-risk coverage gaps.

## 8. Refactoring Opportunities

### Opportunity RO-1: Move to authenticated `/me`-style APIs

- Replace client-supplied `perfilId` routes with authenticated-principal routes.
- Concentrate authorization in a security layer instead of repeating it through path parameters.
- This refactor removes the root cause behind the repository's highest-risk security issue.

### Opportunity RO-2: Introduce a board-specific backend DTO and shrink the board page

- Add a `BoardResponse` contract that returns the plan, its lists, and their cards in one payload.
- Split `PlanoBoardPage.jsx` into smaller hooks/components that consume that DTO.
- This reduces request count, complexity, and error handling duplication at the same time.

### Opportunity RO-3: Standardize API DTOs and mapping across all controllers

- Bring `PerfilController` in line with the rest of the API by using request/response DTOs.
- Centralize mapping so controllers stay thin and entity changes do not leak outward.

### Opportunity RO-4: Consolidate modal and destructive-action infrastructure

- Create a shared modal wrapper and a shared destructive-action pattern that always states blast radius.
- Reuse it for plan, list, card, and profile deletion flows.

### Opportunity RO-5: Remove template residue and dead files

- Delete `PlanooardPage.jsx`.
- Remove unused frontend packages and any generated template surface that is not part of the product.
- Repair broken README links so the repository map is trustworthy again.

## Closing Summary

### Most critical issues discovered

1. The backend trusts a client-supplied `perfilId`, so authorization is effectively controlled by the client.
2. Database fallback credentials are committed in `application.properties`.
3. Passwords are stored with unsalted SHA-256 instead of a password-specific hashing algorithm.
4. Frontend lint passes without linting the actual `.jsx` application code.
5. The current tests do not exercise Flyway migrations or real authorization boundaries.

### Prioritized fixes

#### High priority

- Add real backend authentication/authorization and stop trusting `perfilId` from the client.
- Rotate and remove committed database credentials; fail fast when env vars are missing.
- Replace SHA-256 password hashing with `PasswordEncoder` (bcrypt or Argon2) and migrate/reset existing passwords.
- Fix ESLint coverage so `.js/.jsx` source is actually linted.
- Add backend integration tests for migrations and authorization.
- Warn clearly about plan-level cascade deletes before any destructive operation.

#### Medium priority

- Implement the registration flow on the frontend.
- Replace the board's N+1 loading path with an aggregate endpoint.
- Add rollback/refetch behavior for failed drag-drop reorder operations.
- Reduce repeated full-board and full-list refetches after mutations.
- Remove unused frontend dependencies and dead placeholder files.

#### Low priority

- Convert `PerfilController` to DTO-based contracts.
- Standardize modal infrastructure and destructive-action copy.
- Repair missing documentation references in the README.

### Recommended refactoring roadmap

#### Stage 1 - Risk containment

- Secure authentication and authorization.
- Remove committed secrets and rotate affected credentials.
- Upgrade password hashing and add regression tests around login.
- Fix lint coverage so quality signals become trustworthy.

#### Stage 2 - Reliability hardening

- Add migration-aware integration tests.
- Add authorization denial tests and failed-reorder tests.
- Implement registration and improve destructive-action warnings.

#### Stage 3 - Maintainability and performance

- Add a board aggregate API.
- Split `PlanoBoardPage.jsx` into focused hooks/components.
- Remove dependency/template residue.
- Repair repository documentation so onboarding matches the codebase.
