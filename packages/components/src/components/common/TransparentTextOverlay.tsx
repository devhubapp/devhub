import React, { ReactNode } from 'react'
import { Animated, StyleProp, ViewStyle } from 'react-native'

import { ThemeColors } from '@devhub/core'
import { useAnimatedTheme } from '../../hooks/use-animated-theme.shared'
import { Platform } from '../../libs/platform'
import { useAppLayout } from '../context/LayoutContext'
import { AnimatedGradientLayerOverlay } from './GradientLayerOverlay'

export type From = 'top' | 'bottom' | 'left' | 'right'
export type FromWithVH = 'vertical' | 'horizontal' | From

export interface AnimatedTransparentTextOverlayProps {
  animated?: boolean
  children?: ReactNode
  containerStyle?: StyleProp<ViewStyle | any>
  from: FromWithVH
  radius?: number
  size: number
  style?: StyleProp<ViewStyle>
  themeColor: keyof ThemeColors
}

export const AnimatedTransparentTextOverlay = React.memo(
  (props: AnimatedTransparentTextOverlayProps) => {
    const { sizename } = useAppLayout()
    const theme = useAnimatedTheme()

    const { children, containerStyle, from, themeColor, ...otherProps } = props

    if (Platform.OS === 'web' && !(sizename < '3-large')) return children as any

    const color = theme[themeColor]

    return (
      <Animated.View
        style={[
          { flex: 1, alignSelf: 'stretch', flexBasis: 'auto' },
          containerStyle,
        ]}
      >
        {children}

        {(from === 'vertical' || from === 'top') && (
          <AnimatedGradientLayerOverlay
            {...otherProps}
            color={color}
            from="top"
          />
        )}

        {(from === 'vertical' || from === 'bottom') && (
          <AnimatedGradientLayerOverlay
            {...otherProps}
            color={color}
            from="bottom"
          />
        )}

        {(from === 'horizontal' || from === 'left') && (
          <AnimatedGradientLayerOverlay
            {...otherProps}
            color={color}
            from="left"
          />
        )}

        {(from === 'horizontal' || from === 'right') && (
          <AnimatedGradientLayerOverlay
            {...otherProps}
            color={color}
            from="right"
          />
        )}
      </Animated.View>
    )
  },
)
