# Contribuir

Cada template debe funcionar sin archivos externos a su carpeta. Conserva su lockfile, README, `.env.example` y CI independiente.

1. Usa Node 24 o Go 1.25 según el proyecto.
2. Ejecuta `npm ci && npm run check` dentro del template, o `make check && make build` para Go.
3. Ejecuta `npm test` en la raíz para validar el generador.
4. Genera una copia fuera del catálogo y verifica su instalación.
5. Documenta cambios de versiones o pasos manuales en el README del template.

No compartas dependencias mediante workspaces ni enlaces a la raíz. No agregues credenciales o artefactos de build. Las actualizaciones de los starters no se propagan automáticamente a proyectos ya creados.
