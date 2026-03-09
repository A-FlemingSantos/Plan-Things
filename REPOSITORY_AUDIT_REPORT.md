# Repository Audit Report

## Scope and method

This audit covered the entire repository under `/workspaces/Plan-Things`, including:

- `react-web/frontend` (React/Vite UI)
- `react-web/backend` (Spring Boot API)
- root documentation and developer configuration (`README.md`, `.devcontainer`, `.vscode`, `.github`)

### Baseline validation

- Frontend baseline passed: `cd react-web/frontend && npm ci && npm run lint && npm run build`
- Backend baseline passed: `cd react-web/backend && ./mvnw test` (`29` tests passed)
- The frontend install step reported `12 vulnerabilities (5 moderate, 7 high)` and the production build emitted a `403.57 kB` JS bundle.

---

## 1. Architecture Review

### What is working well

- The repository split is easy to understand: a React frontend and a Spring Boot backend with clear top-level boundaries.
- The backend mostly follows a consistent `controller -> service -> repository -> entity/dto` structure.
- Flyway migrations, custom exception types, and repository methods scoped by ownership show good intent.
- The frontend feature folders (`auth`, `perfil`, `planos`, `homepage`) are clearer than a flat component tree.

### Findings

### [CRITICAL] Authentication and authorization boundaries are missing across the stack
**Files:**
- `react-web/backend/pom.xml:32-84`
- `react-web/backend/src/main/java/com/projectmanager/planthings/controller/PerfilController.java:62-76`
- `react-web/backend/src/main/java/com/projectmanager/planthings/model/dto/LoginResponse.java:3-71`
- `react-web/backend/src/main/java/com/projectmanager/planthings/controller/PlanoController.java:23-50`
- `react-web/frontend/src/contexts/AuthContext.jsx:28-67`

**Evidence:**
```java
@PostMapping("/login")
public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
    Perfil perfil = perfilService.login(loginRequest.getEmail(), loginRequest.getSenha());
    return ResponseEntity.ok(new LoginResponse(
        perfil.getId(),
        perfil.getEmail(),
        perfil.getNome(),
        perfil.getSobrenome(),
        perfil.getTelefone(),
        "Login realizado com sucesso"
    ));
}
```

```java
@GetMapping("/perfil/{perfilId}")
public ResponseEntity<List<PlanoResponse>> findAllByPerfil(@PathVariable Long perfilId)
```

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

**Problem:**
The backend does not establish an authenticated principal after login. The frontend only stores profile data in `localStorage`, and every protected API call trusts a client-supplied `perfilId` path parameter.

**Impact on the system:**
This is broken access control / IDOR at the architecture level. Anyone who can guess or enumerate IDs can request, modify, reorder, or delete another user's resources.

**Recommended fix:**
Introduce Spring Security with JWT or server sessions, derive the current user from the authenticated principal, and stop trusting caller-provided profile IDs for authorization.

**Example of refactored code:**
```java
@GetMapping("/me/planos")
public ResponseEntity<List<PlanoResponse>> findMine(Authentication authentication) {
    PerfilPrincipal principal = (PerfilPrincipal) authentication.getPrincipal();
    Long perfilId = principal.getId();
    return ResponseEntity.ok(planoService.findAllByPerfilId(perfilId)
        .stream()
        .map(this::toResponse)
        .toList());
}
```

### [HIGH] `PerfilController` bypasses the DTO boundary used by the rest of the API
**Files:**
- `react-web/backend/src/main/java/com/projectmanager/planthings/controller/PerfilController.java:31-58`
- `react-web/backend/src/main/java/com/projectmanager/planthings/model/entity/Perfil.java:14-56`

**Evidence:**
```java
@PostMapping
public ResponseEntity<Perfil> save(@Valid @RequestBody Perfil perfil)

@PutMapping("/{id}")
public ResponseEntity<Perfil> update(@PathVariable Long id, @Valid @RequestBody Perfil perfil)
```

**Problem:**
Most controllers use dedicated request/response DTOs, but `PerfilController` accepts and returns the JPA entity directly. That couples the external contract to the persistence model and makes fields like `codStatus` part of the API shape.

**Impact on the system:**
This increases accidental exposure risk, makes schema evolution harder, and produces inconsistent API design between profile endpoints and the rest of the backend.

**Recommended fix:**
Create `PerfilRequest`, `PerfilUpdateRequest`, and `PerfilResponse` DTOs and map them explicitly like the other controllers.

