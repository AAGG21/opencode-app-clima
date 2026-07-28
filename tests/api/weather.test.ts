import { describe, it, expect, spyOn, afterEach } from 'bun:test'
import { weatherEmoji, weatherDescription, getWeather, getForecast } from '../../src/api/weather'
import type { City } from '../../src/types/City'

afterEach(() => {
  spyOn(globalThis, 'fetch').mockRestore()
})

describe('weatherEmoji', () => {
  it('returns sun for clear sky (0)', () => {
    expect(weatherEmoji(0)).toBe('☀️')
  })

  it('returns cloudy for codes 1-3', () => {
    expect(weatherEmoji(1)).toBe('⛅')
    expect(weatherEmoji(2)).toBe('⛅')
    expect(weatherEmoji(3)).toBe('⛅')
  })

  it('returns fog for codes 45-48', () => {
    expect(weatherEmoji(45)).toBe('🌫️')
    expect(weatherEmoji(48)).toBe('🌫️')
  })

  it('returns rain for drizzle codes 51-57', () => {
    expect(weatherEmoji(51)).toBe('🌧️')
    expect(weatherEmoji(57)).toBe('🌧️')
  })

  it('returns rain for rain codes 61-67', () => {
    expect(weatherEmoji(61)).toBe('🌧️')
    expect(weatherEmoji(67)).toBe('🌧️')
  })

  it('returns snow for codes 71-77', () => {
    expect(weatherEmoji(71)).toBe('❄️')
    expect(weatherEmoji(77)).toBe('❄️')
  })

  it('returns showers for codes 80-82', () => {
    expect(weatherEmoji(80)).toBe('🌦️')
    expect(weatherEmoji(82)).toBe('🌦️')
  })

  it('returns snow showers for codes 85-86', () => {
    expect(weatherEmoji(85)).toBe('🌨️')
    expect(weatherEmoji(86)).toBe('🌨️')
  })

  it('returns thunderstorm for code 95+', () => {
    expect(weatherEmoji(95)).toBe('⛈️')
    expect(weatherEmoji(99)).toBe('⛈️')
  })
})

describe('weatherDescription', () => {
  it('describes clear sky', () => expect(weatherDescription(0)).toBe('Cielo despejado'))
  it('describes mostly clear', () => expect(weatherDescription(1)).toBe('Mayormente despejado'))
  it('describes partly cloudy', () => expect(weatherDescription(2)).toBe('Parcialmente nublado'))
  it('describes overcast', () => expect(weatherDescription(3)).toBe('Nublado'))
  it('describes fog', () => expect(weatherDescription(45)).toBe('Niebla'))
  it('describes freezing fog', () => expect(weatherDescription(48)).toBe('Niebla'))
  it('describes drizzle', () => expect(weatherDescription(51)).toBe('Llovizna'))
  it('describes freezing drizzle', () => expect(weatherDescription(56)).toBe('Llovizna helada'))
  it('describes rain', () => expect(weatherDescription(61)).toBe('Lluvia'))
  it('describes freezing rain', () => expect(weatherDescription(66)).toBe('Lluvia helada'))
  it('describes snow', () => expect(weatherDescription(71)).toBe('Nieve'))
  it('describes snow showers', () => expect(weatherDescription(85)).toBe('Chubascos de nieve'))
  it('describes thunderstorm', () => expect(weatherDescription(95)).toBe('Tormenta'))
  it('describes hail thunderstorm', () => expect(weatherDescription(99)).toBe('Tormenta con granizo'))
  it('handles unknown code', () => expect(weatherDescription(-1)).toBe('Desconocido'))
})

describe('getWeather', () => {
  const ottawa: City = { name: 'Ottawa', latitude: 45.42, longitude: -75.7, country: 'Canada' }

  it('returns parsed current weather data on success', async () => {
    spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({
        current: {
          temperature_2m: 22.5,
          apparent_temperature: 20.1,
          weather_code: 0,
        },
      }), { status: 200 }),
    )

    const result = await getWeather(ottawa, 'celsius')
    expect(result.temperature).toBe(22.5)
    expect(result.apparentTemperature).toBe(20.1)
    expect(result.weatherCode).toBe(0)
  })

  it('throws on non-ok response', async () => {
    spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(null, { status: 500 }),
    )

    expect(getWeather(ottawa, 'celsius')).rejects.toThrow('Weather API error: 500')
  })

  it('uses fahrenheit unit when specified', async () => {
    let calledUrl = ''
    spyOn(globalThis, 'fetch').mockImplementation(async (url: RequestInfo | URL) => {
      calledUrl = url.toString()
      return new Response(JSON.stringify({
        current: { temperature_2m: 72, apparent_temperature: 68, weather_code: 0 },
      }), { status: 200 })
    })

    await getWeather(ottawa, 'fahrenheit')
    expect(calledUrl).toContain('temperature_unit=fahrenheit')
  })
})

describe('getForecast', () => {
  const ottawa: City = { name: 'Ottawa', latitude: 45.42, longitude: -75.7, country: 'Canada' }

  const mockDaily = {
    time: ['2025-03-15', '2025-03-16', '2025-03-17'],
    temperature_2m_max: [10.5, 12.3, 8.1],
    temperature_2m_min: [2.1, 4.5, 0.3],
    weather_code: [0, 3, 61],
  }

  it('returns forecast data with 7 days', async () => {
    spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ daily: mockDaily }), { status: 200 }),
    )

    const result = await getForecast(ottawa, 'celsius')
    expect(result.city.name).toBe('Ottawa')
    expect(result.days).toHaveLength(3)
    expect(result.days[0]!.date).toBe('2025-03-15')
    expect(result.days[0]!.temperatureMax).toBe(10.5)
    expect(result.days[0]!.temperatureMin).toBe(2.1)
    expect(result.days[0]!.weatherCode).toBe(0)
  })

  it('throws on non-ok response', async () => {
    spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(null, { status: 503 }),
    )

    expect(getForecast(ottawa, 'celsius')).rejects.toThrow('Forecast API error: 503')
  })
})
