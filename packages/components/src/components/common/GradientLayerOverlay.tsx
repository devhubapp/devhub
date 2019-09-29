import React from 'react'
import { ViewStyle } from 'react-native'

import { rgba } from 'polished'
import { LinearGradient } from '../../libs/linear-gradient'
import { GradientLayerOverlayProps, To } from './GradientLayerOverlay.shared'

function getStyle({
  to,
  size,
  spacing = 0,
  radius = 0,
}: {
  to: To
  size: number
  spacing?: number | string
  radius?: number
}): ViewStyle {
  switch (to) {
    case 'top':
      return {
        bottom: 0,
        height: size,
        left: spacing,
        position: 'absolute',
        right: spacing,
        borderTopLeftRadius: radius,
        borderTopRightRadius: radius,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      }
    case 'bottom':
      return {
        height: size,
        left: spacing,
        position: 'absolute',
        right: spacing,
        top: 0,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: radius,
        borderBottomRightRadius: radius,
      }
    case 'left':
      return {
        bottom: spacing,
        position: 'absolute',
        right: 0,
        top: spacing,
        width: size,
        borderTopLeftRadius: radius,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: radius,
        borderBottomRightRadius: 0,
      }
    case 'right':
      return {
        bottom: spacing,
        left: 0,
        position: 'absolute',
        top: spacing,
        width: size,
        borderTopLeftRadius: 0,
        borderTopRightRadius: radius,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: radius,
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

export const GradientLayerOverlay = React.forwardRef(
  (props: GradientLayerOverlayProps, ref) => {
    React.useImperativeHandle(ref, () => ({}))

    const { color, radius, size, spacing, style, to, ...otherProps } = props

    if (!color) return null

    let colors
    try {
      colors = [rgba(color, 0), rgba(color, 0.5)]
    } catch (e) {
      return null
    }

    return (
      <LinearGradient
        collapsable={false}
        colors={colors}
        pointerEvents="box-none"
        style={[getStyle({ to, size, spacing, radius }), { zIndex: 1 }, style]}
        {...getProps(to)}
        {...otherProps}
      />
    )
  },
)

GradientLayerOverlay.displayName = 'GradientLayerOverlay'
