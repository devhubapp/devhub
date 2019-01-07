import { ReactNode } from 'react'
import { Animated, StyleProp, ViewStyle } from 'react-native'

import { Omit } from '@devhub/core'

export type To = 'top' | 'bottom' | 'left' | 'right'
export type ToWithVH = 'vertical' | 'horizontal' | To

export interface GradientLayerOverlayProps {
  animated?: boolean
  children?: ReactNode
  color: string
  containerStyle?: StyleProp<ViewStyle | any>
  radius?: number
  size: number
  style?: StyleProp<ViewStyle>
  to: To
}

export interface AnimatedGradientLayerOverlayProps
  extends Omit<GradientLayerOverlayProps, 'color'> {
  color: string | Animated.AnimatedInterpolation
}
