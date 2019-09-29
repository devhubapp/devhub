import { ReactNode } from 'react'
import { StyleProp, ViewStyle } from 'react-native'

export type To = 'top' | 'bottom' | 'left' | 'right'
export type ToWithVH = 'vertical' | 'horizontal' | To

export interface GradientLayerOverlayProps {
  animated?: boolean
  children?: ReactNode
  color: string
  containerStyle?: StyleProp<ViewStyle | any>
  radius?: number
  size: number
  spacing?: number | string
  style?: StyleProp<ViewStyle>
  to: To
}
