import { useState } from 'react'
import { Box, Text, useInput } from 'ink'
import type { City } from '../types'
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
      <Box flexDirection="column" padding={2}>
        <Text color="red">No hay ciudades registradas.</Text>
        <Box marginTop={1}>
          <PressAnyKey onPress={onCancel} />
        </Box>
      </Box>
    )
  }

  return (
    <Box flexDirection="column" padding={2}>
      <Text bold>{title}</Text>
      <Box flexDirection="column" marginTop={1}>
        {cities.map((c, i) => (
          <Text key={i} inverse={i === active}>
            {i === active ? ' ▸ ' : '   '}{i + 1}. {c.name}{c.country ? `, ${c.country}` : ''}
          </Text>
        ))}
      </Box>
      <Text dimColor marginTop={1}>Flechas para navegar, Enter para seleccionar, Escape para cancelar</Text>
    </Box>
  )
}
