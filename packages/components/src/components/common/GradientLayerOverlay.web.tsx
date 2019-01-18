import React from 'react'
import { ViewStyle } from 'react-native'

import { createSpringAnimatedComponent } from '../animated/spring/helpers'
import { SpringAnimatedView } from '../animated/spring/SpringAnimatedView'
import { GradientLayerOverlayProps, To } from './GradientLayerOverlay.shared'

function getStyle(color: string, to: To, size: number, spacing = 0): ViewStyle {
  const getDefaultStyles = () => ({
    backgroundColor: color,
    WebkitMaskImage: `linear-gradient(to ${to}, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0))`,
  })

  switch (to) {
    case 'top':
      return {
        ...getDefaultStyles(),
        bottom: 0,
        height: size,
        left: spacing,
        position: 'absolute',
        right: spacing,
      }
    case 'bottom':
      return {
        ...getDefaultStyles(),
        height: size,
        left: spacing,
        position: 'absolute',
        right: spacing,
        top: 0,
      }
    case 'left':
      return {
        ...getDefaultStyles(),
        bottom: spacing,
        right: 0,
        position: 'absolute',
        top: spacing,
        width: size,
      }
    case 'right':
      return {
        ...getDefaultStyles(),
        bottom: spacing,
        position: 'absolute',
        left: 0,
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
      <SpringAnimatedView
        pointerEvents="box-none"
        style={[
          getStyle(color, to, size, spacing),
          Boolean(radius) && { borderRadius: radius },
          { zIndex: 1 },
          style,
        ]}
        {...otherProps}
      />
    )
  }
}

export const SpringAnimatedGradientLayerOverlay = createSpringAnimatedComponent(
  GradientLayerOverlay,
)
