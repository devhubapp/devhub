import React from 'react'

import { getLuminance } from 'polished'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../hooks/use-css-variables-or-spring--animated-theme'
import { SpringAnimatedView } from '../animated/spring/SpringAnimatedView'
import { useTheme } from '../context/ThemeContext'

export const separatorSize = 1
export const separatorTickSize = 2

export function getSeparatorThemeColor(backgroundColor: string) {
  const luminance = getLuminance(backgroundColor)

  if (luminance <= 0.02) return 'backgroundColorLess16'
  if (luminance >= 0.95) return 'backgroundColorLess08'
  return 'backgroundColorMore08'
}

export interface SeparatorProps {
  horizontal?: boolean
  thick?: boolean
  zIndex?: number
}

export function Separator(props: SeparatorProps) {
  const { horizontal, thick, zIndex } = props

  const theme = useTheme()
  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

  const size = thick ? separatorTickSize : separatorSize
  const themeField = getSeparatorThemeColor(theme.backgroundColor)

  return (
    <SpringAnimatedView
      style={[
        horizontal
          ? {
              width: '100%',
              height: size,
            }
          : {
              width: size,
              height: '100%',
            },
        {
          backgroundColor: springAnimatedTheme[themeField],
        },
        !!zIndex && { zIndex },
      ]}
    />
  )
}
