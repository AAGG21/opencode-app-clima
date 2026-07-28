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
```
src/
├── api/                    # Integración con APIs externas
│   ├── geocoding.ts        # OpenMeteo Geocoding API
│   └── weather.ts          # OpenMeteo Forecast API + helpers
├── storage/
│   └── index.ts            # Persistencia en ~/.config/weather-cli/data.json
├── types/                  # Tipos y contratos TypeScript
│   ├── AppData.ts          # Estado persistido de la app
│   ├── City.ts             # City, GeocodingResult
│   └── Weather.ts          # CurrentWeather, DayForecast, ForecastData
├── utils/                  # Utilidades reutilizables
│   ├── colors.ts           # Paleta de colores (tema oscuro GitHub)
│   ├── constants.ts        # URLs de API y constantes generales
│   └── format.ts           # Formateadores (fechas, etc.)
├── presentation/           # Interfaz de consola (Ink/React)
│   └── components/         # Componentes Ink
│       ├── App.tsx         # Orquestador principal
│       ├── Menu.tsx        # Menú principal con navegación
│       ├── WeatherSingle.tsx
│       ├── WeatherAll.tsx
│       ├── Forecast.tsx
│       ├── CitySearch.tsx
│       ├── CityListSelect.tsx
│       ├── Settings.tsx
│       └── PressAnyKey.tsx
└── __tests__/              # Tests con bun:test
    ├── weather.test.ts
    └── storage.test.ts
```
- Entry: `index.tsx` — renderiza `<App />` con Ink
- External APIs: OpenMeteo (geocoding + forecast) — no API key required, both are free HTTPS endpoints

## Notes
- `bun.lock` is committed — use `bun install`, never `npm install`
- No `.env` file needed; API calls go to `https://geocoding-api.open-meteo.com/` and `https://api.open-meteo.com/`
- No test runner exists; no CI configured; no lint rules defined
- Navegación con flechas arriba/abajo + Enter; Escape para cancelar/volver
