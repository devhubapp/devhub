import React from 'react'
import { View, ViewStyle } from 'react-native'

import { GradientLayerOverlayProps, To } from './GradientLayerOverlay.shared'

function getStyle({
  color,
  to,
  size,
  spacing = 0,
  radius = 0,
}: {
  color: string
  to: To
  size: number
  spacing?: number | string
  radius?: number
}): ViewStyle {
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
        borderTopLeftRadius: radius,
        borderTopRightRadius: radius,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      }
    case 'bottom':
      return {
        ...getDefaultStyles(),
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
        ...getDefaultStyles(),
        bottom: spacing,
        right: 0,
        position: 'absolute',
        top: spacing,
        width: size,
        borderTopLeftRadius: radius,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: radius,
        borderBottomRightRadius: 0,
      }
    case 'right':
      return {
        ...getDefaultStyles(),
        bottom: spacing,
        position: 'absolute',
        left: 0,
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

export const GradientLayerOverlay = React.forwardRef(
  (props: GradientLayerOverlayProps, ref) => {
    React.useImperativeHandle(ref, () => ({}))

    const { color, radius, size, spacing, style, to, ...otherProps } = props

    if (!color) return null

    return (
      <View
        collapsable={false}
        pointerEvents="box-none"
        style={[
          getStyle({ color, to, size, spacing, radius }),
          { zIndex: 1 },
          style,
        ]}
        {...otherProps}
      />
    )
  },
)

GradientLayerOverlay.displayName = 'GradientLayerOverlay'
