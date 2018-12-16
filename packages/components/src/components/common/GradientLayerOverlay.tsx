import React, { ComponentClass, ReactNode } from 'react'
import { Animated, StyleProp, ViewStyle } from 'react-native'

import { Omit, ThemeColors } from '@devhub/core'
import { rgba } from 'polished'
import { AnimatedLinearGradient } from '../../libs/linear-gradient'

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

function getStyle(from: From, size: number): ViewStyle {
  switch (from) {
    case 'top':
      return {
        height: size,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
      }
    case 'bottom':
      return {
        bottom: 0,
        height: size,
        left: 0,
        position: 'absolute',
        right: 0,
      }
    case 'left':
      return {
        bottom: 0,
        left: 0,
        position: 'absolute',
        top: 0,
        width: size,
      }
    case 'right':
      return {
        bottom: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        width: size,
      }
    default:
      return {}
  }
}

function getProps(from: From) {
  switch (from) {
    case 'top':
      return {
        end: { x: 0, y: 0 },
        start: { x: 0, y: 1 },
      }
    case 'bottom':
      return {
        end: { x: 0, y: 1 },
        start: { x: 0, y: 0 },
      }
    case 'left':
      return {
        end: { x: 0, y: 0 },
        start: { x: 1, y: 0 },
      }
    default:
      return {
        end: { x: 1, y: 0 },
        start: { x: 0, y: 0 },
      }
  }
}

interface GradientLayerOverlayProps
  extends Omit<AnimatedTransparentTextOverlayProps, 'themeColor'> {
  color: string
  from: From
}

class GradientLayerOverlay extends React.Component<GradientLayerOverlayProps> {
  render() {
    const { color, from, radius, size, style, ...otherProps } = this.props

    if (!color) return null

    return (
      <AnimatedLinearGradient
        colors={[rgba(color, 0), color]}
        style={[
          getStyle(from, size),
          Boolean(radius) && { borderRadius: radius },
          style,
        ]}
        {...getProps(from)}
        {...otherProps}
      />
    )
  }
}

export interface AnimatedGradientLayerOverlayProps
  extends Omit<GradientLayerOverlayProps, 'color'> {
  color: string | Animated.AnimatedInterpolation
}

export const AnimatedGradientLayerOverlay = Animated.createAnimatedComponent(
  GradientLayerOverlay,
) as ComponentClass<AnimatedGradientLayerOverlayProps>
