import React, { useCallback, useContext, useEffect } from 'react'

import { Theme, ThemeTransformer } from '@devhub/core'
import { useReduxState } from '../../hooks/use-redux-state'
import { useReduxStateCallback } from '../../hooks/use-redux-state-callback'
import { Browser } from '../../libs/browser'
import * as selectors from '../../redux/selectors'
import { defaultTheme } from '../../styles/utils'
import { transformTheme } from '../../utils/helpers/theme'
import { getColumnHeaderThemeColors } from '../columns/ColumnHeader'

export interface ThemeProviderProps {
  children: React.ReactNode
}

export type ThemeProviderState = Theme

export const ThemeContext = React.createContext<ThemeProviderState>(
  defaultTheme,
)
ThemeContext.displayName = 'ThemeContext'

export function ThemeProvider(props: ThemeProviderProps) {
  const theme = useReduxState(selectors.themeSelector)

  useEffect(() => {
    const headerThemeColors = getColumnHeaderThemeColors(theme.backgroundColor)
    Browser.setBackgroundColor(theme[headerThemeColors.normal])
    Browser.setForegroundColor(theme.foregroundColor)
  }, [theme])

  return (
    <ThemeContext.Provider value={theme}>
      {props.children}
    </ThemeContext.Provider>
  )
}

export const ThemeConsumer = ThemeContext.Consumer
;(ThemeConsumer as any).displayName = 'ThemeConsumer'

export function useTheme({
  themeTransformer,
}: { themeTransformer?: ThemeTransformer } = {}) {
  let theme = useContext(ThemeContext)
  if (themeTransformer) theme = transformTheme(theme, themeTransformer)

  return theme
}

export function useThemeCallback(
  {
    skipFirstCallback,
    themeTransformer,
  }: { skipFirstCallback?: boolean; themeTransformer?: ThemeTransformer } = {},
  callback: (theme: Theme) => void,
) {
  let initialTheme = useReduxStateCallback(
    selectors.themeSelector,
    useCallback(
      t => {
        const theme = themeTransformer ? transformTheme(t, themeTransformer) : t
        callback(theme)
      },
      [callback, skipFirstCallback, themeTransformer],
    ),
    { skipFirstCallback },
  )

  if (themeTransformer)
    initialTheme = transformTheme(initialTheme, themeTransformer)

  const headerThemeColors = getColumnHeaderThemeColors(
    initialTheme.backgroundColor,
  )
  Browser.setBackgroundColor(initialTheme[headerThemeColors.normal])
  Browser.setForegroundColor(initialTheme.foregroundColor)

  return initialTheme
}
