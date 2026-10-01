# go-api

Starter independiente con convenciones de Actas Iglesia.

## Empezar

Requiere Node 24 y pnpm 10.13.1.

```bash
nvm use
corepack enable
pnpm install --frozen-lockfile
pnpm setup
git init -b main
pnpm prepare
pnpm dev
```

`pnpm prepare` activa Husky en el repo generado. Dentro del catálogo no toca los hooks del repo
padre. Si tu entorno no incluye Corepack, instala `npm install --global pnpm@10.13.1`.

## Calidad y commits

Los seis templates tienen exactamente las mismas configuraciones ESLint, Prettier, Commitlint,
lint-staged y Husky. Los checks nativos de Go se agregan a sus scripts sin cambiar esa base común.

- pre-commit: `pnpm lint-staged` (ESLint + Prettier).
- commit-msg: `pnpm commitlint --edit "$1"` (Conventional Commits).
- pre-push: `pnpm test && pnpm typecheck`.
- `pnpm lint`: revisa ESLint y falla ante errores o warnings.
- `pnpm lint:fix`: aplica las correcciones automáticas disponibles de ESLint.
- `pnpm format:check`: comprueba Prettier sin modificar archivos.
- `pnpm format`: aplica Prettier a los archivos compatibles.
- `pnpm typecheck`: comprueba tipos (Go: `go vet`).
- `pnpm check`: lint, formato, tipos, pruebas y build; también se ejecuta en CI.

```bash
pnpm lint
pnpm lint:fix
pnpm format
pnpm lint
pnpm format:check
```

`pnpm lint` también verifica el formato Go. ESLint/Prettier no analizan ni formatean Go; para
corregir sus archivos ejecuta `gofmt -w cmd internal` y vuelve a correr `pnpm lint`.

Las correcciones automáticas pueden dejar errores que debas resolver manualmente.

Configura nombre/correo Git y usa commits como `feat(health): add readiness`. La CI propia se activa
en `main` y PRs. El proyecto no depende de archivos de la raíz del catálogo. Al crear por giget
cambia `package.json.name`; el lockfile pnpm no necesita renombrarse.

## Arquitectura hexagonal

Cada contexto vive directamente bajo `src/<context>` (Go: `internal/<context>`). Dominio y casos de
uso son puros. El puerto `ClockPort` / `Clock` está en dominio; el reloj del sistema es un
adaptador. El controlador invoca una query/caso de uso y el presenter construye la respuesta HTTP.
`health` es el ejemplo conectado.

```text
health/
  domain/ports/output/
  domain/read-models/         # Go: readmodels
  application/use-cases/      # Go: usecases
  application/queries/       # Node/Nest
  infrastructure/adapters/
  infrastructure/mappers/    # Node/Nest
  infrastructure/web/http/
  health.module.ts            # Go: health.go
  index.ts                   # API pública del contexto en TypeScript
```

En Nest las lecturas se despachan por `QueryBus`. Los casos de uso no importan NestJS ni Fastify. Al
agregar escrituras, replica la acción bajo `application/commands` con su caso de uso y contratos
propios. No crees application services CRUD genéricos. Las implementaciones de persistencia
pertenecen a infraestructura y se inyectan mediante puertos de dominio.

ESLint protege el core TypeScript. Go tiene pruebas de imports para el core. No importes
infraestructura privada de otros contextos ni sus modelos de datos.

## API, OpenAPI y Bruno

- `GET /health`: liveness (no verifica una base de datos).
- `GET /openapi.json`: contrato generado a partir del transporte.
- `GET /docs`: Swagger UI (Node/Nest) o Scalar (Go/Huma).

```bash
pnpm dev
# En otra terminal, con la API ya ejecutándose:
pnpm bruno
# Smoke autónomo: levanta el build, ejecuta Bruno y cierra la API.
pnpm build
pnpm test:api
```

Importa `bruno/` en Bruno Desktop. Su entorno `local` usa `127.0.0.1:4000`; para otro puerto usa
`pnpm bruno --env-var baseUrl=http://127.0.0.1:8080`. Swagger/OpenAPI permanecen en infraestructura.
Actualiza DTO/schema y Bruno cuando cambie una ruta. El UI de Go usa el CDN de Scalar;
`/openapi.json` sigue siendo local. No publiques documentación interna en producción sin decidir su
política de acceso.

Requiere Go 1.25 además de Node para las herramientas Git/calidad. Go lee variables del proceso;
`.env` no se carga automáticamente. `gofmt` y `go vet` complementan ESLint/Prettier (estos no
formatean ni analizan Go). El generador actualiza el módulo en todos los archivos Go. Si usas giget,
reemplaza `example.com/go-api` por tu módulo en `go.mod` y en los imports.

Licencia MIT. Conserva los avisos de copyright originales.

## Entorno y Docker Compose

`pnpm setup` crea `.env` sin sobrescribirlo. Ejecuta `pnpm docker:up` para construir los
contenedores y esperar sus healthchecks; `pnpm docker:logs` muestra logs y `pnpm docker:down` los
detiene. Requiere Docker con Compose v2. No se crean modelos, CRUDs ni datos de ejemplo.

Setup inicia PostgreSQL y verifica una conexión real. `pnpm dev` ejecuta la API en el host;
`pnpm docker:up` activa el perfil `app` con PostgreSQL + API. El puerto por defecto es 4000. La BD
usa un volumen persistente y su puerto se publica solo en 127.0.0.1. El password local se genera
durante setup. Cambia `POSTGRES_PORT` y `DATABASE_URL` si 5432 está ocupado. No se modifica una base
remota durante setup.

`pnpm db:check` y `pnpm test:integration` verifican la conexión. Los pools se cierran al apagar la
API. `CORS_ORIGINS` acepta únicamente orígenes HTTP explícitos.

La conexión pgx está en `internal/platform/database`. Usa `pnpm db:create nombre` para crear
archivos SQL vacíos, `pnpm db:migrate` para aplicar migraciones y `pnpm db:rollback` para revertir
la última. `migrations/` comienza vacía.
