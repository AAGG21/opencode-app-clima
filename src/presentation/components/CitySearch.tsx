import { useState } from 'react'
import { Box, Text, useInput } from 'ink'
import type { City } from '../../types/City'
import type { GeocodingResult } from '../../types/City'
import { searchCity } from '../../api/geocoding'
import { colors } from '../../utils/colors'

interface Props {
  onAdd: (city: City) => void
  onCancel: () => void
}

type Phase = 'input' | 'searching' | 'results' | 'adding' | 'done'

export function CitySearch({ onAdd, onCancel }: Props) {
  const [query, setQuery] = useState('')
  const [phase, setPhase] = useState<Phase>('input')
  const [results, setResults] = useState<GeocodingResult[]>([])
  const [activeResult, setActiveResult] = useState(0)
  const [message, setMessage] = useState<string | null>(null)

  useInput((input, key) => {
    if (phase === 'input') {
      if (key.return) {
        const trimmed = query.trim()
        if (trimmed) {
          setPhase('searching')
          searchCity(trimmed)
            .then(r => {
              if (r.length === 0) {
                setPhase('input')
                setMessage('No se encontraron resultados.')
              } else {
                setResults(r)
                setActiveResult(0)
                setPhase('results')
                setMessage(null)
              }
            })
            .catch(e => {
              setPhase('input')
              setMessage(`Error: ${e}`)
            })
        }
      } else if (key.escape) {
        onCancel()
      } else if (key.backspace) {
        setQuery(q => q.slice(0, -1))
        setMessage(null)
      } else if (input && !key.ctrl && !key.meta) {
        setQuery(q => q + input)
        setMessage(null)
      }
    } else if (phase === 'results') {
      if (key.upArrow) setActiveResult(i => Math.max(0, i - 1))
      else if (key.downArrow) setActiveResult(i => Math.min(results.length - 1, i + 1))
      else if (key.return) {
        const selected = results[activeResult]!
        const newCity: City = {
          name: selected.name,
          latitude: selected.latitude,
          longitude: selected.longitude,
          country: selected.country,
        }
        onAdd(newCity)
      } else if (key.escape) {
        setPhase('input')
        setResults([])
        setMessage(null)
      }
    }
  })

  return (
    <Box flexDirection="column" padding={1}>
      <Box borderStyle="round" borderColor={colors.border} flexDirection="column" padding={2}>
        <Text bold color={colors.accent}>Buscar ciudad</Text>
        <Box marginTop={1} borderStyle="single" borderColor={colors.dimBorder} paddingX={1}>
          <Text>{'> '}</Text>
          <Text>{query || <Text color={colors.textMuted}>Escribe el nombre de la ciudad...</Text>}</Text>
        </Box>
        {phase === 'searching' && <Text color={colors.textMuted} marginTop={1}>Buscando...</Text>}
        {phase === 'results' && (
          <Box flexDirection="column" marginTop={1}>
            {results.map((r, i) => {
              const region = r.admin1 ? `, ${r.admin1}` : ''
              return (
                <Text key={r.id} color={i === activeResult ? colors.accent : undefined}>
                  {i === activeResult ? ' ▸ ' : '   '}{r.name}{region}, {r.country}
                </Text>
              )
            })}
          </Box>
        )}
        {message && <Text color={colors.error} marginTop={1}>{message}</Text>}
        {phase === 'results' && (
          <Text color={colors.textMuted} marginTop={1}>Flechas — navegar  |  Enter — agregar  |  Escape — volver</Text>
        )}
        {phase === 'input' && !message && (
          <Text color={colors.textMuted} marginTop={1}>Enter — buscar  |  Escape — cancelar</Text>
        )}
      </Box>
    </Box>
  )
}
