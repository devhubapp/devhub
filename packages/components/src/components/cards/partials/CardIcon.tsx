import React from 'react'
import { StyleSheet } from 'react-native'

import { Omit } from '@devhub/core'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../../hooks/use-css-variables-or-spring--animated-theme'
import { contentPadding } from '../../../styles/variables'
import {
  SpringAnimatedIcon,
  SpringAnimatedIconProps,
} from '../../animated/spring/SpringAnimatedIcon'

export interface CardIconProps
  extends Omit<SpringAnimatedIconProps, 'accessibilityRole'> {
  style?: any
}

const styles = StyleSheet.create({
  container: {
    fontSize: 18,
    marginLeft: contentPadding,
  },
})

export function SpringAnimatedCardIcon(props: CardIconProps) {
  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

  return (
    <SpringAnimatedIcon
      {...props}
      color={props.color || springAnimatedTheme.foregroundColor}
      style={[styles.container, props.style]}
    />
  )
}
