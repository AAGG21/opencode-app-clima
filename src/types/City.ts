export interface City {
  name: string
  latitude: number
  longitude: number
  country?: string
}

export interface GeocodingResult {
  id: number
  name: string
  latitude: number
  longitude: number
  country: string
  admin1?: string
}
