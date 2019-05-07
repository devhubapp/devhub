import React from 'react'
import { View } from 'react-native'

import { Omit, ThemeColors } from '@devhub/core'
import { sharedStyles } from '../../styles/shared'
import { useTheme } from '../context/ThemeContext'
import { GradientLayerOverlay } from './GradientLayerOverlay'
import {
  GradientLayerOverlayProps,
  To,
  ToWithVH,
} from './GradientLayerOverlay.shared'

export { To as From, ToWithVH as FromWithVH }

export interface AnimatedTransparentTextOverlayProps
  extends Omit<GradientLayerOverlayProps, 'to' | 'color'> {
  to: ToWithVH
  themeColor: keyof ThemeColors
}

export const AnimatedTransparentTextOverlay = React.memo(
  React.forwardRef<View, AnimatedTransparentTextOverlayProps>((props, ref) => {
    return null

    const { children, containerStyle, themeColor, to, ...otherProps } = props

    const theme = useTheme()

    return (
      <View
        ref={ref}
        collapsable={false}
        pointerEvents="box-none"
        style={[
          sharedStyles.flex,
          { alignSelf: 'stretch', flexBasis: 'auto' },
          containerStyle,
        ]}
      >
        {(to === 'vertical' || to === 'bottom') && (
          <GradientLayerOverlay
            {...otherProps}
            color={theme[themeColor]}
            to="bottom"
          />
        )}

        {(to === 'vertical' || to === 'top') && (
          <GradientLayerOverlay
            {...otherProps}
            color={theme[themeColor]}
            to="top"
          />
        )}

        {(to === 'horizontal' || to === 'right') && (
          <GradientLayerOverlay
            {...otherProps}
            color={theme[themeColor]}
            to="right"
          />
        )}

        {(to === 'horizontal' || to === 'left') && (
          <GradientLayerOverlay
            {...otherProps}
            color={theme[themeColor]}
            to="left"
          />
        )}

        {children}
      </View>
    )
  }),
)
