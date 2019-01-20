import React, { useContext } from 'react'

import { ThemeColors } from '@devhub/core'
import { useSpring, UseSpringProps } from 'react-spring/native-hooks'
import { useReduxState } from '../../hooks/use-redux-state'
import * as selectors from '../../redux/selectors'
import { defaultTheme } from '../../styles/utils'
import { pickThemeColors } from '../../utils/helpers/theme'

export interface SpringAnimatedThemeProviderProps {
  children?: React.ReactNode
}

export type SpringAnimatedThemeProviderState = UseSpringProps<ThemeColors>

export const SpringAnimatedThemeContext = React.createContext<
  SpringAnimatedThemeProviderState
>(pickThemeColors(defaultTheme))

export const SpringAnimatedThemeConsumer = SpringAnimatedThemeContext.Consumer

export function SpringAnimatedThemeProvider(
  props: SpringAnimatedThemeProviderProps,
) {
  const initialTheme = useReduxState(selectors.themeSelector, theme => {
    setSpringAnimatedTheme({
      ...pickThemeColors(theme),
    })
  })

  const [springAnimatedTheme, setSpringAnimatedTheme] = useSpring(() => ({
    immediate: true,
    native: true,
    ...pickThemeColors(initialTheme),
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
