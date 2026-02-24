# GPManager (UFOPKART)

Sistema para organização de corridas de kart: categorias, equipes, pilotos, corridas, resultados e standings. Backend em Go, frontend em Next.js e banco PostgreSQL.

## Pré-requisitos

- **Go** 1.25+
- **Node.js** e **pnpm**
- **PostgreSQL**
- **tern** (migrações): `go install github.com/jackc/tern/v2@latest`
- **sqlc**: para gerar código a partir das queries SQL
- **swag**: para gerar documentação Swagger (`go install github.com/swaggo/swag/cmd/swag@latest`)
- **air** (opcional): hot reload do backend (`go install github.com/air-verse/air@latest`)

## Variáveis de ambiente

### Raiz do projeto (backend e scripts)

Crie um `.env` na raiz com:

```env
BLUEPRINT_DB_USERNAME=postgres
BLUEPRINT_DB_PASSWORD=sua_senha
BLUEPRINT_DB_HOST=localhost
BLUEPRINT_DB_PORT=5432
BLUEPRINT_DB_DATABASE=gpmanager
SESSION_SECRET=uma-chave-secreta-longa-e-aleatoria
PORT=8080
```

### Frontend

No diretório `frontend`, crie `.env` (pode copiar de `.env.example`):

```env
NEXT_PUBLIC_SERVER_URL=http://localhost:8080
```

A URL deve apontar para o backend (mesma porta do `PORT` do backend).

## Como rodar

### 1. Banco de dados

Crie o banco no PostgreSQL, por exemplo:

```bash
createdb gpmanager
```

### 2. Migrações

Na raiz do projeto:

```bash
make migrate
```

Isso roda as migrações com o `tern` usando as variáveis do `.env`.

### 3. Usuário admin (primeira vez)

Para poder logar no painel admin:

```bash
go run script/admin/main.go
```

Isso cria/atualiza o usuário **admin@admin.com** com senha **admin123admin**.

### 4. Backend

**Opção A – com hot reload (air):**

```bash
make watch
```

**Opção B – binário direto:**

```bash
make build
./main
```

A API sobe em **http://localhost:8080**. Documentação Swagger: **http://localhost:8080/swagger/index.html**.

### 5. Frontend

Em outro terminal:

```bash
cd frontend
pnpm install
pnpm dev
```

O site sobe em **http://localhost:3000**.

- Site público: **http://localhost:3000**
- Login admin: **http://localhost:3000/admin/login** (admin@admin.com / admin123admin)
- Dashboard admin: **http://localhost:3000/admin** (após login)

## Comandos úteis

| Comando            | Descrição                          |
|--------------------|------------------------------------|
| `make build`       | Compila o backend em `./main`      |
| `make watch`       | Sobe o backend com air (hot reload)|
| `make migrate`     | Executa migrações do banco         |
| `make migration-new NAME=nome` | Cria nova migração        |
| `make sqlc-generate` | Gera código Go a partir das queries (sqlc) |
| `make swagger`     | Gera docs Swagger                  |
| `cd frontend && pnpm run generate` | Gera cliente e tipos da API (kubb) |

## Estrutura resumida

- **cmd/api** – entrada da API Go
- **cmd/terndotenv** – runner das migrações com `.env`
- **internal/api** – handlers, rotas, CORS, middleware
- **internal/store/pgstore** – queries, migrações, sqlc
- **internal/services** – serviços de domínio
- **internal/use-cases** – casos de uso e DTOs
- **script/admin** – script para criar/atualizar usuário admin
- **frontend** – app Next.js (site público + painel admin)
- **docs** – Swagger (gerado por `make swagger`)

## Regenerar cliente do frontend (kubb)

Se alterar a API e o Swagger:

```bash
make swagger
make kubb-generate
```

Ou no frontend: `pnpm run generate`. O cliente e os tipos em `frontend/src/lib/api/kubb` são atualizados a partir de `docs/swagger.json`.
