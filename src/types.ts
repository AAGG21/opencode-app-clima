export interface City {
  name: string
  latitude: number
  longitude: number
  country?: string
}

export interface AppData {
  cities: City[]
  defaultCityIndex: number | null
  unit: 'celsius' | 'fahrenheit'
}

export interface GeocodingResult {
  id: number
  name: string
  latitude: number
  longitude: number
  country: string
  admin1?: string
}

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
