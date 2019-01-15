import React, { useRef, useState } from 'react'
import { TextInputProps as TextInputComponentProps } from 'react-native'

import { useAnimatedTheme } from '../../hooks/use-animated-theme'
import { useHover } from '../../hooks/use-hover'
import * as colors from '../../styles/colors'
import { contentPadding, radius } from '../../styles/variables'
import { AnimatedTextInput } from '../animated/AnimatedTextInput'

export interface TextInputProps extends TextInputComponentProps {
  className?: string
  placeholderTextColor?: any
  style?: any
}

export const TextInput = React.forwardRef(
  (props: TextInputProps, _ref: any) => {
    const { style, ...otherProps } = props

    const [isFocused, setIsFocused] = useState(false)
    const theme = useAnimatedTheme()

    const _defaultRef = useRef(null)
    const ref = _ref || _defaultRef
    const isHovered = useHover(ref)

    return (
      <AnimatedTextInput
        ref={ref}
        placeholderTextColor={theme.foregroundColorMuted50}
        {...otherProps}
        className={`input ${otherProps.className || ''}`.trim()}
        onBlur={e => {
          setIsFocused(false)
          if (otherProps.onBlur) otherProps.onBlur(e)
        }}
        onFocus={e => {
          setIsFocused(true)
          if (otherProps.onFocus) otherProps.onFocus(e)
        }}
        style={[
          {
            paddingHorizontal: contentPadding,
            paddingVertical: contentPadding / 2,
            backgroundColor: 'transparent',
            borderRadius: radius,
            borderWidth: 1,
            borderColor: isFocused
              ? colors.brandBackgroundColor
              : isHovered
              ? theme.backgroundColorLess16
              : theme.backgroundColorLess08,
          },
          style,
        ]}
      />
    )
  },
)

export type TextInput = typeof AnimatedTextInput
