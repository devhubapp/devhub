import React from 'react'

import { getLuminance } from 'polished'
import { useAnimatedTheme } from '../../hooks/use-animated-theme'
import { AnimatedView } from '../animated/AnimatedView'
import { useTheme } from '../context/ThemeContext'

export const separatorSize = 1
export const separatorTickSize = 2

export function getSeparatorColor(
  backgroundColor: string,
  themeOrAnimatedTheme: {
    backgroundColorLess08: string | any
    backgroundColorLess16: string | any
    backgroundColorMore08: string | any
  },
) {
  const luminance = getLuminance(backgroundColor)

  if (luminance <= 0.02) return themeOrAnimatedTheme.backgroundColorLess16
  if (luminance >= 0.95) return themeOrAnimatedTheme.backgroundColorLess08
  return themeOrAnimatedTheme.backgroundColorMore08
}

export interface SeparatorProps {
  horizontal?: boolean
  thick?: boolean
  zIndex?: number
}

export function Separator(props: SeparatorProps) {
  const animatedTheme = useAnimatedTheme()
  const theme = useTheme()

  const { horizontal, thick, zIndex } = props
  const size = thick ? separatorTickSize : separatorSize

  return (
    <AnimatedView
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
          backgroundColor: getSeparatorColor(
            theme.backgroundColor,
            animatedTheme,
          ),
        },
        !!zIndex && { zIndex },
      ]}
    />
  )
}
