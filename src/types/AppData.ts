import type { City } from './City'

export interface AppData {
  cities: City[]
  defaultCityIndex: number | null
  unit: 'celsius' | 'fahrenheit'
}
