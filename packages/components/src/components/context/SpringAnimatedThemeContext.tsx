import React, { useContext } from 'react'

import { ThemeColors } from '@devhub/core'
import { useSpring, UseSpringProps } from 'react-spring/native'
import { defaultTheme } from '../../styles/utils'
import { pickThemeColors } from '../../utils/helpers/theme'
import { useThemeCallback } from './ThemeContext'

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

export const SpringAnimatedThemeProvider = React.memo(
  (props: SpringAnimatedThemeProviderProps) => {
    const initialTheme = useThemeCallback(
      { skipFirstCallback: true },
      theme => {
        setSpringAnimatedTheme({
          ...pickThemeColors(theme),
          isDark: (theme.isDark ? 1 : 0) as (0 | 1),
          isInverted: (theme.isInverted ? 1 : 0) as (0 | 1),
        })
      },
    )

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
  },
)

export function useSpringAnimatedTheme() {
  return useContext(SpringAnimatedThemeContext)
}
