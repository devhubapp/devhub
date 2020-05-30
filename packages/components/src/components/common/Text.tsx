import React from 'react'
import {
  StyleSheet,
  Text as TextOriginal,
  TextProps as TextPropsOriginal,
} from 'react-native'
import { normalTextSize } from '../../styles/variables'

export type TextProps = TextPropsOriginal & { children?: React.ReactNode }

export const propsToScale = [
  'fontSize' as const,
  'width' as const,
  'height' as const,
]

export const Text = React.forwardRef<TextOriginal, TextProps>((props, ref) => {
  return (
    <TextOriginal ref={ref} {...props} style={[styles.default, props.style]} />
  )
})
export type Text = TextOriginal

const styles = StyleSheet.create({
  default: {
    fontSize: normalTextSize,
  },
})
