import { Theme, themes } from '@devhub/core'
import React, { useContext, useMemo, useState } from 'react'

export interface ThemeProviderProps {
  children: React.ReactNode
}

export interface ThemeProviderState {
  theme: Theme
  toggleTheme: () => void
}

const defaultLightTheme = themes['light-white']!
const defaultDarkTheme = themes['dark-gray']!
const defaultTheme = defaultDarkTheme

export const ThemeContext = React.createContext<ThemeProviderState>({
  theme: defaultTheme,
  toggleTheme() {
    throw new Error('ThemeContext not yet initialized.')
  },
})
ThemeContext.displayName = 'ThemeContext'

export function ThemeProvider(props: ThemeProviderProps) {
  const [theme, setTheme] = useState(defaultTheme)

  /*
  useLayoutEffect(() => {
    const cache = getThemefromCache()
    if (cache) setTheme(cache)
  }, [])

  useEffect(() => {
    saveThemeOnCache(theme)
  }, [theme.id])

  */
  const value: ThemeProviderState = useMemo(
    () => ({
      theme,
      toggleTheme: () => {
        setTheme((t) => (t.isDark ? defaultLightTheme : defaultDarkTheme))
      },
    }),
    [theme.id],
  )

  return (
    <ThemeContext.Provider value={value}>
      {props.children}
    </ThemeContext.Provider>
  )
}

export const ThemeConsumer = ThemeContext.Consumer
;(ThemeConsumer as any).displayName = 'ThemeConsumer'

export function useTheme() {
  return useContext(ThemeContext)
}

/*
function getThemefromCache() {
  if (typeof localStorage === 'undefined') return

  try {
    const _cache = localStorage.getItem('theme')
    if (!_cache) return

    const cache = JSON.parse(_cache)
    if (!(cache && cache.id)) return

    const themeFromCache = loadTheme({ id: cache.id })
    if (
      !(themeFromCache && themeFromCache.id && themeFromCache.backgroundColor)
    )
      return

    return themeFromCache
  } catch (error) {
    console.error(error)
  }
}

function saveThemeOnCache(theme: Theme) {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem('theme', JSON.stringify({ id: theme.id }))
}
*/
