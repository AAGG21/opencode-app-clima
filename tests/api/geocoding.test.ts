import { describe, it, expect, spyOn, afterEach } from 'bun:test'
import { searchCity } from '../../src/api/geocoding'

afterEach(() => {
  spyOn(globalThis, 'fetch').mockRestore()
})

describe('searchCity', () => {
  it('returns parsed results on success', async () => {
    spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({
        results: [
          { id: 1, name: 'Ottawa', latitude: 45.42, longitude: -75.7, country: 'Canada', admin1: 'Ontario' },
          { id: 2, name: 'Ottawa', latitude: 41.35, longitude: -89.01, country: 'United States', admin1: 'Illinois' },
        ],
      }), { status: 200 }),
    )

    const results = await searchCity('ottawa')
    expect(results).toHaveLength(2)
    expect(results[0]!.name).toBe('Ottawa')
    expect(results[0]!.country).toBe('Canada')
    expect(results[1]!.admin1).toBe('Illinois')
  })

  it('returns empty array when no results', async () => {
    spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ results: undefined }), { status: 200 }),
    )

    const results = await searchCity('xzxyy')
    expect(results).toEqual([])
  })

  it('returns empty array when results key is missing', async () => {
    spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({}), { status: 200 }),
    )

    const results = await searchCity('')
    expect(results).toEqual([])
  })

  it('throws on non-ok response', async () => {
    spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(null, { status: 429 }),
    )

    expect(searchCity('ottawa')).rejects.toThrow('Geocoding error: 429')
  })
})
