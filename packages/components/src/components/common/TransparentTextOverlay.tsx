import React from 'react'

import { Omit, ThemeColors } from '@devhub/core'
import { useAnimatedTheme } from '../../hooks/use-animated-theme'
import { AnimatedView } from '../animated/AnimatedView'
import { AnimatedGradientLayerOverlay } from './GradientLayerOverlay'
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
    const theme = useAnimatedTheme()

    const { children, containerStyle, themeColor, to, ...otherProps } = props

    const color = theme[themeColor]

    return (
      <AnimatedView
        ref={ref}
        pointerEvents="box-none"
        style={[
          { flex: 1, alignSelf: 'stretch', flexBasis: 'auto' },
          containerStyle,
        ]}
      >
        {(to === 'vertical' || to === 'bottom') && (
          <AnimatedGradientLayerOverlay
            {...otherProps}
            color={color}
            to="bottom"
          />
        )}

        {(to === 'vertical' || to === 'top') && (
          <AnimatedGradientLayerOverlay
            {...otherProps}
            color={color}
            to="top"
          />
        )}

        {(to === 'horizontal' || to === 'right') && (
          <AnimatedGradientLayerOverlay
            {...otherProps}
            color={color}
            to="right"
          />
        )}

        {(to === 'horizontal' || to === 'left') && (
          <AnimatedGradientLayerOverlay
            {...otherProps}
            color={color}
            to="left"
          />
        )}

        {children}
      </AnimatedView>
    )
  }),
)
