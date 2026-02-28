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

O backend aceita configuração de banco via variáveis:

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`

Se não forem definidas, os fallbacks de `application.properties` são usados.

Modelo disponível em `react-web/backend/.env.example`.

```bash
cd react-web/backend
cp .env.example .env
```

Como o Spring Boot não lê `.env` automaticamente, carregue no shell antes de iniciar:

```bash
cd react-web/backend
set -a
source .env
set +a
./mvnw spring-boot:run
```

No PowerShell (Windows):

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

Profile local (porta `8081`):

```bash
cd react-web/backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

## Rodando o frontend

```bash
cd react-web/frontend
npm install
npm run dev
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

## Documentação adicional

- Guia de integração: [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)
