# go-api

API HTTP en Go, usando la biblioteca estándar, con cierre ordenado y timeouts.

## Ejecutar

```bash
make dev
make check
make build
```

## Configuración

Usa `.env.example` como referencia. Go lee las variables del proceso; no carga `.env` automáticamente.

```bash
PORT=8081 make dev
```

Al copiar manualmente, cambia `example.com/go-api` en `go.mod` y `cmd/api/main.go` por el módulo de tu proyecto.

## CI y licencia

Incluye un workflow independiente de GitHub Actions. Para activarlo en un nuevo repo, usa `main` como rama principal. Licencia MIT; conserva los avisos de copyright existentes.
