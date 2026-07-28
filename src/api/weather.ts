import type { City } from '../types/City'
import type { CurrentWeather, ForecastData } from '../types/Weather'
import { FORECAST_URL } from '../utils/constants'

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

export async function getForecast(city: City, unit: 'celsius' | 'fahrenheit'): Promise<ForecastData> {
  const tempUnit = unit === 'celsius' ? 'celsius' : 'fahrenheit'
  const url = `${FORECAST_URL}?latitude=${city.latitude}&longitude=${city.longitude}&daily=temperature_2m_max,temperature_2m_min,weather_code&temperature_unit=${tempUnit}&forecast_days=7`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Forecast API error: ${res.status}`)
  const data = await res.json() as {
    daily: {
      time: string[]
      temperature_2m_max: number[]
      temperature_2m_min: number[]
      weather_code: number[]
    }
  }
  return {
    city,
    days: data.daily.time.map((date, i) => ({
      date,
      temperatureMax: data.daily.temperature_2m_max[i]!,
      temperatureMin: data.daily.temperature_2m_min[i]!,
      weatherCode: data.daily.weather_code[i]!,
    })),
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
