import { Text, useInput } from 'ink'

interface Props {
  onPress: () => void
}

export function PressAnyKey({ onPress }: Props) {
  useInput(() => { onPress() })
  return <Text dimColor>Presiona cualquier tecla para continuar</Text>
}
