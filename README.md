# Project Starters

[![CI](https://github.com/ndsg24/project-starters/actions/workflows/ci.yml/badge.svg)](https://github.com/ndsg24/project-starters/actions/workflows/ci.yml)
![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)

Templates independientes para pruebas, prototipos y proyectos nuevos. Cada carpeta incluye dependencias propias, documentación y un workflow de CI que viaja con el proyecto.

## Templates

| Template | Base | Validación |
| --- | --- | --- |
| [go-api](templates/go-api) | Go 1.25 + HTTP estándar | go vet, tests con race detector y build |
| [node-ts](templates/node-ts) | Node 24 + TypeScript | tipos, node:test y build |
| [nest-api](templates/nest-api) | NestJS + TypeScript | lint, tipos, unit tests, E2E y build |
| [react-vite](templates/react-vite) | React + TypeScript + Vite | lint, tipos y build |
| [next-app](templates/next-app) | Next.js + App Router | lint, tipos y build |
| [expo-app](templates/expo-app) | Expo + Expo Router | lint, tipos y export web |

## Crear un proyecto con nombre propio

Clona el catálogo una sola vez. El generador no requiere instalar dependencias en la raíz:

```bash
git clone https://github.com/ndsg24/project-starters.git
cd project-starters
nvm use
npm run create -- nest-api ../mi-prueba
cd ../mi-prueba
npm ci
npm run dev
```

Lista las opciones con `npm run create -- --list`. El generador renombra el paquete y lockfile, el módulo Go o los identificadores básicos de Expo. No copia dependencias instaladas, historial Git, builds ni archivos `.env`; rechaza destinos existentes. Usa nombres en minúsculas con letras, números y guiones.

## Copiar directamente desde GitHub

```bash
npx giget@latest gh:ndsg24/project-starters/templates/react-vite mi-prueba
cd mi-prueba
npm ci
npm run dev
```

Esta alternativa conserva los nombres del template. Ajústalos siguiendo su README. Para una copia reproducible, agrega `#v1.0.0` a la URI del template. giget requiere Node incluso para descargar el template de Go.

## Publicar tu proyecto nuevo

Desde el proyecto generado:

```bash
git init -b main
git add .
git commit -m "chore: initialize project"
gh repo create mi-prueba --private --source=. --remote=origin --push
```

GitHub no permite hacer fork de una carpeta. Fork y “Use this template” copian el catálogo completo; usa el generador o giget para obtener un proyecto individual. Las mejoras futuras de este catálogo no se aplican automáticamente a las copias.

## Organización y mantenimiento

- `templates/`: proyectos autónomos, sin workspace compartido.
- `scripts/`: generador local y pruebas de aislamiento.
- `.github/`: CI del catálogo, Dependabot y configuración de contribuciones.

CI valida copias aisladas de los cinco templates Node, el template Go y el generador en cada PR y push a `main`. Dependabot propone actualizaciones semanales. Los frontends tienen lint, tipos y build; agrega pruebas funcionales cuando implementes comportamiento. Expo valida la exportación web; APK/IPA requieren configuración y validación nativa adicional.

Consulta [CONTRIBUTING.md](CONTRIBUTING.md) y [SECURITY.md](SECURITY.md). Licencia MIT; los avisos de los scaffolds originales se conservan.
