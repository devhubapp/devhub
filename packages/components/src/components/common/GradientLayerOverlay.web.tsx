import React, { ComponentClass } from 'react'
import { Animated, View, ViewStyle } from 'react-native'

import {
  AnimatedGradientLayerOverlayProps,
  GradientLayerOverlayProps,
  To,
} from './GradientLayerOverlay.shared'

function getStyle(color: string, to: To, size: number): ViewStyle {
  const getDefaultStyles = () => ({
    backgroundColor: color,
    WebkitMaskImage: `linear-gradient(to ${to}, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))`,
  })

  switch (to) {
    case 'top':
      return {
        ...getDefaultStyles(),
        height: size,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
      }
    case 'bottom':
      return {
        ...getDefaultStyles(),
        bottom: 0,
        height: size,
        left: 0,
        position: 'absolute',
        right: 0,
      }
    case 'left':
      return {
        ...getDefaultStyles(),
        bottom: 0,
        left: 0,
        position: 'absolute',
        top: 0,
        width: size,
      }
    case 'right':
      return {
        ...getDefaultStyles(),
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

class GradientLayerOverlay extends React.Component<GradientLayerOverlayProps> {
  render() {
    const { color, to, radius, size, style, ...otherProps } = this.props

    if (!color) return null

    return (
      <View
        style={[
          getStyle(color, to, size),
          Boolean(radius) && { borderRadius: radius },
          style,
        ]}
        {...otherProps}
      />
    )
  }
}

export const AnimatedGradientLayerOverlay = Animated.createAnimatedComponent(
  GradientLayerOverlay,
)
