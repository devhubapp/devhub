import React, { useRef } from 'react'

import { useAnimatedTheme } from '../../hooks/use-animated-theme'
import { useHover } from '../../hooks/use-hover'
import * as colors from '../../styles/colors'
import { contentPadding, radius } from '../../styles/variables'
import { AnimatedActivityIndicator } from '../animated/AnimatedActivityIndicator'
import { AnimatedText } from '../animated/AnimatedText'
import { AnimatedView } from '../animated/AnimatedView'
import { TouchableOpacity, TouchableOpacityProps } from './TouchableOpacity'

export const buttonSize = 40

export interface ButtonProps extends TouchableOpacityProps {
  borderOnly?: boolean
  children: string | React.ReactNode
  disabled?: boolean
  loading?: boolean
  onPress: TouchableOpacityProps['onPress']
  useBrandColor?: boolean
}

export function Button(props: ButtonProps) {
  const {
    borderOnly,
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
          backgroundColor: borderOnly
            ? 'transparent'
            : useBrandColor
            ? colors.brandBackgroundColor
            : theme.backgroundColorLess08,
          borderColor: useBrandColor
            ? colors.brandBackgroundColor
            : isHovered
            ? theme.backgroundColorLess16
            : theme.backgroundColorLess08,
          borderWidth: borderOnly ? 1 : 0,
          borderRadius: radius,
        },
        style,
      ]}
    >
      <AnimatedView
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          height: buttonSize,
          paddingHorizontal: contentPadding,
          backgroundColor:
            !isHovered || borderOnly
              ? 'transparent'
              : useBrandColor
              ? theme.backgroundColorTransparent10
              : theme.backgroundColorLess16,
          borderWidth: 0,
          borderRadius: radius,
        }}
      >
        {loading ? (
          <AnimatedActivityIndicator
            color={theme.foregroundColor}
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
                : borderOnly
                ? isHovered
                  ? theme.foregroundColor
                  : theme.foregroundColorMuted50
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
