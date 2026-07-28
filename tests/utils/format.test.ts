import { describe, it, expect } from 'bun:test'
import { formatDate } from '../../src/utils/format'

describe('formatDate', () => {
  it('formats a normal date correctly', () => {
    const result = formatDate('2025-06-15')
    expect(result).toMatch(/^[A-Za-záéíóú]{3} 15\/06$/)
  })

  it('returns Dom for Sunday', () => {
    expect(formatDate('2025-03-16')).toBe('Dom 16/03')
  })

  it('returns Sáb for Saturday', () => {
    expect(formatDate('2025-03-22')).toBe('Sáb 22/03')
  })

  it('pads single-digit day', () => {
    const result = formatDate('2025-03-05')
    expect(result).toMatch(/ 05\/03$/)
  })

  it('pads single-digit month', () => {
    const result = formatDate('2025-01-15')
    expect(result).toMatch(/15\/01$/)
  })
})
