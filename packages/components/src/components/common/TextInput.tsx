import React from 'react'
import {
  TextInput as TextInputOriginal,
  TextInputProps as TextInputComponentProps,
} from 'react-native'

import { AnimatedTextInput } from '../../components/animated/AnimatedTextInput'
import { useAnimatedTheme } from '../../hooks/use-animated-theme'
import { contentPadding, radius } from '../../styles/variables'

export type TextInputProps = TextInputComponentProps

export const TextInput = React.forwardRef((props: TextInputProps, ref: any) => {
  const theme = useAnimatedTheme()

  const { style, ...otherProps } = props

  return (
    <AnimatedTextInput
      {...otherProps}
      ref={ref}
      style={[
        {
          paddingHorizontal: contentPadding,
          paddingVertical: contentPadding / 2,
          backgroundColor: theme.backgroundColorLess08,
          borderRadius: radius,
        },
        style,
      ]}
    />
  )
})

export type TextInput = TextInputOriginal
