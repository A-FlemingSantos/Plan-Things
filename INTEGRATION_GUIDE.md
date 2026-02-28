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

## Proxy do Vite (Desenvolvimento)

O frontend possui proxy configurado em `react-web/frontend/vite.config.js`:

- Todas as requisições para `/api` são encaminhadas automaticamente ao backend.
- O target é derivado de `VITE_API_URL` ou `http://localhost:8080` como fallback.

Isso significa que o frontend pode fazer chamadas relativas como `/api/v1/perfil` sem precisar lidar com CORS durante o desenvolvimento.

## Endpoints da API

### Perfil (`/api/v1/perfil`)

| Método | Path | Descrição |
|--------|------|-----------|
| GET | `/` | Listar perfis ativos |
| POST | `/` | Criar novo perfil |
| GET | `/{id}` | Buscar perfil por ID |
| PUT | `/{id}` | Atualizar perfil |
| DELETE | `/{id}` | Soft delete (inativar perfil) |
| POST | `/login` | Autenticação |

### Planos (`/api/v1/planos`)

| Método | Path | Descrição |
|--------|------|-----------|
| GET | `/perfil/{perfilId}` | Listar planos do perfil |
| GET | `/perfil/{perfilId}/{id}` | Buscar plano por ID |
| POST | `/perfil/{perfilId}` | Criar plano |
| PUT | `/perfil/{perfilId}/{id}` | Atualizar plano |
| DELETE | `/perfil/{perfilId}/{id}` | Remover plano |

### Listas (`/api/v1/listas`)

| Método | Path | Descrição |
|--------|------|-----------|
| GET | `/perfil/{perfilId}/plano/{planoId}` | Listar listas de um plano |
| GET | `/perfil/{perfilId}/{id}` | Buscar lista por ID |
| POST | `/perfil/{perfilId}/plano/{planoId}` | Criar lista |
| PUT | `/perfil/{perfilId}/{id}` | Atualizar lista |
| DELETE | `/perfil/{perfilId}/{id}` | Remover lista |

### Cartões (`/api/v1/cartoes`)

| Método | Path | Descrição |
|--------|------|-----------|
| GET | `/perfil/{perfilId}/lista/{listaId}` | Listar cartões de uma lista |
| GET | `/perfil/{perfilId}/{id}` | Buscar cartão por ID |
| DELETE | `/perfil/{perfilId}/{id}` | Remover cartão |

### Tarefas (`/api/v1/tarefas`)

| Método | Path | Descrição |
|--------|------|-----------|
| GET | `/perfil/{perfilId}/lista/{listaId}` | Listar tarefas de uma lista |
| GET | `/perfil/{perfilId}/{id}` | Buscar tarefa por ID |
| POST | `/perfil/{perfilId}/lista/{listaId}` | Criar tarefa |
| PUT | `/perfil/{perfilId}/{id}` | Atualizar tarefa |
| DELETE | `/perfil/{perfilId}/{id}` | Remover tarefa |

### Eventos (`/api/v1/eventos`)

| Método | Path | Descrição |
|--------|------|-----------|
| GET | `/perfil/{perfilId}/lista/{listaId}` | Listar eventos de uma lista |
| GET | `/perfil/{perfilId}/{id}` | Buscar evento por ID |
| POST | `/perfil/{perfilId}/lista/{listaId}` | Criar evento |
| PUT | `/perfil/{perfilId}/{id}` | Atualizar evento |
| DELETE | `/perfil/{perfilId}/{id}` | Remover evento |

## Modelo de Dados (Resumo)

```
Perfil (1) ──> (N) Plano (1) ──> (N) Lista (1) ──> (N) Cartão
                                                         ├── Tarefa (data_conclusao)
                                                         └── Evento (data_inicio, data_fim)
```

- `Tarefa` e `Evento` são subtipos de `Cartão` (herança JPA `SINGLE_TABLE`).
- `Perfil` usa soft delete (`cod_status`); todos os outros usam hard delete com `ON DELETE CASCADE`.