---

## 2. Code Quality Problems

### [HIGH] The frontend lint command does not cover the actual application source
**Files:**
- `react-web/frontend/package.json:6-12`
- `react-web/frontend/eslint.config.js:7-25`
- `react-web/frontend/src/**/*.jsx`

**Evidence:**
```js
export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
```

Most frontend source files are `.jsx` (`App.jsx`, `PlanosPage.jsx`, `PlanoBoardPage.jsx`, `LoginPage.jsx`, etc.), but the flat config only targets `ts` and `tsx` files.

**Problem:**
`npm run lint` succeeds without meaningfully checking most of the real frontend code.

**Impact on the system:**
Unused variables, accidental globals, invalid hooks usage in `.jsx`, and other defects can slip through despite a green lint step.

**Recommended fix:**
Add a JS/JSX config block (or migrate the app to TypeScript) so the lint command covers the files that actually ship.

**Example of refactored code:**
```js
export default tseslint.config(
  { ignores: ["dist"] },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: { ecmaVersion: 2020, globals: globals.browser },
    plugins: { "react-hooks": reactHooks, "react-refresh": reactRefresh },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    },
  },
);
```

### [HIGH] The board feature is concentrated in one very large page component and stale duplicates remain
**Files:**
- `react-web/frontend/src/features/planos/PlanoBoardPage.jsx:1-1003`
- `react-web/frontend/src/features/planos/PlanooardPage.jsx:1-31`
- `react-web/frontend/src/features/planos/ListaPage.jsx:4-30`

**Evidence:**
- `PlanoBoardPage.jsx` owns page data loading, drag-and-drop, modal orchestration, keyboard handlers, DOM measurement, optimistic UI, and toast logic in one file.
- `PlanooardPage.jsx` is a typo-named duplicate placeholder.
- `ListaPage.jsx` is still a public placeholder route: `Lista #{listaId} — será implementada na Etapa 3`.

**Problem:**
The core planning experience is hard to reason about, hard to test, and already has stale or duplicate artifacts around it.

**Impact on the system:**
Board changes will keep getting riskier, code review cost will rise, and dead files/routes will continue to confuse future contributors.

**Recommended fix:**
Split the board into smaller hooks/components (`useBoardData`, `useCardDnD`, `BoardHeader`, `BoardCanvas`, modal modules), delete `PlanooardPage.jsx`, and either implement or remove placeholder routes.

### [MEDIUM] Repository documentation is already out of sync with the codebase
**Files:**
- `README.md:113-115`
- `react-web/frontend/README.md:39-58`

**Evidence:**
```md
- Guia de integração: [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)
```

```md
Veja detalhes de resolução dinâmica em [`src/lib/api.js`](src/lib/api.js).
```

The root README links to a file that does not exist, and the frontend README references `src/lib/api.js` plus a folder structure (`pages`, `hooks`, `assets`) that no longer matches the current `features` / `contexts` layout.

**Problem:**
The documentation no longer reflects the repository the team is actually maintaining.

**Impact on the system:**
Onboarding becomes slower, local setup is less trustworthy, and reviewers can draw the wrong conclusions about where core logic lives.

**Recommended fix:**
Update both READMEs to match the current source tree and remove or restore the broken integration guide link.

### [MEDIUM] Unexpected backend failures are swallowed without logging
**Files:**
- `react-web/backend/src/main/java/com/projectmanager/planthings/exception/GlobalExceptionHandler.java:49-52`

**Evidence:**
```java
@ExceptionHandler(Exception.class)
public ResponseEntity<ApiErrorResponse> handleUnexpected(Exception ex, HttpServletRequest request) {
    return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Erro interno no servidor", request.getRequestURI());
}
```

**Problem:**
The handler standardizes the response, but it never logs the exception.

**Impact on the system:**
Production incidents become harder to diagnose because the server loses stack traces and request context exactly where unknown failures should be most visible.

**Recommended fix:**
Log the exception together with the path and request metadata before building the generic 500 response.

---

## 3. Bugs and Logical Errors

### [HIGH] The registration page is non-functional
**Files:**
- `react-web/frontend/src/features/auth/RegisterPage.jsx:3-31`

**Evidence:**
```jsx
<form className="space-y-5">
  <input id="name" type="text" placeholder="Seu nome" className="auth-input" />
  <input id="email" type="email" placeholder="seuemail@empresa.com" className="auth-input" />
  <input id="password" type="password" placeholder="Crie uma senha segura" className="auth-input" />
  <button type="submit" className="glass-button-primary w-full py-3.5 rounded-xl text-white font-medium">
    Criar conta
  </button>
</form>
```

