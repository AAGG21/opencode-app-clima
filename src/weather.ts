import type { City, CurrentWeather } from './types'

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'

export async function getWeather(city: City, unit: 'celsius' | 'fahrenheit'): Promise<CurrentWeather> {
  const tempUnit = unit === 'celsius' ? 'celsius' : 'fahrenheit'
  const url = `${FORECAST_URL}?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,apparent_temperature,weather_code&temperature_unit=${tempUnit}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Weather API error: ${res.status}`)
  const data = await res.json() as {
    current: {
      temperature_2m: number
      apparent_temperature: number
      weather_code: number
    }
  }
  return {
    temperature: data.current.temperature_2m,
    apparentTemperature: data.current.apparent_temperature,
    weatherCode: data.current.weather_code,
  }
}

export function weatherEmoji(code: number): string {
  if (code === 0) return '☀️'
  if (code <= 3) return '⛅'
  if (code <= 48) return '🌫️'
  if (code <= 57) return '🌧️'
  if (code <= 67) return '🌧️'
  if (code <= 77) return '❄️'
  if (code <= 82) return '🌦️'
  if (code <= 86) return '🌨️'
  return '⛈️'
}

export function weatherDescription(code: number): string {
  if (code === 0) return 'Cielo despejado'
  if (code === 1) return 'Mayormente despejado'
  if (code === 2) return 'Parcialmente nublado'
  if (code === 3) return 'Nublado'
  if (code === 45 || code === 48) return 'Niebla'
  if (code >= 51 && code <= 55) return 'Llovizna'
  if (code >= 56 && code <= 57) return 'Llovizna helada'
  if (code >= 61 && code <= 65) return 'Lluvia'
  if (code >= 66 && code <= 67) return 'Lluvia helada'
  if (code >= 71 && code <= 77) return 'Nieve'
  if (code >= 80 && code <= 82) return 'Chubascos'
  if (code >= 85 && code <= 86) return 'Chubascos de nieve'
  if (code === 95) return 'Tormenta'
  if (code >= 96) return 'Tormenta con granizo'
  return 'Desconocido'
}
