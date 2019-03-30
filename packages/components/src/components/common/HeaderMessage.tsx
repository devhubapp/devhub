import React from 'react'
import { StyleSheet, TextProps, View } from 'react-native'

import { useCSSVariablesOrSpringAnimatedTheme } from '../../hooks/use-css-variables-or-spring--animated-theme'
import { contentPadding } from '../../styles/variables'
import { SpringAnimatedText } from '../animated/spring/SpringAnimatedText'
import {
  SpringAnimatedTouchableOpacity,
  SpringAnimatedTouchableOpacityProps,
} from '../animated/spring/SpringAnimatedTouchableOpacity'

export const HeaderMessageColor = 'rgba(0, 0, 0, 0.15)'

export interface HeaderMessageProps
  extends SpringAnimatedTouchableOpacityProps {
  children: string | React.ReactNode
  textStyle?: TextProps['style']
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    padding: contentPadding / 2,
  },
  text: {
    flexGrow: 1,
    lineHeight: 14,
    fontSize: 11,
    textAlign: 'center',
  },
})

export function HeaderMessage(props: HeaderMessageProps) {
  const { children, style, textStyle, ...restProps } = props

  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

  return (
    <View style={{ width: '100%' }}>
      <SpringAnimatedTouchableOpacity
        {...restProps}
        style={[
          styles.container,
          {
            backgroundColor: springAnimatedTheme.backgroundColor,
          },
          style,
        ]}
      >
        {typeof children === 'string' ? (
          <SpringAnimatedText
            style={[
              styles.text,
              { color: springAnimatedTheme.foregroundColorMuted50 },
              textStyle,
            ]}
          >
            {children}
          </SpringAnimatedText>
        ) : (
          children
        )}
      </SpringAnimatedTouchableOpacity>
    </View>
  )
}
