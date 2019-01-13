import React from 'react'
import { View, ViewStyle } from 'react-native'

import { createAnimatedComponent } from '../animated/helpers'
import { GradientLayerOverlayProps, To } from './GradientLayerOverlay.shared'

function getStyle(color: string, to: To, size: number, spacing = 0): ViewStyle {
  const getDefaultStyles = () => ({
    backgroundColor: color,
    WebkitMaskImage: `linear-gradient(to ${to}, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))`,
  })

  switch (to) {
    case 'top':
      return {
        ...getDefaultStyles(),
        height: size,
        left: spacing,
        position: 'absolute',
        right: spacing,
        top: 0,
      }
    case 'bottom':
      return {
        ...getDefaultStyles(),
        bottom: 0,
        height: size,
        left: spacing,
        position: 'absolute',
        right: spacing,
      }
    case 'left':
      return {
        ...getDefaultStyles(),
        bottom: spacing,
        left: 0,
        position: 'absolute',
        top: spacing,
        width: size,
      }
    case 'right':
      return {
        ...getDefaultStyles(),
        bottom: spacing,
        position: 'absolute',
        right: 0,
        top: spacing,
        width: size,
      }
    default:
      return {}
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
      <View
        style={[
          getStyle(color, to, size, spacing),
          Boolean(radius) && { borderRadius: radius },
          style,
        ]}
        {...otherProps}
      />
    )
  }
}

export const AnimatedGradientLayerOverlay = createAnimatedComponent(
  GradientLayerOverlay,
)