**Problem:**
There is no submit handler, no validation, and no API call. The route exists, but account creation does not.

**Impact on the system:**
New users cannot self-register, and the product's public onboarding path is effectively broken.

**Recommended fix:**
Implement the same level of form handling used by `LoginPage` (`react-hook-form`, Zod validation, submit/loading/error state, and backend integration).

### [HIGH] Profile email edits appear to succeed in the UI, but the backend ignores them
**Files:**
- `react-web/frontend/src/features/perfil/PerfilPage.jsx:269-279`
- `react-web/backend/src/main/java/com/projectmanager/planthings/model/services/PerfilService.java:47-57`

**Evidence:**
```jsx
const payload = {
  nome: nome.trim(),
  sobrenome: sobrenome.trim() || null,
  telefone: telefone.trim() || null,
  email: email.trim(),
};
const { data } = await apiClient.put(`/perfil/${perfilId}`, payload);
```

```java
perfilExistente.setNome(perfil.getNome());
perfilExistente.setSobrenome(perfil.getSobrenome());
perfilExistente.setTelefone(perfil.getTelefone());
if (perfil.getSenhaTexto() != null && !perfil.getSenhaTexto().isBlank()) {
    perfilExistente.setSenha(hashSenha(perfil.getSenhaTexto()));
}
```

**Problem:**
The frontend exposes `email` as editable and sends it, but the backend service never applies the new email.

**Impact on the system:**
Users receive a success state for a change that never persisted. That also leaves login identity and profile UI out of sync.

**Recommended fix:**
Either support email updates with uniqueness validation or make email read-only in the UI and contract.

**Example of refactored code:**
```java
if (!perfilExistente.getEmail().equals(perfil.getEmail())
        && perfilRepository.findByEmail(perfil.getEmail()).isPresent()) {
    throw new ConflictException("Email já cadastrado no sistema");
}
perfilExistente.setEmail(perfil.getEmail());
```

### [MEDIUM] Board card-load failures are silently rendered as empty data
**Files:**
- `react-web/frontend/src/features/planos/PlanoBoardPage.jsx:125-139`
- `react-web/frontend/src/features/planos/PlanoBoardPage.jsx:155-166`

**Evidence:**
```jsx
try {
  const res = await apiClient.get(`/cartoes/perfil/${perfilId}/lista/${listaId}`);
  setCartoesMap((prev) => ({ ...prev, [listaId]: res.data }));
} catch {
  setCartoesMap((prev) => ({ ...prev, [listaId]: [] }));
}
```

```jsx
newMap[l.id] =
  results[i].status === "fulfilled" ? results[i].value.data : [];
```

**Problem:**
When the backend fails, the UI silently converts the error into an empty list instead of surfacing a partial failure.

**Impact on the system:**
Real backend or network problems look like missing cards. That can lead users to create duplicates or assume data was deleted.

**Recommended fix:**
Track per-list load errors, render a retry state, and avoid using `[]` as the fallback for failed requests.

### [MEDIUM] Post-login navigation ignores the originally requested route
**Files:**
- `react-web/frontend/src/components/PrivateRoute.jsx:16-18`
- `react-web/frontend/src/features/auth/LoginPage.jsx:45-46`

**Evidence:**
```jsx
return <Navigate to="/login" state={{ from: location }} replace />;
```

```jsx
login(response.data);
navigate("/app/planos", { replace: true });
```

**Problem:**
The guard stores the intended destination, but the login page ignores it and always redirects to `/app/planos`.

**Impact on the system:**
Deep links into the authenticated area do not resume correctly after login.

**Recommended fix:**
Read `location.state?.from` in the login page and redirect there after a successful authentication.

### [MEDIUM] Card ordering has no server-side integrity guarantee under concurrent writes
**Files:**
- `react-web/backend/src/main/java/com/projectmanager/planthings/model/services/CartaoService.java:51-91`
- `react-web/backend/src/main/resources/db/migration/V1__init_schema.sql:57-71`
- `react-web/backend/src/main/resources/db/migration/V2__add_posicao_to_cartao.sql:1-15`

**Evidence:**
```java
public int getNextPosicao(Long listaId) {
    return (int) cartaoRepository.countByListaId(listaId);
}
```

