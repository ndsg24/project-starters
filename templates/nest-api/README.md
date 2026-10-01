# nest-api

API NestJS con validación global, cierre ordenado, unit tests y E2E.

## Ejecutar

```bash
nvm use
npm ci
npm run dev
npm run check
```

## Configuración

Requiere Node 24. Usa `.env.example` como referencia y nunca publiques secretos. Las variables `VITE_*`, `NEXT_PUBLIC_*` y `EXPO_PUBLIC_*` son visibles en el cliente.

El generador local renombra `package.json` y el lockfile. Si copias manualmente con giget, ajusta el nombre y ejecuta `npm install --package-lock-only`.

Endpoints iniciales: `GET /` y `GET /health`. Para cargar un archivo local: `node --env-file=.env dist/main.js` después del build.

## CI y licencia

Incluye un workflow independiente de GitHub Actions. Para activarlo en un nuevo repo, usa `main` como rama principal. Licencia MIT; conserva los avisos de copyright existentes.
