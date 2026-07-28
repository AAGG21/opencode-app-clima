import { useState, useEffect } from 'react'
import { Box, Text, useInput, useApp } from 'ink'
import { load, save } from '../storage'
import type { AppData, City } from '../types'
import { colors } from '../theme'
import { Menu } from './Menu'
import { WeatherSingle } from './WeatherSingle'
import { WeatherAll } from './WeatherAll'
import { CitySearch } from './CitySearch'
import { CityListSelect } from './CityListSelect'
import { Settings } from './Settings'
import { PressAnyKey } from './PressAnyKey'

type Screen = 'menu' | 'weather-default' | 'weather-all' | 'search' | 'remove' | 'set-default' | 'settings'

export function App() {
  const { exit } = useApp()
  const [screen, setScreen] = useState<Screen>('menu')
  const [data, setData] = useState<AppData | null>(null)

  useEffect(() => {
    load().then(setData)
  }, [])

  useInput((input, key) => {
    if (key.ctrl && input === 'c') exit()
  })

  if (!data) {
    return (
      <Box padding={2}>
        <Text color={colors.textMuted}>Cargando...</Text>
      </Box>
    )
  }

  const updateAndSave = (next: AppData) => {
    setData(next)
    save(next)
  }

  const goTo = (s: Screen) => setScreen(s)

  const actionScreens: Screen[] = ['weather-default', 'weather-all', 'search', 'remove', 'set-default', 'settings']

  switch (screen) {
    case 'menu':
      return (
        <Menu
          data={data}
          onSelect={(idx: number) => {
            if (idx === 6) exit()
            goTo(actionScreens[idx]!)
          }}
        />
      )

    case 'weather-default': {
      if (data.defaultCityIndex === null || !data.cities[data.defaultCityIndex]) {
        return (
          <Box flexDirection="column" padding={1}>
            <Box borderStyle="round" borderColor={colors.border} padding={2}>
              <Text color={colors.error}>No hay ciudad default configurada.</Text>
              <Box marginTop={1}><PressAnyKey onPress={() => goTo('menu')} /></Box>
            </Box>
          </Box>
        )
      }
      return (
        <WeatherSingle
          city={data.cities[data.defaultCityIndex]!}
          unit={data.unit}
          onDone={() => goTo('menu')}
        />
      )
    }

    case 'weather-all':
      return <WeatherAll cities={data.cities} unit={data.unit} onDone={() => goTo('menu')} />

    case 'search':
      return (
        <CitySearch
          onAdd={(city: City) => {
            data.cities.push(city)
            if (data.defaultCityIndex === null) data.defaultCityIndex = 0
            updateAndSave({ ...data })
            goTo('menu')
          }}
          onCancel={() => goTo('menu')}
        />
      )

    case 'remove':
      return (
        <CityListSelect
          cities={data.cities}
          title="Selecciona ciudad a eliminar:"
          onSelect={(idx: number) => {
            const removed = data.cities.splice(idx, 1)[0]!
            if (data.defaultCityIndex !== null) {
              if (data.defaultCityIndex >= data.cities.length) {
                data.defaultCityIndex = data.cities.length > 0 ? 0 : null
              } else if (idx < data.defaultCityIndex) {
                data.defaultCityIndex--
              }
            }
            updateAndSave({ ...data })
            goTo('menu')
          }}
          onCancel={() => goTo('menu')}
        />
      )

    case 'set-default':
      return (
        <CityListSelect
          cities={data.cities}
          title="Selecciona ciudad default:"
          onSelect={(idx: number) => {
            data.defaultCityIndex = idx
            updateAndSave({ ...data })
            goTo('menu')
          }}
          onCancel={() => goTo('menu')}
        />
      )

    case 'settings':
      return (
        <Settings
          unit={data.unit}
          onToggle={() => {
            data.unit = data.unit === 'celsius' ? 'fahrenheit' : 'celsius'
            updateAndSave({ ...data })
            goTo('menu')
          }}
          onDone={() => goTo('menu')}
        />
      )
  }
}
