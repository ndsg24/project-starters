# Project Starters

[![CI](https://github.com/ndsg24/project-starters/actions/workflows/ci.yml/badge.svg)](https://github.com/ndsg24/project-starters/actions/workflows/ci.yml)

Seis proyectos independientes con arquitectura y convenciones de Actas Iglesia.

| Template                           | Arquitectura           | Base                               |
| ---------------------------------- | ---------------------- | ---------------------------------- |
| [go-api](templates/go-api)         | Hexagonal por contexto | Go + Huma/OpenAPI + Scalar + Bruno |
| [node-ts](templates/node-ts)       | Hexagonal por contexto | Node + Fastify + Swagger + Bruno   |
| [nest-api](templates/nest-api)     | Hexagonal + CQRS       | NestJS + Swagger + Bruno           |
| [react-vite](templates/react-vite) | FSD adaptado           | React + Vite + temas + i18next     |
| [next-app](templates/next-app)     | FSD adaptado           | Next App Router + temas + i18next  |
| [expo-app](templates/expo-app)     | FSD adaptado           | Expo Router + temas + i18next      |

## Crear un proyecto de cada tipo

Requisitos: Node 24 y pnpm 10.13.1. Go necesita además Go 1.25. Expo necesita Expo Go en el
dispositivo, o las herramientas nativas para ejecutar un simulador. Si no tienes pnpm, instálalo con
`npm install --global pnpm@10.13.1`.

### Clonar el catálogo una vez

```bash
git clone https://github.com/ndsg24/project-starters.git
cd project-starters
```

Elige uno de los siguientes bloques y ejecútalo **desde la carpeta `project-starters`**. No
necesitas instalar dependencias en el catálogo para usar el generador. Cada bloque crea un proyecto
independiente al lado del catálogo, inicializa Git e instala sus propias dependencias y hooks.

### Go API

```bash
pnpm run create go-api ../mi-api-go
cd ../mi-api-go
git init -b main
pnpm install --frozen-lockfile
pnpm dev
```

Abre [http://127.0.0.1:3000/docs](http://127.0.0.1:3000/docs). La API también expone `/health` y
`/openapi.json`. En otra terminal, dentro del proyecto, ejecuta `pnpm bruno` para probar la API.

### Node + Fastify

```bash
pnpm run create node-ts ../mi-api-node
cd ../mi-api-node
git init -b main
pnpm install --frozen-lockfile
pnpm dev
```

Abre [http://127.0.0.1:3000/docs](http://127.0.0.1:3000/docs). La API también expone `/health` y
`/openapi.json`. En otra terminal, dentro del proyecto, ejecuta `pnpm bruno` para probar la API.

### NestJS API

```bash
pnpm run create nest-api ../mi-api-nest
cd ../mi-api-nest
git init -b main
pnpm install --frozen-lockfile
pnpm dev
```

Abre [http://127.0.0.1:3000/docs](http://127.0.0.1:3000/docs). La API también expone `/health` y
`/openapi.json`. En otra terminal, dentro del proyecto, ejecuta `pnpm bruno` para probar la API.

### React + Vite

```bash
pnpm run create react-vite ../mi-web-react
cd ../mi-web-react
git init -b main
pnpm install --frozen-lockfile
pnpm dev
```

Abre [http://localhost:5173](http://localhost:5173). El puerto puede cambiar si ya está ocupado;
revisa la URL de la terminal.

### Next.js

```bash
pnpm run create next-app ../mi-web-next
cd ../mi-web-next
git init -b main
pnpm install --frozen-lockfile
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000). El puerto puede cambiar si ya está ocupado;
revisa la URL de la terminal.

### Expo / React Native

```bash
pnpm run create expo-app ../mi-app-expo
cd ../mi-app-expo
git init -b main
pnpm install --frozen-lockfile
pnpm dev
```

Escanea el QR con Expo Go. En la terminal de Expo pulsa `w` para web, `a` para Android o `i` para
iOS; los simuladores requieren Android Studio o Xcode respectivamente, y el simulador iOS requiere
macOS.

Puedes cambiar el nombre de destino en cualquiera de los bloques. El generador renombra el paquete,
todos los imports del módulo Go y la identidad básica de Expo. `pnpm run create --list` muestra los
templates disponibles. No copia builds, dependencias, `.env`, hooks generados ni historial Git, y
rechaza destinos existentes.

### Descargar solamente un template, sin clonar el catálogo

Ejecuta **solo la fila del proyecto que quieras crear**, desde la carpeta donde quieras guardarlo.
Estos comandos descargan la versión publicada `v2.0.2` sin historial Git.

| Proyecto            | Comando                                                                                |
| ------------------- | -------------------------------------------------------------------------------------- |
| Go API              | `npx giget@latest gh:ndsg24/project-starters/templates/go-api#v2.0.2 mi-api-go`        |
| Node + Fastify      | `npx giget@latest gh:ndsg24/project-starters/templates/node-ts#v2.0.2 mi-api-node`     |
| NestJS API          | `npx giget@latest gh:ndsg24/project-starters/templates/nest-api#v2.0.2 mi-api-nest`    |
| React + Vite        | `npx giget@latest gh:ndsg24/project-starters/templates/react-vite#v2.0.2 mi-web-react` |
| Next.js             | `npx giget@latest gh:ndsg24/project-starters/templates/next-app#v2.0.2 mi-web-next`    |
| Expo / React Native | `npx giget@latest gh:ndsg24/project-starters/templates/expo-app#v2.0.2 mi-app-expo`    |

Después de la descarga, sustituye `mi-proyecto` por la carpeta que elegiste:

```bash
cd mi-proyecto
git init -b main
pnpm install --frozen-lockfile
pnpm dev
```

La descarga directa conserva los nombres originales del template. Para que paquete, módulo Go e
identidad Expo se adapten automáticamente al nombre de tu proyecto, usa el generador de los bloques
anteriores. Si usas descarga directa, consulta el README del template para los cambios de identidad
correspondientes.

### Validar el proyecto creado

Dentro de cualquiera de los seis proyectos, estos comandos se ejecutan desde la raíz del proyecto
generado:

| Comando             | Qué hace                                                                       |
| ------------------- | ------------------------------------------------------------------------------ |
| `pnpm lint`         | Revisa ESLint y falla ante errores o warnings. En Go también verifica `gofmt`. |
| `pnpm lint:fix`     | Aplica las correcciones automáticas disponibles de ESLint.                     |
| `pnpm format:check` | Comprueba el formato de Prettier sin modificar archivos.                       |
| `pnpm format`       | Aplica Prettier a los archivos compatibles.                                    |
| `pnpm typecheck`    | Comprueba tipos; en Go ejecuta `go vet`.                                       |
| `pnpm check`        | Ejecuta lint, formato, tipos, tests y build.                                   |

Para revisar y corregir lint/formato:

```bash
pnpm lint
pnpm lint:fix
pnpm format
pnpm lint
pnpm format:check
```

En Go, ESLint/Prettier cubren las herramientas JavaScript y los archivos compatibles; para corregir
el formato del código Go ejecuta además:

```bash
gofmt -w cmd internal
```

Para la validación completa:

```bash
pnpm check
```

La CI ejecuta `pnpm check`, incluyendo lint y formato. El hook pre-commit aplica ESLint/Prettier
mediante lint-staged a los archivos configurados que están preparados para el commit. Las
correcciones automáticas pueden dejar errores que debas resolver manualmente antes de que
`pnpm lint` pase.

En las APIs puedes validar además el servidor compilado y sus contratos Bruno:

```bash
pnpm build
pnpm test:api
```

En Expo puedes exportar los bundles de web, iOS y Android:

```bash
pnpm build:native
```

Fork y “Use this template” copian el catálogo completo. Las actualizaciones no se propagan a
proyectos ya creados. Las versiones `v1.x` eran los scaffolds originales; `v2.0.0` incorpora
arquitectura, API tooling y preferencias.

## Convenciones idénticas

`conventions/` es la fuente canónica para los seis templates: Husky, Commitlint, Prettier, ESLint,
lint-staged y versiones de herramientas. Cada template lleva su copia completa, sin imports al
catálogo. `pnpm verify:conventions` y CI comparan archivos y versiones para detectar divergencias.

Los hooks son los de Actas Iglesia: lint-staged antes del commit, validación Conventional Commits y
`pnpm test && pnpm typecheck` antes del push. Los adapters y checks de plataforma se agregan
mediante scripts. ESLint no analiza Go; `gofmt`, `go vet`, tests con race detector y pruebas de
imports lo complementan.

El estilo común exige llaves en condiciones y bucles, imports agrupados y líneas en blanco entre
miembros de clases, antes de retornos y alrededor de bloques y declaraciones multilínea.
`pnpm lint:fix` aplica esas separaciones y `pnpm format` ajusta la presentación con Prettier. Go
conserva imports agrupados y bloques separados siguiendo `gofmt`.

## Arquitectura y funcionalidades

Backend: dominio puro, puertos, casos de uso, adaptadores, controllers y presenters por contexto.
Health muestra una acción completa. Nest usa CQRS. Las tres APIs exponen `/health`, `/openapi.json`
y `/docs`, e incluyen Bruno.

Frontend: `app`, `modules`, `widgets`, `features`, `shared`, con APIs públicas e imports
descendentes. Dark y español son los valores iniciales; light/dark y es/en/pt se cambian desde la UI
y se conservan en el dispositivo. La UI usa Manrope y tokens semánticos inspirados en Clerity.

## Validación y mantenimiento

CI genera copias fuera del catálogo, instala con lockfile y ejecuta lint, formato, tipos, pruebas y
build. Las APIs prueban contratos reales con Bruno. Expo valida web y bundles JS de iOS/Android, no
firma ni ejecución en dispositivo. La CI también comprueba temas, idiomas, persistencia y responsive
en Chrome. Los tests protegen límites arquitectónicos, claves i18n, preferencias y el generador.
Cada copia también trae su workflow independiente.

Para mantener configs idénticas, cambia `conventions/`, ejecuta `pnpm sync:conventions` para
sincronizar sus archivos con los seis templates y ejecuta `pnpm test`. Las actualizaciones de
herramientas comunes deben aplicarse a los seis a la vez. Dependabot propone actualizaciones; revisa
y coordina cambios en Expo mediante `pnpm exec expo install --fix`.

Consulta [CONTRIBUTING.md](CONTRIBUTING.md), [SECURITY.md](SECURITY.md) y los README de cada
template. MIT, conservando avisos originales.
