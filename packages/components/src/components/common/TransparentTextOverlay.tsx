import React from 'react'
import { View } from 'react-native'

import { Theme, ThemeColors } from '@devhub/core'
import { sharedStyles } from '../../styles/shared'
import { useTheme } from '../context/ThemeContext'
import { getThemeColorOrItself } from '../themed/helpers'
import { GradientLayerOverlay } from './GradientLayerOverlay'
import {
  GradientLayerOverlayProps,
  ToWithVH,
} from './GradientLayerOverlay.shared'

export interface TransparentTextOverlayProps
  extends Omit<GradientLayerOverlayProps, 'to' | 'color'> {
  to: ToWithVH
  themeColor: keyof ThemeColors | ((theme: Theme) => string | undefined)
}

export const TransparentTextOverlay = React.memo(
  React.forwardRef<View, TransparentTextOverlayProps>((props, ref) => {
    const {
      children,
      containerStyle,
      themeColor: _themeColor,
      to,
      ...otherProps
    } = props

    const theme = useTheme()

    const color = getThemeColorOrItself(theme, _themeColor, {
      enableCSSVariable: false,
    })

    if (!color) return null

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
          <GradientLayerOverlay {...otherProps} color={color} to="bottom" />
        )}

        {(to === 'vertical' || to === 'top') && (
          <GradientLayerOverlay {...otherProps} color={color} to="top" />
        )}

        {(to === 'horizontal' || to === 'right') && (
          <GradientLayerOverlay {...otherProps} color={color} to="right" />
        )}

        {(to === 'horizontal' || to === 'left') && (
          <GradientLayerOverlay {...otherProps} color={color} to="left" />
        )}

        {children}
      </View>
    )
  }),
)

TransparentTextOverlay.displayName = 'TransparentTextOverlay'
