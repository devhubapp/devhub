import React from 'react'
import { StyleProp, StyleSheet, TextStyle } from 'react-native'
import { IconProps } from 'react-native-vector-icons/Icon'

import { GitHubIcon, Omit } from '@devhub/core'
import { Octicons as Icon } from '../../libs/vector-icons'
import { createAnimatedComponent } from './helpers'

const AnimatedIconComponent = createAnimatedComponent(Icon)

export interface AnimatedIconProps extends Omit<IconProps, 'color' | 'style'> {
  color?: string | any
  name: GitHubIcon
  style?: StyleProp<TextStyle | any>
}

export const AnimatedIcon = ({ color, style, ...props }: AnimatedIconProps) => (
  <AnimatedIconComponent
    selectable={false}
    {...props}
    style={StyleSheet.flatten([{ color } as any, style])}
  />
)
