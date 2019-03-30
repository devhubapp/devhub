import React from 'react'

import { useCSSVariablesOrSpringAnimatedTheme } from '../../../hooks/use-css-variables-or-spring--animated-theme'
import { SpringAnimatedView } from '../../animated/spring/SpringAnimatedView'

export interface CardFocusBorderProps {}

export function CardFocusBorder() {
  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

  return (
    <SpringAnimatedView
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: 2,
        backgroundColor: springAnimatedTheme.primaryBackgroundColor,
      }}
    />
  )
}
