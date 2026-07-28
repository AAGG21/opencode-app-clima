# Revisión Weather CLI

- [x] **Colores:** Se agregó `src/colors.ts` con cyan (menú), amarillo (temp), verde (éxito), rojo (error) y dim (secundario). Aplicado en `ui.ts` e `index.ts`.
- [x] **AGENTS.md:** Actualizado — ya no dice "stub". Ahora lista los módulos `src/`.
- [x] **Ciudades:** Ya usaba `&count=5` (no 1). Se eliminó `&language=es` para evitar filtrado de nombres no españoles.
- [x] **Tests:** Creados `src/__tests__/weather.test.ts` (funciones puras) y `storage.test.ts` (persistencia con temp dir). 13 tests pasan.
- [x] **Binario:** Ruta de datos cambiada a `~/.config/weather-cli/data.json`. Compila correctamente con `bun run build`.
- [ ] **Escalabilidad:** Pendiente — la estructura modular actual facilita expansión. Si crece el menú, convendría refactorizar a sistema de comandos.
- [x] **Carga:** Se agregaron indicadores `printLoading()` antes de cada operación async (consultar clima, buscar ciudad).
- [x] **7 day forecast:** agregar la posibilidad de obtener el pronóstico del clima para los próximos 7 días.