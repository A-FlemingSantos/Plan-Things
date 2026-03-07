# Plan-Things Copilot Instructions

## Build, test, lint, and run commands

### Frontend (`react-web/frontend`)
- Install dependencies: `npm ci`
- Start dev server: `npm run dev`
- Lint: `npm run lint`
- Production build: `npm run build`
- There is currently no frontend test script in `package.json`.

### Backend (`react-web/backend`)
- Start API: `./mvnw spring-boot:run`
- Run all tests: `./mvnw test`
- Run one test class: `./mvnw -Dtest=PerfilServiceTest test`
- Run one test method: `./mvnw -Dtest=PerfilServiceTest#shouldFindActiveProfileById test`
- Build jar without rerunning tests: `./mvnw -DskipTests package`

### Environment setup that affects local development
- Backend database settings come from `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD`. Copy `react-web/backend/.env.example` to `.env` and export it before running `spring-boot:run`.
- Frontend can use `VITE_API_URL`, but `react-web/frontend/vite.config.js` already auto-resolves the backend URL for localhost and GitHub Codespaces. Prefer that path instead of hardcoding API hosts inside components.

## High-level architecture

- This repo is split into a React/Vite frontend in `react-web/frontend` and a Spring Boot API in `react-web/backend`.
- The frontend entrypoint is `src/App.jsx`, which wraps the router with `ThemeProvider` and `AuthProvider`. Public routes are `/`, `/login`, and `/cadastro`; authenticated routes live under `/app/*` and are gated by `PrivateRoute` plus `AuthenticatedLayout`.
- Frontend state is mostly page-local React state instead of a global server-state layer. In particular, `src/features/planos/PlanosPage.jsx` and `src/features/planos/PlanoBoardPage.jsx` fetch data with `apiClient`, keep `pageState` flags like `loading/success/error/empty`, and manage their own modal and toast state.
- `src/lib/apiClient.js` is the shared axios client. It resolves the base URL from Vite envs, normalizes backend errors for the UI, and clears the persisted session plus redirects to `/login` on HTTP 401.
- Frontend code is organized by feature under `src/features/*`. The `planos` feature is the main workflow and composes plans, lists, and cards by calling separate backend endpoints for each level of the hierarchy.
- On the backend, the main pattern is `controller -> model/services -> model/repository -> model/entity`, with request/response DTOs in `model/dto`. Controllers manually map DTOs to entities and responses instead of using a mapping library.
- Resource ownership is explicit throughout the API: routes include `perfilId`, repositories expose scoped methods such as `findByIdAndPerfilId(...)`, and services enforce active-profile/ownership checks before mutating data.
- Database schema changes live in Flyway migrations under `src/main/resources/db/migration`. Hibernate runs with `spring.jpa.hibernate.ddl-auto=validate`, so schema updates should be made through migrations instead of relying on JPA auto-DDL.
- `GlobalExceptionHandler` standardizes API error payloads, and the frontend surfaces `message` values directly to users through `normalizeError()`.
- Cards are a shared base concept split into `Tarefa` and `Evento`; SQL triggers in `V1__init_schema.sql` enforce that the same card ID cannot exist in both tables at once.

## Key conventions

- The domain model and user-facing copy are in Portuguese (`Perfil`, `Plano`, `Lista`, `Cartao`, `Tarefa`, `Evento`). Follow that naming in new classes, DTOs, endpoints, and UI text.
- Persisted frontend session/theme state uses `localStorage` keys with the `planthings_*` prefix, especially `planthings_session` and `planthings_theme`.
- Shared glassmorphism styling tokens such as `--glass-card-bg`, `--glass-border`, and `--glass-shadow` are defined in `src/features/homepage/styles/homepage-gemini.css` and reused by authenticated/auth/profile styling. Update the shared tokens before introducing new one-off glass values.
- Styling is a mix of Tailwind utilities and feature CSS files rather than a single pattern. Reuse the existing feature stylesheet for a screen before introducing a new global stylesheet.
- Backend validation belongs on request DTOs with Jakarta validation annotations and `@Valid`; backend failures should flow through the existing custom exceptions and `GlobalExceptionHandler` instead of ad-hoc controller responses.
- The frontend and backend are both Codespaces-aware. `vite.config.js` auto-configures the API target/HMR for Codespaces, and backend CORS already allows `https://*.github.dev`. Keep new local-dev behavior compatible with that setup.
