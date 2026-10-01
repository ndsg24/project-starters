# Contribuir

Cada template funciona fuera del catálogo. Usa pnpm 10.13.1 y Node 24.

1. Mantén convenciones comunes idénticas a `conventions/`.
2. Ejecuta `pnpm check` en el template; backend también `pnpm test:api`.
3. Ejecuta `pnpm test` en la raíz y verifica una copia generada.
4. Sigue los límites hexagonales o FSD aplicados por ESLint y las pruebas.
5. Mantén Bruno, OpenAPI, documentación y lockfiles actualizados.
6. Usa Conventional Commits y un PR para actualizar `main`.

No agregues dependencias del catálogo a los templates. No publiques secretos.
En Expo actualiza módulos nativos como conjunto con las herramientas oficiales.
Las copias existentes no reciben automáticamente los cambios del catálogo.
