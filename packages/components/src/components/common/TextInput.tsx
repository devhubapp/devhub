import React, { useRef, useState } from 'react'
import {
  TextInput as TextInputOriginal,
  TextInputProps as TextInputComponentProps,
} from 'react-native'

import { useHover } from '../../hooks/use-hover'
import { contentPadding } from '../../styles/variables'
import { useTheme } from '../context/ThemeContext'

export interface TextInputProps extends TextInputComponentProps {}

export const TextInput = React.forwardRef(
  (props: TextInputProps, receivedRef: any) => {
    const { style, ...otherProps } = props

    const [isFocused, setIsFocused] = useState(false)

    const theme = useTheme()

    const fallbackRef = useRef(null)
    const ref = receivedRef || fallbackRef
    const isHovered = useHover(ref)

    return (
      <TextInputOriginal
        ref={ref}
        placeholderTextColor={theme.foregroundColorMuted50}
        {...otherProps}
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
            borderRadius: 36 / 2,
            borderWidth: 1,
            borderColor: isFocused
              ? theme.primaryBackgroundColor
              : isHovered
              ? theme.foregroundColorMuted50
              : theme.foregroundColorMuted25,
          },
          style,
        ]}
      />
    )
  },
)

export type TextInput = typeof TextInputOriginal
