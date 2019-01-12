import React, { useState } from 'react'
import {
  Animated,
  TextInput as TextInputOriginal,
  TextInputProps as TextInputComponentProps,
} from 'react-native'

import { useAnimatedTheme } from '../../hooks/use-animated-theme'
import * as colors from '../../styles/colors'
import { contentPadding, radius } from '../../styles/variables'

const AnimatedTextInput = Animated.createAnimatedComponent(TextInputOriginal)

export interface TextInputProps extends TextInputComponentProps {
  className?: string
  placeholderTextColor: any
  style: any
}

export const TextInput = React.forwardRef((props: TextInputProps, ref: any) => {
  const { style, ...otherProps } = props

  const [isFocused, setIsFocused] = useState(false)
  const theme = useAnimatedTheme()

  return (
    <AnimatedTextInput
      {...otherProps}
      ref={ref}
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
          backgroundColor: theme.backgroundColorLess08,
          borderRadius: radius,
          borderWidth: 1,
          borderColor: isFocused ? colors.brandBackgroundColor : 'transparent',
        },
        style,
      ]}
    />
  )
})

export type TextInput = typeof AnimatedTextInput
