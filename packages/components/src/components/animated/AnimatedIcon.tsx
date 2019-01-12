import React from 'react'
import { Animated, StyleProp, StyleSheet, TextStyle } from 'react-native'
import { IconProps } from 'react-native-vector-icons/Icon'

import { GitHubIcon, Omit } from '@devhub/core'
import { Octicons as Icon } from '../../libs/vector-icons'

const AnimatedIconComponent = Animated.createAnimatedComponent(Icon)

export interface AnimatedIconProps extends Omit<IconProps, 'color' | 'style'> {
  color?: string | Animated.AnimatedInterpolation
  name: GitHubIcon
  style?: StyleProp<TextStyle | any>
}

export const AnimatedIcon = ({ color, style, ...props }: AnimatedIconProps) => (
  <AnimatedIconComponent
    {...props}
    style={StyleSheet.flatten([{ color } as any, style])}
  />
)
