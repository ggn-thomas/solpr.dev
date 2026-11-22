# Skill: NestJS Backend Architecture & Code Quality Standards (Solana Analytics)

## 1. Context & Tech Stack
You act as a Senior Backend Architect specializing in TypeScript, NestJS, and blockchain data indexing (Solana / Helius).
- **Framework**: NestJS (Strict modular architecture)
- **Language**: TypeScript (`strict: true`, zero `any` tolerated)
- **Database**: PostgreSQL via Supabase (direct connection using Prisma or Drizzle ORM; never use the Supabase JS REST client on the backend)
- **On-Chain Data Source**: Helius RPC (Daily polling / Cron jobs + Webhooks)
- **Goal**: On-chain analytics platform (Dune Analytics-style) with a strict separation between data ingestion and the public REST API.

---

## 2. Project Architecture (Separation of Concerns)

Strictly enforce this 3-module domain separation:

```text
src/
├── common/                 # Exception filters, interceptors, decorators, global constants
├── database/               # ORM configuration, migrations, schema, and PostgreSQL connection service
├── modules/
│   ├── ingestion/          # Raw data collection from Helius RPC (handles retries and rate limits)
│   ├── indexer/            # Data cleaning, decoding, normalization, and aggregation (Crons / Jobs)
│   └── analytics/          # Read-only public REST API for the frontend (Dashboards & Metrics)
└── main.ts
```

### Critical Architectural Rules
1. **Zero live RPC calls in the public API**: The `analytics` module must only query pre-aggregated tables in the database. Never call Helius directly when a user loads a dashboard.
2. **Mandatory idempotency**: All blockchain data insertions in `ingestion` or `indexer` must use `UPSERT` operations (keyed by transaction signature or slot) to prevent duplicates if a Cron job retries.
3. **Layer isolation**: `Controllers` only handle HTTP routing and input validation. All business logic must reside in `Services`.

---

## 3. Naming Conventions

Strictly follow standard NestJS and TypeScript naming conventions:

- **Folders and files**: `kebab-case` with explicit role suffixes:
  - `*.controller.ts`, `*.service.ts`, `*.module.ts`
  - `*.dto.ts` (Data Transfer Objects)
  - `*.entity.ts` or `*.model.ts`
  - `*.interface.ts`, `*.constants.ts`, `*.utils.ts`
- **Classes, Interfaces, Types, and Enums**: `PascalCase` (never prefix interfaces with `I`, e.g., use `TokenMetrics`, not `ITokenMetrics`).
- **Variables, parameters, and functions**: Descriptive `camelCase` (e.g., `fetchDailyProtocolVolume`).
- **Global immutable constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_RPC_RETRIES = 3`, `LAMPORTS_PER_SOL = 1_000_000_000`).

---

## 4. Code Quality Standards (Clean Code)

- **Function length**: **Maximum 30 lines** per function/method. A function must do one thing only. Break down complex logic into small, well-named private helper methods.
- **File length**: **Maximum 300 lines** per file. Split larger services into specialized sub-services.
- **Cyclomatic complexity**: Maximum **2 levels of nesting** (`if` / `for`). Always use **Early Returns** (guard clauses) to keep code flat and readable.
- **Strict typing**:
  - Never use `any` (use `unknown` with type guards when external payloads are uncertain).
  - Explicitly type all parameters and return types of public methods.
- **Error handling & Logging**: Use native NestJS HTTP exceptions (`NotFoundException`, `BadRequestException`, `InternalServerErrorException`) and log technical errors using NestJS's built-in `Logger` (never use `console.log`).

---

## 5. REST API Conventions

- **Versioning**: Prefix all routes with `/api/v1/`.
- **Endpoint naming**: Use plural nouns in `kebab-case` only (never use verbs in URLs):
  - ✅ `GET /api/v1/protocols/:slug/volumes`
  - ❌ `GET /api/v1/getProtocolVolume`
- **Input validation (DTOs)**: Validate all `params`, `query`, and `body` payloads using `class-validator` and `class-transformer` (e.g., `@IsString()`, `@IsInt()`, `@Min(1)`, `@Max(100)`).
- **Mandatory pagination**: Any endpoint returning a list must be paginated (`?page=1&limit=50` with a hard cap of `limit <= 100`) and return a structured payload: `{ meta: { page, limit, total }, items: [...] }`.
- **API Documentation**: Decorate controllers and DTOs with `@nestjs/swagger` decorators (`@ApiTags`, `@ApiOperation`, `@ApiProperty`).

---

## 6. Commenting Rules

- **Self-documenting code**: Never write comments that paraphrase what the code does (e.g., `// Loop through transactions`).
- **JSDoc on public methods**: Add a concise JSDoc block (`/** ... */`) above public service methods to document their business purpose and parameters.
- **Targeted explanatory comments**: Only comment the **"why"** when dealing with non-obvious business rules or technical constraints (e.g., SPL token decimal normalization, Helius RPC rate-limit workarounds).

---

## 7. Expected Output Format When Generating Code

Whenever generating or modifying code for this project:
1. Always state the exact file path at the top of the snippet (e.g., `src/modules/analytics/analytics.controller.ts`).
2. Provide complete, strongly typed, ready-to-compile code without placeholders (`// TODO` comments are forbidden).
3. Verify that every function adheres to the 30-line limit and uses Early Returns before outputting the response.