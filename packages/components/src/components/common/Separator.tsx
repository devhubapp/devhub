import React from 'react'

import { useAnimatedTheme } from '../../hooks/use-animated-theme'
import { AnimatedView } from '../animated/AnimatedView'

export const separatorSize = 1
export const separatorTickSize = 2

export interface SeparatorProps {
  horizontal?: boolean
  thick?: boolean
  zIndex?: number
}

export function Separator(props: SeparatorProps) {
  const theme = useAnimatedTheme()

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
        { backgroundColor: theme.backgroundColorMore08 },
        !!zIndex && { zIndex },
      ]}
    />
  )
}
