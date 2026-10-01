# Backend architecture

Keep each business context under `src/<context>` (`internal/<context>` in Go). Domain and use cases
must stay independent of frameworks, HTTP and persistence. Define output ports in domain and inject
infrastructure adapters at the context composition root. Keep HTTP controllers thin; use dedicated
response DTOs and presenters. Expose context entry points through `index.ts` in TypeScript. Nest
dispatches queries/commands through CQRS handlers that delegate to pure use cases. Do not import
another context's private infrastructure or database models.

Update OpenAPI schemas and `bruno/` together when changing the HTTP contract. Run `pnpm check` and
`pnpm test:api` before publishing backend changes. Use the shared Husky, Commitlint, Prettier and
ESLint files without divergent copies. Go additionally requires `gofmt`, `go vet` and race-enabled
tests.
