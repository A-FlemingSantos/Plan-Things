# Guia de Integração Frontend-Backend

## Visão Geral

Este projeto integra um frontend React (Vite) com backend Spring Boot e banco SQL Server via Flyway.

- Frontend: `react-web/frontend`
- Backend: `react-web/backend`
- Migrações SQL: `react-web/backend/src/main/resources/db/migration`

## Estado Atual da Integração

### Backend

- API REST disponível em `/api/v1`.
- Persistência com Spring Data JPA + Hibernate.
- Migração de schema controlada por Flyway (`V1__init_schema.sql`).
- `ddl-auto=validate` para garantir aderência entre entidades e banco.
- `open-in-view=false`.
- Naming físico fixado para preservar nomes SQL (`PhysicalNamingStrategyStandardImpl`).

### Segurança e Consistência

- Senha de `Perfil` armazenada como hash SHA-256 em `VARBINARY(32)`.
- Soft delete em `Perfil` via `cod_status`.
- Leitura de perfis no serviço considera apenas ativos (`cod_status=true`).

### CORS

Configuração global em `react-web/backend/src/main/java/com/projectmanager/planthings/config/CorsConfig.java`:

- `http://localhost:5173`
- `https://*.github.dev`
- Métodos: `GET, POST, PUT, PATCH, DELETE, OPTIONS`

## Configuração de Ambiente

### Backend (`application.properties`)

As credenciais podem ser fornecidas por variáveis de ambiente:

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`

Se não forem informadas, o backend usa os valores fallback definidos no arquivo.

### Profiles e Portas

- Sem profile: porta `8080`
- Profile `local`: porta `8081` (arquivo `application-local.properties`)

Executar com profile local:

```bash
cd react-web/backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

## Frontend e API Base URL

Arquivo: `react-web/frontend/src/lib/api.js`

Ordem de resolução da URL da API:

1. `VITE_API_URL` (se definida)
2. Host dinâmico para Codespaces (`*.app.github.dev`) com porta backend
3. Fallback local: `http://localhost:8080/api/v1`

## Como Subir o Projeto

### 1) Backend

```bash
cd react-web/backend
./mvnw spring-boot:run
```

### 2) Frontend

```bash
cd react-web/frontend
npm run dev
```

## Validação Rápida

1. Confirmar backend ativo (`8080` ou `8081`, conforme profile).
2. Acessar frontend (`5173`).
3. Testar cadastro/login de perfil.
4. Verificar logs do backend para chamadas `/api/v1/*`.

## Troubleshooting

- `ERR_CONNECTION_REFUSED`: backend não iniciado ou porta incorreta.
- Erro CORS: conferir domínio de origem e profile/porta da API.
- Falha de startup JPA/Flyway: conferir `DB_URL`, credenciais e schema remoto.
- Porta ocupada (`8080`): usar profile `local` (`8081`) ou liberar a porta.
