import type { GeocodingResult } from './types'

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search'

export async function searchCity(query: string): Promise<GeocodingResult[]> {
  const url = `${GEOCODING_URL}?name=${encodeURIComponent(query)}&count=5&format=json`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Geocoding error: ${res.status}`)
  const data = await res.json() as { results?: GeocodingResult[] }
  return data.results ?? []
}
