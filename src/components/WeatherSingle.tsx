import { useState, useEffect } from 'react'
import { Box, Text, useInput } from 'ink'
import type { City, CurrentWeather } from '../types'
import { getWeather, weatherEmoji, weatherDescription } from '../weather'
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
    <Box flexDirection="column" padding={2}>
      {!weather && !error && <Text>Consultando clima...</Text>}
      {error && <Text color="red">Error: {error}</Text>}
      {weather && (
        <>
          <Box>
            <Text>{weatherEmoji(weather.weatherCode)} </Text>
            <Text bold color="yellow">{city.name}{city.country ? `, ${city.country}` : ''}</Text>
          </Box>
          <Text color="cyan">{'─'.repeat(40)}</Text>
          <Box marginTop={1} flexDirection="column">
            <Text>Temperatura:       <Text bold color="yellow">{weather.temperature}{unitSymbol}</Text></Text>
            <Text>Sensación térmica: <Text bold color="yellow">{weather.apparentTemperature}{unitSymbol}</Text></Text>
            <Text>Condición:         {weatherDescription(weather.weatherCode)}</Text>
          </Box>
          <Box marginTop={1}>
            <PressAnyKey onPress={onDone} />
          </Box>
        </>
      )}
    </Box>
  )
}
