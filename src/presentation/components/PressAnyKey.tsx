import { Text, useInput } from 'ink'
import { colors } from '../../utils/colors'

interface Props {
  onPress: () => void
}

export function PressAnyKey({ onPress }: Props) {
  useInput(() => { onPress() })
  return <Text color={colors.textMuted}>Presiona cualquier tecla para continuar</Text>
}
