import React from 'react'
import {
  TextInput as TextInputOriginal,
  TextInputProps as TextInputComponentProps,
} from 'react-native'

import { contentPadding, radius } from '../../styles/variables'
import { useTheme } from '../context/ThemeContext'

export type TextInputProps = TextInputComponentProps

export const TextInput = React.forwardRef((props: TextInputProps, ref: any) => {
  const theme = useTheme()

  const { style, ...otherProps } = props

  return (
    <TextInputOriginal
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
