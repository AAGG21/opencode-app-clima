# app-clima

## Stack
- **Runtime:** Bun (not Node.js — use `bun`, not `npm`/`node`/`npx`)
- **Language:** TypeScript
- **No test/lint/formatter framework configured yet**

## Commands
| Action | Command |
|--------|---------|
| Run | `bun run index.ts` or `bun run start` |
| Dev (watch) | `bun run dev` |
| Compile binary | `bun run build` → outputs `app-clima` binary |

## Structure
- Single entry: `index.ts` (currently a stub)
- External APIs: OpenMeteo (geocoding + forecast) — no API key required, both are free HTTPS endpoints

## Notes
- `bun.lock` is committed — use `bun install`, never `npm install`
- No `.env` file needed; API calls go to `https://geocoding-api.open-meteo.com/` and `https://api.open-meteo.com/`
- No test runner exists; no CI configured; no lint rules defined
