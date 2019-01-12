import React from 'react'
import { StyleProp, TextStyle } from 'react-native'

import { GitHubIcon } from '@devhub/core'
import { useAnimatedTheme } from '../../hooks/use-animated-theme'
import * as colors from '../../styles/colors'
import { contentPadding } from '../../styles/variables'
import { AnimatedIcon } from '../animated/AnimatedIcon'
import { AnimatedText } from '../animated/AnimatedText'
import { TouchableOpacity, TouchableOpacityProps } from './TouchableOpacity'

export const fabSize = 50

export interface FABProps extends TouchableOpacityProps {
  children?: string | React.ReactElement<any>
  iconName?: GitHubIcon
  iconStyle?: StyleProp<TextStyle> | any
  onPress: TouchableOpacityProps['onPress']
  useBrandColor?: boolean
}

export function FAB(props: FABProps) {
  const theme = useAnimatedTheme()

  const {
    children,
    iconName,
    iconStyle,
    style,
    useBrandColor,
    ...otherProps
  } = props

  return (
    <TouchableOpacity
      animated
      analyticsCategory="fab"
      {...otherProps}
      hitSlop={{
        top: contentPadding / 2,
        bottom: contentPadding / 2,
        left: contentPadding,
        right: contentPadding,
      }}
      style={[
        {
          alignItems: 'center',
          justifyContent: 'center',
          width: fabSize,
          height: fabSize,
          borderRadius: fabSize / 2,
          backgroundColor: useBrandColor
            ? colors.brandBackgroundColor
            : theme.backgroundColorMore08,
          shadowColor: '#000000',
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.2,
          shadowRadius: 6,
          zIndex: 1,
        },
        style,
      ]}
    >
      {typeof iconName === 'string' ? (
        <AnimatedIcon
          color={
            useBrandColor ? colors.brandForegroundColor : theme.foregroundColor
          }
          name={iconName}
          style={[
            {
              width: 24,
              height: 24,
              lineHeight: 24,
              marginTop: 1,
              fontSize: 24,
              textAlign: 'center',
            },
            iconStyle,
          ]}
        />
      ) : typeof children === 'string' ? (
        <AnimatedText
          style={{
            fontSize: 14,
            lineHeight: 14,
            fontWeight: '500',
            color: useBrandColor
              ? colors.brandForegroundColor
              : theme.foregroundColor,
          }}
        >
          {children}
        </AnimatedText>
      ) : (
        children
      )}
    </TouchableOpacity>
  )
}
