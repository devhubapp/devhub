import { rgba } from 'polished'
import React, { ReactNode } from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'

import { LinearGradient } from '../../libs/linear-gradient'
import { computeThemeColor } from '../../utils/helpers/colors'

export type From = 'top' | 'bottom' | 'left' | 'right'
export type FromWithVH = 'vertical' | 'horizontal' | From

export interface TransparentTextOverlayProps {
  children?: ReactNode
  color: string
  containerStyle?: StyleProp<ViewStyle>
  from: FromWithVH
  radius?: number
  size: number
  style?: StyleProp<ViewStyle>
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
        end: { x: 0, y: 0 },
        height: size,
        start: { x: 0, y: 1 },
      }
    case 'bottom':
      return {
        end: { x: 0, y: 1 },
        height: size,
        start: { x: 0, y: 0 },
      }
    case 'left':
      return {
        end: { x: 0, y: 0 },
        start: { x: 1, y: 0 },
        width: size,
      }
    default:
      return {
        end: { x: 1, y: 0 },
        start: { x: 0, y: 0 },
        width: size,
      }
  }
}

function GradientLayerOverlay(
  props: TransparentTextOverlayProps & { from: From },
) {
  const { color: _color, from, radius, size, style, ...otherProps } = props

  const color = computeThemeColor(_color)
  if (!color) return null

  return (
    <LinearGradient
      colors={[rgba(color, 0), color]}
      style={[
        getStyle(from, size),
        Boolean(radius) && { borderRadius: radius },
        style,
      ]}
      {...getProps(from, size)}
      {...otherProps}
    />
  )
}

export function TransparentTextOverlay(props: TransparentTextOverlayProps) {
  const { children, containerStyle, from, ...otherProps } = props

  return (
    <View
      style={[
        { flex: 1, alignSelf: 'stretch', flexBasis: 'auto' },
        containerStyle,
      ]}
    >
      {children}

      {(from === 'vertical' || from === 'top') && (
        <GradientLayerOverlay {...otherProps} from="top" />
      )}

      {(from === 'vertical' || from === 'bottom') && (
        <GradientLayerOverlay {...otherProps} from="bottom" />
      )}

      {(from === 'horizontal' || from === 'left') && (
        <GradientLayerOverlay {...otherProps} from="left" />
      )}

      {(from === 'horizontal' || from === 'right') && (
        <GradientLayerOverlay {...otherProps} from="right" />
      )}
    </View>
  )
}
