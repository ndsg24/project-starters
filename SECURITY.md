# Seguridad

Nunca publiques tokens, contraseñas o archivos `.env`. Las variables públicas de frontend se incluyen en el bundle.

CI ejecuta `pnpm audit --audit-level=high`. Dependabot revisa dependencias semanalmente. Los avisos moderados también deben revisarse; una CI verde no garantiza ausencia de vulnerabilidades.

Para reportar una vulnerabilidad usa la sección Security > Report a vulnerability de este repositorio. No publiques detalles explotables en un issue público.

La validación de v2.0.0 no detecta avisos altos/críticos. Las herramientas de desarrollo de las APIs
conservan avisos moderados en `yaml`, `uuid` y `csv-parse`; Nest también en `js-yaml` 5.
Revisa estas dependencias transitivas de Bruno/CLI al actualizar sus paquetes padres. Los overrides
de las APIs fijan versiones corregidas de Axios, Faker, form-data y js-yaml 4.