```java
for (ReorderRequest.CardPosition pos : positions) {
    Cartao cartao = cartaoMap.get(pos.getCardId());
    Lista lista = listaMap.get(pos.getListaId());
    cartao.setLista(lista);
    cartao.setPosicao(pos.getPosicao());
}
```

**Problem:**
New cards derive `posicao` from a simple count, and reorders accept arbitrary position values without uniqueness or contiguity checks. There is also no unique DB constraint on `(lista_id, posicao)`.

**Impact on the system:**
Concurrent creates/reorders can produce duplicate positions or unstable ordering.

**Recommended fix:**
Validate reorder payloads, add a unique index on `(lista_id, posicao)`, and use a safer sequence/allocation strategy for new positions.

---

## 4. Security Risks

### [CRITICAL] Database host and fallback credentials are committed in source control
**Files:**
- `react-web/backend/src/main/resources/application.properties:4-8`
- `README.md:17-42`

**Evidence:**
```properties
spring.datasource.url=${DB_URL:jdbc:sqlserver://Plan_Things_db.mssql.somee.com;databaseName=Plan_Things_db;encrypt=true;trustServerCertificate=true}
spring.datasource.username=${DB_USERNAME:Artfl}
spring.datasource.password=${DB_PASSWORD:12345678}
```

**Problem:**
The application has a live-looking remote SQL Server host, a username, and a fallback password in the committed default configuration. `trustServerCertificate=true` also weakens TLS verification.

**Impact on the system:**
This risks unauthorized database access, accidental writes against the shared remote database, and long-term credential leakage in git history.

**Recommended fix:**
Remove the fallbacks, rotate the exposed credentials, require environment variables for all non-test database access, and avoid `trustServerCertificate=true` unless there is a narrowly justified local-dev case.

### [HIGH] Password hashing is too weak for user credentials
**Files:**
- `react-web/backend/src/main/java/com/projectmanager/planthings/model/services/PerfilService.java:66-87`

**Evidence:**
```java
MessageDigest digest = MessageDigest.getInstance("SHA-256");
return digest.digest(senhaPura.getBytes(StandardCharsets.UTF_8));
```

**Problem:**
Passwords are hashed with a fast unsalted SHA-256 digest.

**Impact on the system:**
If the database is exposed, attackers can crack many passwords quickly with commodity hardware and common rainbow-table techniques.

**Recommended fix:**
Use a purpose-built password hasher such as BCrypt, PBKDF2, or Argon2, and migrate existing hashes.

### [HIGH] The API exposes all active profiles without any protection
**Files:**
- `react-web/backend/src/main/java/com/projectmanager/planthings/controller/PerfilController.java:31-35`

**Evidence:**
```java
@GetMapping
public ResponseEntity<List<Perfil>> findAll() {
    return ResponseEntity.ok(perfilService.findAll());
}
```

**Problem:**
The endpoint returns all active profiles and is not protected by any server-side authentication layer.

**Impact on the system:**
An unauthenticated caller can enumerate users and collect personal data such as email, name, surname, and phone.

**Recommended fix:**
Remove the endpoint from public use or protect it with authenticated admin-only access and a narrow response DTO.

### [MEDIUM] CORS is too broad for credentialed requests
**Files:**
- `react-web/backend/src/main/java/com/projectmanager/planthings/config/CorsConfig.java:17-25`

**Evidence:**
```java
.allowedOriginPatterns(
    "http://localhost:5173",
    "https://*.github.dev"
)
.allowedHeaders("*")
.allowCredentials(true);
```

**Problem:**
Credentialed requests are allowed from any `*.github.dev` subdomain and any request headers.

**Impact on the system:**
The attack surface is wider than necessary for development, especially in shared/public Codespaces-style environments.

**Recommended fix:**
Externalize the allowed origins by environment and keep the allowlist as narrow as possible.

### [LOW] SQL logging is enabled in the default application profile
**Files:**
- `react-web/backend/src/main/resources/application.properties:8`

**Evidence:**
```properties
spring.jpa.show-sql=true
```

**Problem:**
SQL statements are logged by default outside the dedicated test profile.

**Impact on the system:**
This can leak sensitive query contents to logs and adds noise/performance cost in non-local environments.

**Recommended fix:**
Disable SQL logging by default and enable it only in a local development profile.

---

## 5. Performance Issues

