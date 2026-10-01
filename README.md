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

## Crear un proyecto

```bash
git clone https://github.com/ndsg24/project-starters.git
cd project-starters
pnpm run create nest-api ../mi-api
cd ../mi-api
git init -b main
pnpm install --frozen-lockfile
pnpm dev
```

`pnpm run create --list` muestra las opciones. El generador renombra el paquete,
el módulo Go y la identidad básica de Expo. No copia builds, dependencias,
`.env`, hooks generados ni historial Git y rechaza destinos existentes.
Requiere Node 24 y pnpm 10.13.1; Go requiere además Go 1.25.

También puedes descargar una carpeta:

```bash
npx giget@latest gh:ndsg24/project-starters/templates/react-vite mi-prueba
```

Esta alternativa conserva los nombres originales. Fork y “Use this template”
copian el catálogo completo. Las actualizaciones no se propagan a proyectos ya
creados. Las versiones `v1.x` eran los scaffolds originales; `v2.0.0` incorpora
arquitectura, API tooling y preferencias.

## Convenciones idénticas

`conventions/` es la fuente canónica para los seis templates: Husky, Commitlint,
Prettier, ESLint, lint-staged y versiones de herramientas. Cada template lleva
su copia completa, sin imports al catálogo. `pnpm verify:conventions` y CI
comparan archivos y versiones para detectar divergencias.

Los hooks son los de Actas Iglesia: lint-staged antes del commit, validación
Conventional Commits y `pnpm test && pnpm typecheck` antes del push. Los adapters
y checks de plataforma se agregan mediante scripts. ESLint no analiza Go;
`gofmt`, `go vet`, tests con race detector y pruebas de imports lo complementan.

## Arquitectura y funcionalidades

Backend: dominio puro, puertos, casos de uso, adaptadores, controllers y
presenters por contexto. Health muestra una acción completa. Nest usa CQRS.
Las tres APIs exponen `/health`, `/openapi.json` y `/docs`, e incluyen Bruno.

Frontend: `app`, `modules`, `widgets`, `features`, `shared`, con APIs públicas e
imports descendentes. Dark y español son los valores iniciales; light/dark y
es/en/pt se cambian desde la UI y se conservan en el dispositivo. La UI usa
Manrope y tokens semánticos inspirados en Clerity.

## Validación y mantenimiento

CI genera copias fuera del catálogo, instala con lockfile y ejecuta lint,
formato, tipos, pruebas y build. Las APIs prueban contratos reales con Bruno.
Expo valida web y bundles JS de iOS/Android, no firma ni ejecución en dispositivo.
La CI también comprueba temas, idiomas, persistencia y responsive en Chrome.
Los tests protegen límites arquitectónicos, claves i18n, preferencias y el
generador. Cada copia también trae su workflow independiente.

Para mantener configs idénticas, cambia `conventions/`, ejecuta `pnpm sync:conventions` para sincronizar sus archivos
con los seis templates y ejecuta `pnpm test`. Las actualizaciones de herramientas
comunes deben aplicarse a los seis a la vez. Dependabot propone actualizaciones;
revisa y coordina cambios en Expo mediante `pnpm exec expo install --fix`.

Consulta [CONTRIBUTING.md](CONTRIBUTING.md), [SECURITY.md](SECURITY.md) y los
README de cada template. MIT, conservando avisos originales.
