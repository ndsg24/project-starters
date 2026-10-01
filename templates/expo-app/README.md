# expo-app

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

Las correcciones automáticas pueden dejar errores que debas resolver manualmente.

Configura nombre/correo Git y usa commits como `feat(health): add readiness`. La CI propia se activa
en `main` y PRs. El proyecto no depende de archivos de la raíz del catálogo. Al crear por giget
cambia `package.json.name`; el lockfile pnpm no necesita renombrarse.

## Feature Sliced Design adaptado a Actas Iglesia

```text
src/
  app/          # rutas, providers y composición global
  modules/home/ # dominio/página del módulo; API pública index.ts
  widgets/      # composición de features: preferences
  features/     # intenciones: appearance, language
  shared/       # preferencias, i18n, temas y primitivas técnicas
```

Imports: `app → modules → widgets → features → shared`. Los slices hermanos no se importan; cada
slice publica su `index.ts`. ESLint aplica estos límites. Dentro de un módulo crea `domain`,
`application`, `infrastructure`, `hooks` y `ui` únicamente cuando exista una responsabilidad real.
Las rutas son delgadas y la UI no hace HTTP ni persistencia.

## Tema e idiomas

Dark es el tema inicial y español el idioma inicial. La pantalla permite elegir light/dark y
español/inglés/portugués. Los recursos viven en `shared/i18n/locales/{es,en,pt}.json`; las claves
tienen paridad probada. Cada provider usa su propia instancia i18next para evitar mezclar idioma
entre requests de Next. Web persiste únicamente preferencias no sensibles en localStorage; Expo usa
AsyncStorage. Los errores de storage no bloquean la UI. No uses estos adaptadores para tokens,
credenciales ni una base offline.

Los tokens de tema están centralizados en `shared/theme`. Las traducciones visibles se consumen con
`useTranslation`; no agregues texto fijo de producto.

`pnpm build` exporta web. `pnpm build:native` comprueba bundles JS de iOS y Android; no genera
APK/IPA ni sustituye pruebas en dispositivo. Para distribuir, configura EAS, bundle identifiers y
firma. Instala módulos nativos con `pnpm exec expo install <paquete>`. AsyncStorage está limitado a
preferencias.

Licencia MIT. Conserva los avisos de copyright originales.

## Entorno y Docker Compose

`pnpm setup` crea `.env` sin sobrescribirlo. Ejecuta `pnpm docker:up` para construir los
contenedores y esperar sus healthchecks; `pnpm docker:logs` muestra logs y `pnpm docker:down` los
detiene. Requiere Docker con Compose v2. No se crean modelos, CRUDs ni datos de ejemplo.

Compose ejecuta desarrollo web con el código montado. El cliente HTTP está en `shared/api` y admite
timeout, cancelación, cabeceras, body JSON y un decoder opcional para validar respuestas. `ApiError`
normaliza fallos HTTP/red/timeout. TanStack Query ya está montado en los providers, con caché y
reintentos limitados para consultas; las mutaciones no se reintentan automáticamente.

Configura `EXPO_PUBLIC_API_URL` en `.env` (por defecto `http://localhost:4000`). Compose cubre web.
Para nativo ejecuta `pnpm dev` en el host. Android Emulator usa 10.0.2.2 para llegar al host;
dispositivos físicos necesitan la IP LAN del equipo y `HOST=0.0.0.0` en la API. AppState y NetInfo
gestionan foco/conectividad. Las variables EXPO_PUBLIC son públicas; no contienen credenciales.
