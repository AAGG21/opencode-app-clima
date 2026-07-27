import { useState, useEffect } from 'react'
import { Box, Text, useInput } from 'ink'
import type { City, CurrentWeather } from '../types'
import { getWeather, weatherEmoji, weatherDescription } from '../weather'
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
  const [results, setResults] = useState<Result[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (cities.length === 0) {
      setDone(true)
      return
    }
    if (currentIndex >= cities.length) {
      setDone(true)
      return
    }
    const city = cities[currentIndex]!
    getWeather(city, unit)
      .then(weather => {
        setResults(prev => [...prev, { type: 'ok', city, weather }])
        setCurrentIndex(prev => prev + 1)
      })
      .catch(err => {
        setResults(prev => [...prev, { type: 'error', city, error: String(err) }])
        setCurrentIndex(prev => prev + 1)
      })
  }, [currentIndex, cities, unit])

  useInput(() => {
    if (done) onDone()
  }, [done])

  if (cities.length === 0) {
    return (
      <Box flexDirection="column" padding={2}>
        <Text color="red">No hay ciudades registradas.</Text>
        <Box marginTop={1}>
          <PressAnyKey onPress={onDone} />
        </Box>
      </Box>
    )
  }

  const unitSymbol = unit === 'celsius' ? '°C' : '°F'

  return (
    <Box flexDirection="column" padding={2}>
      {results.map((r, i) =>
        r.type === 'ok' ? (
          <Box key={i} flexDirection="column" marginBottom={1}>
            <Box>
              <Text>{weatherEmoji(r.weather.weatherCode)} </Text>
              <Text bold color="yellow">{r.city.name}{r.city.country ? `, ${r.city.country}` : ''}</Text>
            </Box>
            <Text color="cyan">{'─'.repeat(36)}</Text>
            <Text>  Temperatura:       <Text bold color="yellow">{r.weather.temperature}{unitSymbol}</Text></Text>
            <Text>  Sensación térmica: <Text bold color="yellow">{r.weather.apparentTemperature}{unitSymbol}</Text></Text>
            <Text>  Condición:         {weatherDescription(r.weather.weatherCode)}</Text>
          </Box>
        ) : (
          <Text key={i} color="red">Error con {r.city.name}: {r.error}</Text>
        )
      )}
      {!done && currentIndex < cities.length && (
        <Text dimColor>Consultando {cities[currentIndex]?.name}...</Text>
      )}
      {done && (
        <Box marginTop={1}>
          <PressAnyKey onPress={onDone} />
        </Box>
      )}
    </Box>
  )
}
