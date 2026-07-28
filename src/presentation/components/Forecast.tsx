import { useState, useEffect } from 'react'
import { Box, Text, useInput } from 'ink'
import type { City } from '../../types/City'
import type { ForecastData } from '../../types/Weather'
import { getForecast, weatherEmoji, weatherDescription } from '../../api/weather'
import { colors } from '../../utils/colors'
import { formatDate } from '../../utils/format'
import { PressAnyKey } from './PressAnyKey'

interface Props {
  city: City
  unit: 'celsius' | 'fahrenheit'
  onDone: () => void
}

export function Forecast({ city, unit, onDone }: Props) {
  const [forecast, setForecast] = useState<ForecastData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getForecast(city, unit).then(setForecast).catch(e => setError(String(e)))
  }, [city, unit])

  useInput(() => {
    if (forecast || error) onDone()
  }, [forecast, error])

  const unitSymbol = unit === 'celsius' ? '°C' : '°F'

  return (
    <Box flexDirection="column" padding={1}>
      <Box borderStyle="round" borderColor={colors.border} flexDirection="column" padding={2}>
        {!forecast && !error && <Text color={colors.textMuted}>Consultando pronóstico...</Text>}
        {error && <Text color={colors.error}>Error: {error}</Text>}
        {forecast && (
          <>
            <Box marginBottom={1}>
              <Text bold color={colors.accent}>Pronóstico 7 días — {city.name}{city.country ? `, ${city.country}` : ''}</Text>
            </Box>
            {forecast.days.map((day, i) => (
              <Box key={day.date} borderStyle="single" borderColor={colors.dimBorder} paddingX={2} paddingY={1} marginBottom={i < forecast.days.length - 1 ? 1 : 0}>
                <Box flexDirection="column">
                  <Text bold color={colors.accent}>{formatDate(day.date)}</Text>
                  <Box marginTop={1}>
                    <Text>{weatherEmoji(day.weatherCode)} </Text>
                    <Text>{weatherDescription(day.weatherCode)}</Text>
                  </Box>
                  <Box marginTop={1}>
                    <Text>Máx: <Text bold color={colors.warning}>{day.temperatureMax}{unitSymbol}</Text></Text>
                    <Text>  |  </Text>
                    <Text>Mín: <Text bold color={colors.warning}>{day.temperatureMin}{unitSymbol}</Text></Text>
                  </Box>
                </Box>
              </Box>
            ))}
            <Box marginTop={1}>
              <PressAnyKey onPress={onDone} />
            </Box>
          </>
        )}
      </Box>
    </Box>
  )
}
