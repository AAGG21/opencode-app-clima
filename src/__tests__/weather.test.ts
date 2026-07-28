import { describe, it, expect } from 'bun:test'
import { weatherEmoji, weatherDescription } from '../api/weather'

describe('weatherEmoji', () => {
  it('returns sun for clear sky (0)', () => expect(weatherEmoji(0)).toBe('☀️'))
  it('returns cloudy for 1-3', () => {
    expect(weatherEmoji(1)).toBe('⛅')
    expect(weatherEmoji(3)).toBe('⛅')
  })
  it('returns fog for 45-48', () => expect(weatherEmoji(45)).toBe('🌫️'))
  it('returns rain for 61-67', () => expect(weatherEmoji(61)).toBe('🌧️'))
  it('returns snow for 71-77', () => expect(weatherEmoji(71)).toBe('❄️'))
  it('returns thunderstorm for 95+', () => expect(weatherEmoji(95)).toBe('⛈️'))
})

describe('weatherDescription', () => {
  it('describes clear sky', () => expect(weatherDescription(0)).toBe('Cielo despejado'))
  it('describes rain', () => expect(weatherDescription(61)).toBe('Lluvia'))
  it('describes snow', () => expect(weatherDescription(71)).toBe('Nieve'))
  it('describes thunderstorm', () => expect(weatherDescription(95)).toBe('Tormenta'))
  it('handles unknown code', () => expect(weatherDescription(-1)).toBe('Desconocido'))
})
