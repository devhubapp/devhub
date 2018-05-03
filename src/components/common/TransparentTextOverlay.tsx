import React, { ReactNode, SFC } from 'react'
import { View, ViewStyle } from 'react-native'

import LinearGradient from '../../libs/linear-gradient'
import { fade } from '../../utils/helpers/color'

export type From = 'top' | 'bottom' | 'left' | 'right'
export type FromWithVH = 'vertical' | 'horizontal' | From

export interface IProps {
  children?: ReactNode
  color: string
  containerStyle?: ViewStyle
  from: FromWithVH
  radius?: number
  size: number
  style?: ViewStyle
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

function getProps(from: From, size: number) {
  switch (from) {
    case 'top':
      return {
        endPoint: { x: 0, y: 0 },
        height: size,
        startPoint: { x: 0, y: 1 },
      }
    case 'bottom':
      return {
        endPoint: { x: 0, y: 1 },
        height: size,
        startPoint: { x: 0, y: 0 },
      }
    case 'left':
      return {
        endPoint: { x: 0, y: 0 },
        startPoint: { x: 1, y: 0 },
        width: size,
      }
    default:
      return {
        endPoint: { x: 1, y: 0 },
        startPoint: { x: 0, y: 0 },
        width: size,
      }
  }
}

const GradientLayerOverlay: SFC<IProps & { from: From }> = ({
  color,
  from,
  radius,
  size,
  style,
  ...props
}) => (
  <LinearGradient
    colors={[fade(color, 0), color]}
    style={[
      getStyle(from, size),
      Boolean(radius) && { borderRadius: radius },
      style,
    ]}
    {...getProps(from, size)}
    {...props}
  />
)

const TransparentTextOverlay: SFC<IProps> = ({
  children,
  containerStyle,
  from,
  ...props
}) => {
  return (
    <View style={[{ flex: 1, alignSelf: 'stretch' }, containerStyle]}>
      {children}

      {(from === 'vertical' || from === 'top') && (
        <GradientLayerOverlay {...props} from="top" />
      )}

      {(from === 'vertical' || from === 'bottom') && (
        <GradientLayerOverlay {...props} from="bottom" />
      )}

      {(from === 'horizontal' || from === 'left') && (
        <GradientLayerOverlay {...props} from="left" />
      )}

      {(from === 'horizontal' || from === 'right') && (
        <GradientLayerOverlay {...props} from="right" />
      )}
    </View>
  )
}

export default TransparentTextOverlay
