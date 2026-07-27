import { useState } from 'react'
import { Box, Text, useInput } from 'ink'
import type { AppData } from '../types'

interface Props {
  data: AppData
  onSelect: (index: number) => void
}

const items = [
  'Clima de ciudad default',
  'Clima de todas las ciudades',
  'Buscar y agregar ciudad',
  'Eliminar ciudad',
  'Establecer ciudad default',
  'Ajustes',
  'Salir',
]

export function Menu({ data, onSelect }: Props) {
  const [active, setActive] = useState(0)

  useInput((_input, key) => {
    if (key.upArrow) setActive(i => (i > 0 ? i - 1 : items.length - 1))
    else if (key.downArrow) setActive(i => (i < items.length - 1 ? i + 1 : 0))
    else if (key.return) onSelect(active)
  })

  const defaultCity = data.defaultCityIndex !== null ? data.cities[data.defaultCityIndex] : null
  const unitSymbol = data.unit === 'celsius' ? '°C' : '°F'

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      <Text bold color="cyan">═══ WEATHER CLI ═══</Text>
      <Box flexDirection="column" marginTop={1}>
        {items.map((item, i) => (
          <Text key={i} inverse={i === active} color={i === active ? 'cyan' : undefined}>
            {i === active ? ' ▸ ' : '   '}{i + 1}. {item}
          </Text>
        ))}
      </Box>
      <Box marginTop={1} flexDirection="column">
        <Text dimColor>Ciudades: {data.cities.length} | Unidad: {unitSymbol}</Text>
        {defaultCity && <Text dimColor>Default: {defaultCity.name}{defaultCity.country ? `, ${defaultCity.country}` : ''}</Text>}
      </Box>
    </Box>
  )
}
