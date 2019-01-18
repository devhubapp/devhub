import React from 'react'
import { ViewStyle } from 'react-native'

import { rgba } from 'polished'
import { SpringAnimatedLinearGradient } from '../../libs/linear-gradient'
import { createSpringAnimatedComponent } from '../animated/spring/helpers'
import { GradientLayerOverlayProps, To } from './GradientLayerOverlay.shared'

function getStyle(to: To, size: number, spacing = 0): ViewStyle {
  switch (to) {
    case 'top':
      return {
        bottom: 0,
        height: size,
        left: spacing,
        position: 'absolute',
        right: spacing,
      }
    case 'bottom':
      return {
        height: size,
        left: spacing,
        position: 'absolute',
        right: spacing,
        top: 0,
      }
    case 'left':
      return {
        bottom: spacing,
        position: 'absolute',
        right: 0,
        top: spacing,
        width: size,
      }
    case 'right':
      return {
        bottom: spacing,
        left: 0,
        position: 'absolute',
        top: spacing,
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
    const {
      color,
      radius,
      size,
      spacing,
      style,
      to,
      ...otherProps
    } = this.props

    if (!color) return null

    return (
      <SpringAnimatedLinearGradient
        colors={[rgba(color, 0), color]}
        pointerEvents="box-none"
        style={[
          getStyle(to, size, spacing),
          Boolean(radius) && { borderRadius: radius },
          { zIndex: 1 },
          style,
        ]}
        {...getProps(to)}
        {...otherProps}
      />
    )
  }
}

export const SpringAnimatedGradientLayerOverlay = createSpringAnimatedComponent(
  GradientLayerOverlay,
)
