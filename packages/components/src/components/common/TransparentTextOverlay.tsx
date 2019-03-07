import React from 'react'

import { Omit, ThemeColors } from '@devhub/core'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../hooks/use-css-variables-or-spring--animated-theme'
import { SpringAnimatedView } from '../animated/spring/SpringAnimatedView'
import { SpringAnimatedGradientLayerOverlay } from './GradientLayerOverlay'
import {
  AnimatedGradientLayerOverlayProps,
  To,
  ToWithVH,
} from './GradientLayerOverlay.shared'

export { To as From, ToWithVH as FromWithVH }

export interface AnimatedTransparentTextOverlayProps
  extends Omit<AnimatedGradientLayerOverlayProps, 'to' | 'color'> {
  to: ToWithVH
  themeColor: keyof ThemeColors
}

export const AnimatedTransparentTextOverlay = React.memo(
  React.forwardRef((props: AnimatedTransparentTextOverlayProps, ref: any) => {
    return null

    const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

    const { children, containerStyle, themeColor, to, ...otherProps } = props

    const springAnimatedColor = springAnimatedTheme[themeColor]

    return (
      <SpringAnimatedView
        ref={ref}
        collapsable={false}
        pointerEvents="box-none"
        style={[
          { flex: 1, alignSelf: 'stretch', flexBasis: 'auto' },
          containerStyle,
        ]}
      >
        {(to === 'vertical' || to === 'bottom') && (
          <SpringAnimatedGradientLayerOverlay
            {...otherProps}
            color={springAnimatedColor}
            to="bottom"
          />
        )}

        {(to === 'vertical' || to === 'top') && (
          <SpringAnimatedGradientLayerOverlay
            {...otherProps}
            color={springAnimatedColor}
            to="top"
          />
        )}

        {(to === 'horizontal' || to === 'right') && (
          <SpringAnimatedGradientLayerOverlay
            {...otherProps}
            color={springAnimatedColor}
            to="right"
          />
        )}

        {(to === 'horizontal' || to === 'left') && (
          <SpringAnimatedGradientLayerOverlay
            {...otherProps}
            color={springAnimatedColor}
            to="left"
          />
        )}

        {children}
      </SpringAnimatedView>
    )
  }),
)
