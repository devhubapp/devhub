import React, { useRef, useState } from 'react'
import { TextInputProps as TextInputComponentProps } from 'react-native'

import { useCSSVariablesOrSpringAnimatedTheme } from '../../hooks/use-css-variables-or-spring--animated-theme'
import { useHover } from '../../hooks/use-hover'
import * as colors from '../../styles/colors'
import { contentPadding, radius } from '../../styles/variables'
import { SpringAnimatedTextInput as SpringAnimatedTextInputOriginal } from '../animated/spring/SpringAnimatedTextInput'

export interface SpringAnimatedTextInputProps extends TextInputComponentProps {
  className?: string
  placeholderTextColor?: any
  style?: any
}

export const SpringAnimatedTextInput = React.forwardRef(
  (props: SpringAnimatedTextInputProps, _ref: any) => {
    const { style, ...otherProps } = props

    const [isFocused, setIsFocused] = useState(false)

    const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

    const _defaultRef = useRef(null)
    const ref = _ref || _defaultRef
    const isHovered = useHover(ref)

    return (
      <SpringAnimatedTextInputOriginal
        ref={ref}
        placeholderTextColor={springAnimatedTheme.foregroundColorMuted50}
        {...otherProps}
        className={`input ${otherProps.className || ''}`.trim()}
        onBlur={(e: any) => {
          setIsFocused(false)
          if (otherProps.onBlur) otherProps.onBlur(e)
        }}
        onFocus={(e: any) => {
          setIsFocused(true)
          if (otherProps.onFocus) otherProps.onFocus(e)
        }}
        style={[
          {
            height: 36,
            margin: 0,
            padding: 0,
            paddingHorizontal: contentPadding,
            backgroundColor: 'transparent',
            borderRadius: radius,
            borderWidth: 1,
            borderColor: isFocused
              ? colors.brandBackgroundColor
              : isHovered
              ? springAnimatedTheme.backgroundColorLess16
              : springAnimatedTheme.backgroundColorLess08,
          },
          style,
        ]}
      />
    )
  },
)

export type SpringAnimatedTextInput = typeof SpringAnimatedTextInputOriginal
