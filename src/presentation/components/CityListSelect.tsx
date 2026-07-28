import { useState } from 'react'
import { Box, Text, useInput } from 'ink'
import type { City } from '../../types/City'
import { colors } from '../../utils/colors'
import { PressAnyKey } from './PressAnyKey'

interface Props {
  cities: City[]
  title: string
  onSelect: (index: number) => void
  onCancel: () => void
}

export function CityListSelect({ cities, title, onSelect, onCancel }: Props) {
  const [active, setActive] = useState(0)

  useInput((_input, key) => {
    if (key.upArrow) setActive(i => (i > 0 ? i - 1 : cities.length - 1))
    else if (key.downArrow) setActive(i => (i < cities.length - 1 ? i + 1 : 0))
    else if (key.return) onSelect(active)
    else if (key.escape) onCancel()
  })

  if (cities.length === 0) {
    return (
      <Box flexDirection="column" padding={1}>
        <Box borderStyle="round" borderColor={colors.border} padding={2}>
          <Text color={colors.error}>No hay ciudades registradas.</Text>
          <Box marginTop={1}><PressAnyKey onPress={onCancel} /></Box>
        </Box>
      </Box>
    )
  }

  return (
    <Box flexDirection="column" padding={1}>
      <Box borderStyle="round" borderColor={colors.border} flexDirection="column" padding={2}>
        <Text bold color={colors.accent}>{title}</Text>
        <Box flexDirection="column" marginTop={1}>
          {cities.map((c, i) => (
            <Text key={i} color={i === active ? colors.accent : undefined}>
              {i === active ? ' ▸ ' : '   '}{c.name}{c.country ? `, ${c.country}` : ''}
            </Text>
          ))}
        </Box>
        <Text color={colors.textMuted} marginTop={1}>Flechas — navegar  |  Enter — seleccionar  |  Escape — volver</Text>
      </Box>
    </Box>
  )
}
