import { Box, Text, useInput } from 'ink'

interface Props {
  unit: 'celsius' | 'fahrenheit'
  onToggle: () => void
  onDone: () => void
}

export function Settings({ unit, onToggle, onDone }: Props) {
  useInput((_input, key) => {
    if (key.return) onToggle()
    else if (key.escape) onDone()
  })

  const unitSymbol = unit === 'celsius' ? '°C' : '°F'

  return (
    <Box flexDirection="column" padding={2}>
      <Text bold>Ajustes</Text>
      <Box marginTop={1}>
        <Text>Unidad: {unitSymbol}  </Text>
        <Text dimColor>(Enter para cambiar)</Text>
      </Box>
      <Text dimColor marginTop={1}>Escape para volver</Text>
    </Box>
  )
}
