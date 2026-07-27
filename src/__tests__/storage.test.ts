import { describe, it, expect, beforeEach, afterEach } from 'bun:test'
import { join } from 'path'
import { mkdtempSync, rmSync } from 'fs'

const tmpDir = mkdtempSync(join(import.meta.dir, '..', '..', '.tmp-test-'))

beforeEach(() => {
  process.env.WEATHER_CLI_DATA_DIR = tmpDir
})

afterEach(() => {
  delete process.env.WEATHER_CLI_DATA_DIR
  rmSync(tmpDir, { recursive: true, force: true })
})

describe('storage', () => {
  it('loads default data when no file exists', async () => {
    const { load } = await import('../storage')
    const data = await load()
    expect(data.cities).toEqual([])
    expect(data.defaultCityIndex).toBeNull()
    expect(data.unit).toBe('celsius')
  })

  it('saves and loads data correctly', async () => {
    const { load, save } = await import('../storage')
    await save({ cities: [{ name: 'Ottawa', latitude: 45.42, longitude: -75.7, country: 'Canada' }], defaultCityIndex: 0, unit: 'fahrenheit' })
    const loaded = await load()
    expect(loaded.cities).toHaveLength(1)
    expect(loaded.cities[0]!.name).toBe('Ottawa')
    expect(loaded.defaultCityIndex).toBe(0)
    expect(loaded.unit).toBe('fahrenheit')
  })
})
