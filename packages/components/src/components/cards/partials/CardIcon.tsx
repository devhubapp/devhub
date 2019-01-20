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
  extends Omit<SpringAnimatedIconProps, 'accessibilityRole'> {}

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
      style={[
        styles.container,
        {
          color: springAnimatedTheme.foregroundColor,
        },
        props.style,
      ]}
    />
  )
}
