# expo-app

Expo + TypeScript + Expo Router para iOS, Android y web.

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

`npm run build` exporta la versión web; no produce APK ni IPA. Usa `npm run android` o `npm run ios` para desarrollo. Configura EAS y los identificadores propios antes de distribuir una app nativa. El scaffold oficial conserva pantallas de ejemplo; `npm run reset-project` permite comenzar desde una base mínima.

Overrides temporales: `xcode > uuid` usa 11.1.1 (API CommonJS compatible), y `decode-uri-component` usa 0.5.0 para resolver avisos de seguridad. Revisarlos al actualizar Expo.

## CI y licencia

Incluye un workflow independiente de GitHub Actions. Para activarlo en un nuevo repo, usa `main` como rama principal. Licencia MIT; conserva los avisos de copyright existentes.
