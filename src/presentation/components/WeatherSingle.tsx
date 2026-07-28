import { useState, useEffect } from 'react'
import { Box, Text, useInput } from 'ink'
import type { City } from '../../types/City'
import type { CurrentWeather } from '../../types/Weather'
import { getWeather, weatherEmoji, weatherDescription } from '../../api/weather'
import { colors } from '../../utils/colors'
import { PressAnyKey } from './PressAnyKey'

interface Props {
  city: City
  unit: 'celsius' | 'fahrenheit'
  onDone: () => void
}

export function WeatherSingle({ city, unit, onDone }: Props) {
  const [weather, setWeather] = useState<CurrentWeather | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getWeather(city, unit).then(setWeather).catch(e => setError(String(e)))
  }, [city, unit])

  useInput(() => {
    if (weather || error) onDone()
  }, [weather, error])

  const unitSymbol = unit === 'celsius' ? '°C' : '°F'

  return (
    <Box flexDirection="column" padding={1}>
      <Box borderStyle="round" borderColor={colors.border} flexDirection="column" padding={2}>
        {!weather && !error && <Text color={colors.textMuted}>Consultando clima...</Text>}
        {error && <Text color={colors.error}>Error: {error}</Text>}
        {weather && (
          <>
            <Box marginBottom={1}>
              <Text>{weatherEmoji(weather.weatherCode)} </Text>
              <Text bold color={colors.accent}>{city.name}{city.country ? `, ${city.country}` : ''}</Text>
            </Box>
            <Box borderStyle="single" borderColor={colors.dimBorder} paddingX={2} paddingY={1} flexDirection="column">
              <Text>Temperatura:       <Text bold color={colors.warning}>{weather.temperature}{unitSymbol}</Text></Text>
              <Text>Sensación térmica: <Text bold color={colors.warning}>{weather.apparentTemperature}{unitSymbol}</Text></Text>
              <Text>Condición:         {weatherDescription(weather.weatherCode)}</Text>
            </Box>
            <Box marginTop={1}>
              <PressAnyKey onPress={onDone} />
            </Box>
          </>
        )}
      </Box>
    </Box>
  )
}
