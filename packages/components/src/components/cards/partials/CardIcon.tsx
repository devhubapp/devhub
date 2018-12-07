import React from 'react'
import { StyleSheet } from 'react-native'

import { Omit } from '@devhub/core/src/types'
import { useAnimatedTheme } from '../../../hooks/use-animated-theme'
import { contentPadding } from '../../../styles/variables'
import { AnimatedIcon, AnimatedIconProps } from '../../animated/AnimatedIcon'

export interface CardIconProps
  extends Omit<AnimatedIconProps, 'accessibilityRole'> {
  style?: any
}

const styles = StyleSheet.create({
  container: {
    fontSize: 18,
    marginLeft: contentPadding,
  },
})

export function CardIcon(props: CardIconProps) {
  const theme = useAnimatedTheme()
  return (
    <AnimatedIcon
      {...props}
      color={props.color || theme.foregroundColor}
      style={[styles.container, props.style]}
    />
  )
}
