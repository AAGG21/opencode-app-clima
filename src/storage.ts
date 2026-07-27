import { join } from 'path'
import { homedir } from 'os'
import type { AppData } from './types'

const DATA_DIR = process.env.WEATHER_CLI_DATA_DIR ?? join(homedir(), '.config', 'weather-cli')
const DATA_FILE = join(DATA_DIR, 'data.json')

function defaultData(): AppData {
  return { cities: [], defaultCityIndex: null, unit: 'celsius' }
}

function ensureDir(): void {
  try {
    Bun.spawnSync(['mkdir', '-p', DATA_DIR])
  } catch {}
}

export async function load(): Promise<AppData> {
  try {
    const file = Bun.file(DATA_FILE)
    const exists = await file.exists()
    if (!exists) return defaultData()
    const text = await file.text()
    return JSON.parse(text) as AppData
  } catch {
    return defaultData()
  }
}

export async function save(data: AppData): Promise<void> {
  ensureDir()
  await Bun.write(DATA_FILE, JSON.stringify(data, null, 2))
}
