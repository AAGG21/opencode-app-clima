import { describe, it, expect, beforeEach, afterEach, afterAll } from 'bun:test'
import { join } from 'path'
import { mkdtempSync, rmSync } from 'fs'

const tmpDir = mkdtempSync(join(import.meta.dir, '..', '..', '.tmp-test-'))

beforeEach(() => {
  process.env.WEATHER_CLI_DATA_DIR = tmpDir
})

afterEach(() => {
  delete process.env.WEATHER_CLI_DATA_DIR
})

afterAll(() => {
  rmSync(tmpDir, { recursive: true, force: true })
})

describe('storage', () => {
  it('loads default data when no file exists', async () => {
    const { load } = await import('../../src/storage')
    const data = await load()
    expect(data.cities).toEqual([])
    expect(data.defaultCityIndex).toBeNull()
    expect(data.unit).toBe('celsius')
  })

  it('loads default data when file is corrupt', async () => {
    const fs = await import('fs')
    fs.mkdirSync(tmpDir, { recursive: true })
    fs.writeFileSync(join(tmpDir, 'data.json'), 'not-json', 'utf-8')

    const { load } = await import('../../src/storage')
    const data = await load()
    expect(data.cities).toEqual([])
    expect(data.defaultCityIndex).toBeNull()
  })

  it('saves and loads data correctly', async () => {
    const { load, save } = await import('../../src/storage')
    await save({
      cities: [{ name: 'Ottawa', latitude: 45.42, longitude: -75.7, country: 'Canada' }],
      defaultCityIndex: 0,
      unit: 'fahrenheit',
    })

    const loaded = await load()
    expect(loaded.cities).toHaveLength(1)
    expect(loaded.cities[0]!.name).toBe('Ottawa')
    expect(loaded.cities[0]!.latitude).toBe(45.42)
    expect(loaded.defaultCityIndex).toBe(0)
    expect(loaded.unit).toBe('fahrenheit')
  })

  it('persists multiple cities', async () => {
    const { load, save } = await import('../../src/storage')
    await save({
      cities: [
        { name: 'Ottawa', latitude: 45.42, longitude: -75.7, country: 'Canada' },
        { name: 'Madrid', latitude: 40.42, longitude: -3.7, country: 'Spain' },
        { name: 'Tokyo', latitude: 35.68, longitude: 139.69, country: 'Japan' },
      ],
      defaultCityIndex: 1,
      unit: 'celsius',
    })

    const loaded = await load()
    expect(loaded.cities).toHaveLength(3)
    expect(loaded.cities[1]!.name).toBe('Madrid')
    expect(loaded.defaultCityIndex).toBe(1)
    expect(loaded.unit).toBe('celsius')
  })

  it('overwrites existing data on save', async () => {
    const { load, save } = await import('../../src/storage')
    await save({ cities: [{ name: 'Ottawa', latitude: 45.42, longitude: -75.7, country: 'Canada' }], defaultCityIndex: 0, unit: 'celsius' })
    await save({ cities: [{ name: 'Madrid', latitude: 40.42, longitude: -3.7, country: 'Spain' }], defaultCityIndex: 0, unit: 'fahrenheit' })

    const loaded = await load()
    expect(loaded.cities).toHaveLength(1)
    expect(loaded.cities[0]!.name).toBe('Madrid')
    expect(loaded.unit).toBe('fahrenheit')
  })
})
