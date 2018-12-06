import React from 'react'
import { Animated, StyleSheet } from 'react-native'
import { IconProps } from 'react-native-vector-icons/Icon'

import { Omit } from '@devhub/core'
import { Octicons as Icon } from '../../libs/vector-icons'

const AnimatedIconComponent = Animated.createAnimatedComponent(Icon)

export interface AnimatedIconProps extends Omit<IconProps, 'color'> {
  color?: string | Animated.AnimatedInterpolation
}

export const AnimatedIcon = ({ color, style, ...props }: AnimatedIconProps) => (
  <AnimatedIconComponent
    {...props}
    style={StyleSheet.flatten([{ color } as any, style])}
  />
)
