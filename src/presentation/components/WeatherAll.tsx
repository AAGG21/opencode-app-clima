import { useState, useEffect } from 'react'
import { Box, Text, useInput } from 'ink'
import type { City } from '../../types/City'
import type { CurrentWeather } from '../../types/Weather'
import { getWeather, weatherEmoji, weatherDescription } from '../../api/weather'
import { colors } from '../../utils/colors'
import { PressAnyKey } from './PressAnyKey'

interface Props {
  cities: City[]
  unit: 'celsius' | 'fahrenheit'
  onDone: () => void
}

type Result =
  | { type: 'ok'; city: City; weather: CurrentWeather }
  | { type: 'error'; city: City; error: string }

export function WeatherAll({ cities, unit, onDone }: Props) {
  const [results, setResults] = useState<Result[] | null>(null)

  useEffect(() => {
    if (cities.length === 0) {
      setResults([])
      return
    }
    Promise.all(
      cities.map(city =>
        getWeather(city, unit)
          .then(weather => ({ type: 'ok' as const, city, weather }))
          .catch(err => ({ type: 'error' as const, city, error: String(err) }))
      )
    ).then(setResults)
  }, [cities, unit])

  useInput(() => {
    if (results) onDone()
  }, { isActive: !!results })

  if (cities.length === 0) {
    return (
      <Box flexDirection="column" padding={1}>
        <Box borderStyle="round" borderColor={colors.border} padding={2}>
          <Text color={colors.error}>No hay ciudades registradas.</Text>
          <Box marginTop={1}><PressAnyKey onPress={onDone} /></Box>
        </Box>
      </Box>
    )
  }

  const unitSymbol = unit === 'celsius' ? '°C' : '°F'

  return (
    <Box flexDirection="column" padding={1}>
      <Box borderStyle="round" borderColor={colors.border} flexDirection="column" padding={2}>
        {!results && <Text color={colors.textMuted}>Consultando clima de {cities.length} ciudades...</Text>}
        {results && results.map((r, i) =>
          r.type === 'ok' ? (
            <Box key={i} flexDirection="column" marginBottom={1}>
              <Box marginBottom={1}>
                <Text>{weatherEmoji(r.weather.weatherCode)} </Text>
                <Text bold color={colors.accent}>{r.city.name}{r.city.country ? `, ${r.city.country}` : ''}</Text>
              </Box>
              <Box borderStyle="single" borderColor={colors.dimBorder} paddingX={2} paddingY={1} flexDirection="column">
                <Text>Temperatura:       <Text bold color={colors.warning}>{r.weather.temperature}{unitSymbol}</Text></Text>
                <Text>Sensación térmica: <Text bold color={colors.warning}>{r.weather.apparentTemperature}{unitSymbol}</Text></Text>
                <Text>Condición:         {weatherDescription(r.weather.weatherCode)}</Text>
              </Box>
            </Box>
          ) : (
            <Text key={i} color={colors.error}>Error con {r.city.name}: {r.error}</Text>
          )
        )}
        {results && (
          <Box marginTop={1}><PressAnyKey onPress={onDone} /></Box>
        )}
      </Box>
    </Box>
  )
}
