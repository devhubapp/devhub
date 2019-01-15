import React, { useRef } from 'react'

import { useAnimatedTheme } from '../../hooks/use-animated-theme'
import { useHover } from '../../hooks/use-hover'
import * as colors from '../../styles/colors'
import { contentPadding, radius } from '../../styles/variables'
import { AnimatedActivityIndicator } from '../animated/AnimatedActivityIndicator'
import { AnimatedText } from '../animated/AnimatedText'
import { AnimatedView } from '../animated/AnimatedView'
import { useTheme } from '../context/ThemeContext'
import { TouchableOpacity, TouchableOpacityProps } from './TouchableOpacity'

export const buttonSize = 40

export interface ButtonProps extends TouchableOpacityProps {
  children: string | React.ReactNode
  disabled?: boolean
  loading?: boolean
  onPress: TouchableOpacityProps['onPress']
  useBrandColor?: boolean
}

export function Button(props: ButtonProps) {
  const {
    children,
    disabled,
    loading,
    style,
    useBrandColor,
    ...otherProps
  } = props

  const theme = useAnimatedTheme()

  const touchableRef = useRef(null)
  const isHovered = useHover(touchableRef)

  return (
    <TouchableOpacity
      ref={touchableRef}
      animated
      {...otherProps}
      style={[
        {
          height: buttonSize,
          backgroundColor: useBrandColor
            ? colors.brandBackgroundColor
            : (theme.backgroundColorLess08 as any),
          borderRadius: radius,
        },
        style,
      ]}
    >
      <AnimatedView
        style={[
          {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            height: buttonSize,
            paddingHorizontal: contentPadding,
            borderRadius: radius,
          },
          isHovered && {
            backgroundColor: useBrandColor
              ? theme.backgroundColorTransparent10
              : theme.backgroundColorLess16,
          },
        ]}
      >
        {loading ? (
          <AnimatedActivityIndicator
            color={theme.foregroundColor as any}
            size="small"
          />
        ) : typeof children === 'string' ? (
          <AnimatedText
            style={{
              lineHeight: 14,
              fontSize: 14,
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
      </AnimatedView>
    </TouchableOpacity>
  )
}
