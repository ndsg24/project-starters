# next-app

Next.js + TypeScript + App Router, sin descargar fuentes durante el build.

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

## CI y licencia

Incluye un workflow independiente de GitHub Actions. Para activarlo en un nuevo repo, usa `main` como rama principal. Licencia MIT; conserva los avisos de copyright existentes.