### [MEDIUM] Board loading uses an N+1 request pattern
**Files:**
- `react-web/frontend/src/features/planos/PlanoBoardPage.jsx:145-170`

**Evidence:**
```jsx
const results = await Promise.allSettled(
  listasData.map((l) =>
    apiClient.get(`/cartoes/perfil/${perfilId}/lista/${l.id}`)
  )
);
```

**Problem:**
Loading one board triggers one request for the plan, one for the lists, and then one extra request per list for cards.

**Impact on the system:**
Board latency grows with the number of lists and creates unnecessary network chatter.

**Recommended fix:**
Add a board endpoint that returns the plan, lists, and cards in one payload or in fewer coarse-grained requests.

### [MEDIUM] Drag-and-drop performs repeated DOM queries in hot pointer-move paths
**Files:**
- `react-web/frontend/src/features/planos/PlanoBoardPage.jsx:374-415`
- `react-web/frontend/src/features/planos/PlanoBoardPage.jsx:533-540`

**Evidence:**
```jsx
const columns = canvas.querySelectorAll("[data-lista-id]");
...
const col = canvas.querySelector(`[data-lista-id="${listaId}"]`);
...
const idx = getDropIndex(targetId, clientY);
```

**Problem:**
The page repeatedly scans the DOM while the pointer is moving.

**Impact on the system:**
Large boards are more likely to feel janky during drag interactions.

**Recommended fix:**
Cache measurements/refs during drag start or adopt a dedicated drag-and-drop library that already optimizes these paths.

### [LOW] The frontend build is already heavier than it needs to be
**Files:**
- Baseline build output from `cd react-web/frontend && npm ci && npm run lint && npm run build`

**Evidence:**
```text
dist/assets/index-mx_FDK09.js   403.57 kB │ gzip: 116.04 kB
```

**Problem:**
The app currently ships one large main bundle with no route-level code splitting.

**Impact on the system:**
Authenticated pages, homepage assets, and board logic all cost the initial load more than necessary.

**Recommended fix:**
Lazy-load authenticated pages/components and remove unused dependencies.

---

## 6. Dependency Issues

### [HIGH] Frontend dependencies need security triage
**Files:**
- `react-web/frontend/package.json`
- `react-web/frontend/package-lock.json`
- Baseline install output from `npm ci`

**Evidence:**
```text
12 vulnerabilities (5 moderate, 7 high)
```

**Problem:**
The current Node dependency tree already reports known issues during a clean install.

**Impact on the system:**
Shipping or developing on top of untriaged vulnerable dependencies increases both runtime and supply-chain risk.

**Recommended fix:**
Run `npm audit`, upgrade or replace vulnerable packages, and automate dependency scanning in CI.

### [MEDIUM] The frontend tracks two lockfiles
**Files:**
- `react-web/frontend/package-lock.json`
- `react-web/frontend/bun.lockb`

**Evidence:**
Both files are tracked in git.

**Problem:**
The project currently advertises npm commands, but Bun's lockfile is also committed.

**Impact on the system:**
Two lockfiles increase the chance that different contributors install different dependency trees.

**Recommended fix:**
Standardize on one package manager or explicitly document which lockfile is authoritative.

### [LOW] Unused packages add maintenance and bundle surface area
**Files:**
- `react-web/frontend/package.json:45`
- `react-web/frontend/vite.config.js:4,114-117`

**Evidence:**
- `@tanstack/react-query` is declared in `package.json` but has no imports in `react-web/frontend/src`.
- `lovable-tagger` is only used as a dev plugin in Vite.

**Problem:**
The repository carries dependencies that are not currently contributing to shipped functionality.

**Impact on the system:**
Unused packages still need updates and can bloat the dependency graph.

**Recommended fix:**
Remove unused packages or put them into active use intentionally.

---

## 7. Test Gaps

### [HIGH] There are no automated frontend tests
**Files:**
- `react-web/frontend/package.json:6-12`
- `react-web/frontend/src/`

**Evidence:**
There is no frontend test script in `package.json`, and no frontend `*.test.*` or `*.spec.*` files were found under `react-web/frontend/src`.

**Problem:**
Critical UI flows ship without automated verification.

**Impact on the system:**
The broken registration page and the profile email mismatch both reached the current codebase without any failing test catching them.

**Recommended fix:**
Add a frontend test runner (for example, Vitest + Testing Library) and cover login, registration, profile update, and board behavior first.

