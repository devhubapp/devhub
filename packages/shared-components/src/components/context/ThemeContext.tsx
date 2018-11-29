import React, { useContext } from 'react'

import { Theme } from 'shared-core/dist/types'
import { useReduxState } from '../../redux/hooks/use-redux-state'
import * as selectors from '../../redux/selectors'
import { defaultThemePair } from '../../redux/selectors/config'
import { loadTheme } from '../../styles/utils'

export interface ThemeProviderProps {
  children?: React.ReactNode
}

export type ThemeProviderState = Theme

const defaultTheme = loadTheme(defaultThemePair)

export const ThemeContext = React.createContext<ThemeProviderState>(
  defaultTheme,
)

export const ThemeConsumer = ThemeContext.Consumer

export function ThemeProvider(props: ThemeProviderProps) {
  const theme = useReduxState(selectors.themeSelector)

  return (
    <ThemeContext.Provider value={theme}>
      {props.children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
