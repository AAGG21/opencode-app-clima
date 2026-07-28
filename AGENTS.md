# app-clima

## Stack
- **Runtime:** Bun (not Node.js — use `bun`, not `npm`/`node`/`npx`)
- **UI Framework:** Ink v4 (React 18) — componentes JSX interactivos en terminal
- **Language:** TypeScript
- **No test/lint/formatter framework configured yet**

## Commands
| Action | Command |
|--------|---------|
| Run | `bun run index.tsx` or `bun run start` |
| Dev (watch) | `bun run dev` |
| Compile binary | `bun run build` → outputs `app-clima.exe` + `yoga.wasm` |
| Run (new window) | `bun run start:win` (abre cmd.exe con la app) |

> **Nota:** Ink requiere un terminal real (raw mode). En VS Code el terminal integrado no lo soporta. Usa `bun run start:win` o ejecuta `app-clima.exe` directamente.

## Structure
- Entry: `index.tsx` — renderiza `<App />` con Ink
- Components: `src/components/App.tsx`, `Menu.tsx`, `WeatherSingle.tsx`, `WeatherAll.tsx`, `Forecast.tsx`, `CitySearch.tsx`, `CityListSelect.tsx`, `Settings.tsx`, `PressAnyKey.tsx`
- Modules: `types.ts`, `storage.ts`, `geocoding.ts`, `weather.ts`
- External APIs: OpenMeteo (geocoding + forecast) — no API key required, both are free HTTPS endpoints

## Notes
- `bun.lock` is committed — use `bun install`, never `npm install`
- No `.env` file needed; API calls go to `https://geocoding-api.open-meteo.com/` and `https://api.open-meteo.com/`
- No test runner exists; no CI configured; no lint rules defined
- Navegación con flechas arriba/abajo + Enter; Escape para cancelar/volver
