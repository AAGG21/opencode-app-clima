import { Box, Text, useInput } from 'ink'
import { colors } from '../theme'

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
    <Box flexDirection="column" padding={1}>
      <Box borderStyle="round" borderColor={colors.border} flexDirection="column" padding={2}>
        <Text bold color={colors.accent}>Ajustes</Text>
        <Box marginTop={1} borderStyle="single" borderColor={colors.dimBorder} paddingX={2} paddingY={1}>
          <Box>
            <Text>Unidad: </Text>
            <Text bold color={colors.accent}>{unitSymbol}</Text>
          </Box>
          <Text color={colors.textMuted} marginTop={1}>Enter — cambiar unidad</Text>
        </Box>
        <Text color={colors.textMuted} marginTop={1}>Escape — volver</Text>
      </Box>
    </Box>
  )
}
