# Plan-Things

Aplicação web para gestão de projetos de pequenas equipes.

## Estrutura

- `react-web/frontend`: app React (Vite + Tailwind + shadcn/ui)
- `react-web/backend`: API REST Spring Boot + JPA + Flyway + SQL Server

## Pré-requisitos

- Node.js 18+ e npm
- Java 17 (OpenJDK 17.0.18)
- Maven Wrapper (`./mvnw` já incluso no projeto)
- SQL Server (remoto ou local)

## Variáveis de ambiente (backend)

Para usar SQL Server, o backend aceita configuração de banco via variáveis:

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`

Essas variáveis continuam sendo a forma correta de apontar para um banco SQL Server real. Quando elas não são informadas durante o desenvolvimento local com `spring-boot:run`, o backend sobe com um fallback H2 em memória usando migrations alinhadas ao esquema principal.

Modelo disponível em `react-web/backend/.env.example`.

```bash
cd react-web/backend
cp .env.example .env
```

O backend agora tenta ler `react-web/backend/.env` automaticamente quando o arquivo existe. Então, para rodar com SQL Server, basta copiar o modelo e preencher os valores:

```bash
cd react-web/backend
./mvnw spring-boot:run
```

Se você não criar `.env`, o backend usa o fallback local H2 em memória.

Se preferir, você também pode exportar manualmente as variáveis antes de iniciar. No PowerShell (Windows):

```powershell
cd react-web/backend
Get-Content .env | ForEach-Object {
	if ($_ -match '^[^#][^=]+=') {
		$name, $value = $_ -split '=', 2
		[Environment]::SetEnvironmentVariable($name, $value)
	}
}
./mvnw.cmd spring-boot:run
```

## Variáveis de ambiente (frontend)

O frontend pode definir `VITE_API_URL` para sobrescrever a URL da API.

Para o fluxo autenticado, prefira usar a base `/api/v1` resolvida pelo Vite/Codespaces em vez de apontar para outra origem manualmente. As rotas protegidas agora dependem da sessao HTTP criada pelo backend.

Modelo disponível em `react-web/frontend/.env.example`.

```bash
cd react-web/frontend
cp .env.example .env
```

## Rodando o backend

Porta padrão (`8080`):

```bash
cd react-web/backend
./mvnw spring-boot:run
```

## Rodando o frontend

```bash
cd react-web/frontend
npm install
npm run dev
```

## Testes frontend

```bash
cd react-web/frontend
npm run test
```

## Banco e migrações

- Migrações Flyway ficam em `react-web/backend/src/main/resources/db/migration`.
- O schema inicial está em `V1__init_schema.sql`.
- O backend usa validação de schema (`ddl-auto=validate`) no startup.

## Testes backend

```bash
cd react-web/backend
./mvnw test
```

## Autenticacao

- `POST /api/v1/perfil/login` valida as credenciais e cria uma sessao HTTP no backend.
- `POST /api/v1/perfil/logout` invalida a sessao atual.
- As rotas protegidas deixaram de aceitar `perfilId` vindo do cliente e passaram a usar caminhos `/me`, com o perfil derivado da sessao autenticada no backend.

Exemplos:

- `GET /api/v1/perfil/me`
- `GET /api/v1/planos/me`
- `GET /api/v1/planos/me/{planoId}/board`
- `POST /api/v1/listas/me/plano/{planoId}`

## Endpoints principais da API

| Recurso  | Base Path        |
|----------|------------------|
| Perfil   | `/api/v1/perfil` |
| Planos   | `/api/v1/planos` |
| Listas   | `/api/v1/listas` |
| Cartões  | `/api/v1/cartoes`|
| Tarefas  | `/api/v1/tarefas`|
| Eventos  | `/api/v1/eventos`|

## Licença

[MIT](LICENSE) — © 2025 Arthur Fleming Santos
