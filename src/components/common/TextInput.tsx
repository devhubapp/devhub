import React from 'react'
import {
  TextInput as TextInputOriginal,
  TextInputProps as TextInputComponentProps,
} from 'react-native'

import { contentPadding, radius } from '../../styles/variables'
import { ThemeConsumer } from '../context/ThemeContext'

export type TextInputProps = TextInputComponentProps

export const TextInput = React.forwardRef(
  ({ style, ...props }: TextInputProps, ref: any) => (
    <ThemeConsumer>
      {({ theme }) => (
        <TextInputOriginal
          {...props}
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
      )}
    </ThemeConsumer>
  ),
)

export type TextInput = TextInputOriginal