### [HIGH] Backend tests do not validate Flyway migrations or SQL Server-specific behavior
**Files:**
- `react-web/backend/src/test/resources/application-test.properties:1-7`
- `react-web/backend/src/main/resources/db/migration/V1__init_schema.sql:1-153`
- `react-web/backend/src/main/resources/db/migration/V2__add_posicao_to_cartao.sql:1-15`

**Evidence:**
```properties
spring.datasource.url=jdbc:h2:mem:planthings_test;MODE=MSSQLServer;DB_CLOSE_DELAY=-1;DATABASE_TO_UPPER=false
spring.jpa.hibernate.ddl-auto=create-drop
spring.flyway.enabled=false
```

**Problem:**
The green backend test suite does not exercise the actual Flyway migrations, SQL Server triggers, or SQL Server-specific DDL/runtime behavior.

**Impact on the system:**
Migration bugs can still break production even while the test suite remains green.

**Recommended fix:**
Add a Testcontainers-based SQL Server integration test profile with Flyway enabled and run it in CI.

### [MEDIUM] There is no CI workflow enforcing repository health
**Files:**
- `.github/` (only `.github/copilot-instructions.md` is present)

**Evidence:**
No `.github/workflows/*.yml` files were found.

**Problem:**
The repository has no automated pull-request gate for frontend lint/build, backend tests, or dependency scanning.

**Impact on the system:**
Broken builds, vulnerable dependencies, and regressions rely entirely on manual discovery.

**Recommended fix:**
Add GitHub Actions for frontend lint/build, backend tests, and dependency/security checks.

---

## 8. Refactoring Opportunities

### Priority 1: Stabilize security boundaries
1. Add Spring Security and real authenticated sessions/JWTs.
2. Remove hardcoded database fallbacks and rotate exposed credentials.
3. Replace SHA-256 password hashing with BCrypt/Argon2/PBKDF2.
4. Remove or lock down profile enumeration endpoints.

### Priority 2: Fix broken user flows and API contracts
1. Implement registration end-to-end.
2. Resolve the profile email update mismatch.
3. Preserve the originally requested route after login.
4. Replace entity-based `PerfilController` contracts with DTOs.

### Priority 3: Reduce frontend complexity and failure ambiguity
1. Split `PlanoBoardPage.jsx` into data, DnD, and presentational modules.
2. Delete `PlanooardPage.jsx` and either implement or remove placeholder routes.
3. Add explicit error states for per-list card load failures.
4. Introduce a board aggregate endpoint to avoid N+1 requests.

### Priority 4: Improve engineering feedback loops
1. Make ESLint cover the actual JS/JSX frontend code.
2. Add frontend tests for auth/profile flows.
3. Add SQL Server integration tests with Flyway enabled.
4. Add CI workflows and dependency scanning.
5. Refresh repository documentation so setup and architecture docs match reality.

---

## 9. Final Summary

### Most critical problems
1. The application does not enforce authentication/authorization on the server; resource ownership is based on caller-supplied IDs.
2. Database connection defaults with a public host and fallback credentials are committed in source control.
3. User passwords are hashed with unsalted SHA-256.
4. Public registration is broken, and profile editing currently reports a successful email change that never persists.
5. Frontend quality and test gates do not cover the code that matters most.

### Prioritized list of fixes

#### High priority
- Implement real backend authentication/authorization.
- Remove and rotate hardcoded database credentials.
- Replace SHA-256 password hashing.
- Fix registration and profile update behavior.
- Make ESLint and automated tests cover the real frontend code.

#### Medium priority
- Split the board page and eliminate duplicate/placeholder artifacts.
- Replace N+1 board loading with an aggregate endpoint.
- Add SQL Server/Flyway integration tests.
- Add CI workflows for lint/build/test/audit.
- Restrict CORS and disable SQL logging by default.

#### Low priority
- Remove unused dependencies.
- Standardize on one frontend lockfile.
- Refresh README files and broken links.
- Add route-level code splitting for the frontend.

### Recommended refactoring roadmap
1. **Security stabilization sprint:** auth, password hashing, secrets removal, endpoint lockdown.
2. **Contract and UX sprint:** registration, profile updates, login redirect, DTO cleanup.
3. **Board maintainability sprint:** break up `PlanoBoardPage`, add clearer failure states, reduce request count.
4. **Reliability sprint:** frontend tests, SQL Server integration tests, CI workflows, dependency automation.
5. **Documentation cleanup sprint:** align READMEs and onboarding docs with the actual repository structure.
