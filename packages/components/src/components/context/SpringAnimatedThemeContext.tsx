import React, { useContext } from 'react'

import { ThemeColors } from '@devhub/core'
import { useSpring, UseSpringProps } from 'react-spring/native'
import { useReduxState } from '../../hooks/use-redux-state'
import * as selectors from '../../redux/selectors'
import { defaultTheme } from '../../styles/utils'
import { pickThemeColors } from '../../utils/helpers/theme'

export interface SpringAnimatedThemeProviderProps {
  children?: React.ReactNode
}

export type SpringAnimatedThemeProviderState = UseSpringProps<
  ThemeColors & { isDark: 0 | 1; isInverted: 0 | 1 }
>

export const SpringAnimatedThemeContext = React.createContext<
  SpringAnimatedThemeProviderState
>({
  ...pickThemeColors(defaultTheme),
  isDark: defaultTheme.isDark ? 1 : 0,
  isInverted: defaultTheme.isInverted ? 1 : 0,
})
SpringAnimatedThemeContext.displayName = 'SpringAnimatedThemeContext'

export const SpringAnimatedThemeConsumer = SpringAnimatedThemeContext.Consumer
;(SpringAnimatedThemeConsumer as any).displayName =
  'SpringAnimatedThemeConsumer'

export function SpringAnimatedThemeProvider(
  props: SpringAnimatedThemeProviderProps,
) {
  const initialTheme = useReduxState(selectors.themeSelector, theme => {
    setSpringAnimatedTheme({
      ...pickThemeColors(theme),
      isDark: (theme.isDark ? 1 : 0) as (0 | 1),
      isInverted: (theme.isInverted ? 1 : 0) as (0 | 1),
    })
  })

  const [springAnimatedTheme, setSpringAnimatedTheme] = useSpring(() => ({
    immediate: true,
    ...pickThemeColors(initialTheme),
    isDark: (initialTheme.isDark ? 1 : 0) as (0 | 1),
    isInverted: (initialTheme.isInverted ? 1 : 0) as (0 | 1),
  }))

  return (
    <SpringAnimatedThemeContext.Provider value={springAnimatedTheme}>
      {props.children}
    </SpringAnimatedThemeContext.Provider>
  )
}

export function useSpringAnimatedTheme() {
  return useContext(SpringAnimatedThemeContext)
}
