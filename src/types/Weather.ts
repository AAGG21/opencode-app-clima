import type { City } from './City'

export interface CurrentWeather {
  temperature: number
  apparentTemperature: number
  weatherCode: number
}

export interface DayForecast {
  date: string
  temperatureMax: number
  temperatureMin: number
  weatherCode: number
}

export interface ForecastData {
  city: City
  days: DayForecast[]
}
