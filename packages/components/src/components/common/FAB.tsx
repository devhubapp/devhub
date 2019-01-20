import React, { useRef, useState } from 'react'
import { StyleProp, TextStyle } from 'react-native'

import { GitHubIcon } from '@devhub/core'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../hooks/use-css-variables-or-spring--animated-theme'
import { useHover } from '../../hooks/use-hover'
import * as colors from '../../styles/colors'
import { contentPadding } from '../../styles/variables'
import { SpringAnimatedIcon } from '../animated/spring/SpringAnimatedIcon'
import { SpringAnimatedText } from '../animated/spring/SpringAnimatedText'
import {
  SpringAnimatedTouchableOpacity,
  SpringAnimatedTouchableOpacityProps,
} from '../animated/spring/SpringAnimatedTouchableOpacity'
import { SpringAnimatedView } from '../animated/spring/SpringAnimatedView'

export const fabSize = 50

export interface FABProps extends SpringAnimatedTouchableOpacityProps {
  children?: string | React.ReactElement<any>
  iconName?: GitHubIcon
  iconStyle?: StyleProp<TextStyle> | any
  onPress: SpringAnimatedTouchableOpacityProps['onPress']
  useBrandColor?: boolean
}

export function FAB(props: FABProps) {
  const {
    children,
    iconName,
    iconStyle,
    style,
    useBrandColor,
    ...otherProps
  } = props

  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

  const [isPressing, setIsPressing] = useState(false)

  const touchableRef = useRef(null)
  const isHovered = useHover(touchableRef)

  return (
    <SpringAnimatedTouchableOpacity
      ref={touchableRef}
      analyticsCategory="fab"
      {...otherProps}
      activeOpacity={1}
      hitSlop={{
        top: contentPadding / 2,
        bottom: contentPadding / 2,
        left: contentPadding,
        right: contentPadding,
      }}
      onPressIn={() => setIsPressing(true)}
      onPressOut={() => setIsPressing(false)}
      style={[
        {
          width: fabSize,
          height: fabSize,
          borderRadius: fabSize / 2,
          backgroundColor: useBrandColor
            ? colors.brandBackgroundColor
            : springAnimatedTheme.backgroundColorLess08,
          shadowColor: '#000000',
          shadowOffset: {
            width: 0,
            height: isHovered || isPressing ? 6 : 3,
          },
          shadowOpacity: 0.2,
          shadowRadius: 6,
          zIndex: 1,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <SpringAnimatedView
        style={[
          {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            width: fabSize,
            height: fabSize,
            borderRadius: fabSize / 2,
            overflow: 'hidden',
          },
          !!(isHovered || isPressing) && {
            backgroundColor: useBrandColor
              ? springAnimatedTheme.backgroundColorTransparent10
              : springAnimatedTheme.backgroundColorLess16,
          },
        ]}
      >
        {typeof iconName === 'string' ? (
          <SpringAnimatedIcon
            name={iconName}
            style={[
              {
                width: 24,
                height: 24,
                lineHeight: 24,
                marginTop: 1,
                fontSize: 24,
                textAlign: 'center',
                color: useBrandColor
                  ? colors.brandForegroundColor
                  : springAnimatedTheme.foregroundColor,
              },
              iconStyle,
            ]}
          />
        ) : typeof children === 'string' ? (
          <SpringAnimatedText
            style={{
              fontSize: 14,
              lineHeight: 14,
              fontWeight: '500',
              color: useBrandColor
                ? colors.brandForegroundColor
                : springAnimatedTheme.foregroundColor,
            }}
          >
            {children}
          </SpringAnimatedText>
        ) : (
          children
        )}
      </SpringAnimatedView>
    </SpringAnimatedTouchableOpacity>
  )
}
