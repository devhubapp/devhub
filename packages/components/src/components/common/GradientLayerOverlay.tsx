import React, { ComponentClass } from 'react'
import { Animated, ViewStyle } from 'react-native'

import { rgba } from 'polished'
import { AnimatedLinearGradient } from '../../libs/linear-gradient'
import {
  AnimatedGradientLayerOverlayProps,
  GradientLayerOverlayProps,
  To,
} from './GradientLayerOverlay.shared'

function getStyle(to: To, size: number): ViewStyle {
  switch (to) {
    case 'top':
      return {
        bottom: 0,
        height: size,
        left: 0,
        position: 'absolute',
        right: 0,
      }
    case 'bottom':
      return {
        height: size,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
      }
    case 'left':
      return {
        bottom: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        width: size,
      }
    case 'right':
      return {
        bottom: 0,
        left: 0,
        position: 'absolute',
        top: 0,
        width: size,
      }
    default:
      return {}
  }
}

function getProps(to: To) {
  switch (to) {
    case 'top':
      return {
        end: { x: 0, y: 1 },
        start: { x: 0, y: 0 },
      }
    case 'bottom':
      return {
        end: { x: 0, y: 0 },
        start: { x: 0, y: 1 },
      }
    case 'left':
      return {
        end: { x: 1, y: 0 },
        start: { x: 0, y: 0 },
      }
    default:
      return {
        end: { x: 0, y: 0 },
        start: { x: 1, y: 0 },
      }
  }
}

class GradientLayerOverlay extends React.Component<GradientLayerOverlayProps> {
  render() {
    const { color, radius, size, style, to, ...otherProps } = this.props

    if (!color) return null

    return (
      <AnimatedLinearGradient
        colors={[rgba(color, 0), color]}
        style={[
          getStyle(to, size),
          Boolean(radius) && { borderRadius: radius },
          style,
        ]}
        {...getProps(to)}
        {...otherProps}
      />
    )
  }
}

export const AnimatedGradientLayerOverlay = Animated.createAnimatedComponent(
  GradientLayerOverlay,
)
