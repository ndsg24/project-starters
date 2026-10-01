# Seguridad

Nunca publiques tokens, contraseñas o archivos `.env`. Las variables públicas de frontend se incluyen en el bundle.

CI ejecuta `pnpm audit --audit-level=high`. Dependabot revisa dependencias semanalmente. Los avisos moderados también deben revisarse; una CI verde no garantiza ausencia de vulnerabilidades.

Para reportar una vulnerabilidad usa la sección Security > Report a vulnerability de este repositorio. No publiques detalles explotables en un issue público.
