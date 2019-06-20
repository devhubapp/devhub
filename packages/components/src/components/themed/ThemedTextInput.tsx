import React from 'react'

import { ThemeColors, ThemeTransformer } from '@devhub/core'
import { TextInput, TextInputProps } from '../common/TextInput'
import { useTheme } from '../context/ThemeContext'
import { getThemeColorOrItself } from './helpers'

export interface ThemedTextInputProps
  extends Omit<
    TextInputProps,
    | 'backgroundColor'
    | 'backgroundFocusColor'
    | 'backgroundHoverColor'
    | 'borderColor'
    | 'borderFocusColor'
    | 'borderHoverColor'
    | 'placeholderTextColor'
    | 'textColor'
    | 'textFocusColor'
    | 'textHoverColor'
  > {
  backgroundFocusThemeColor?:
    | keyof ThemeColors
    | ((theme: ThemeColors) => string)
  backgroundHoverThemeColor?:
    | keyof ThemeColors
    | ((theme: ThemeColors) => string)
  backgroundThemeColor?: keyof ThemeColors | ((theme: ThemeColors) => string)
  borderFocusThemeColor?: keyof ThemeColors | ((theme: ThemeColors) => string)
  borderHoverThemeColor?: keyof ThemeColors | ((theme: ThemeColors) => string)
  borderThemeColor?: keyof ThemeColors | ((theme: ThemeColors) => string)
  children?: React.ReactNode
  placeholderTextThemeColor?:
    | keyof ThemeColors
    | ((theme: ThemeColors) => string)
  textFocusThemeColor?: keyof ThemeColors | ((theme: ThemeColors) => string)
  textHoverThemeColor?: keyof ThemeColors | ((theme: ThemeColors) => string)
  textThemeColor?: keyof ThemeColors | ((theme: ThemeColors) => string)
  themeTransformer?: ThemeTransformer
}

const enableCSSVariable = true

export const ThemedTextInput = React.forwardRef<
  TextInput,
  ThemedTextInputProps
>((props, ref) => {
  const {
    backgroundFocusThemeColor,
    backgroundHoverThemeColor,
    backgroundThemeColor,
    borderFocusThemeColor,
    borderHoverThemeColor,
    borderThemeColor,
    placeholderTextThemeColor,
    textFocusThemeColor,
    textHoverThemeColor,
    textThemeColor,
    themeTransformer,
    ...otherProps
  } = props

  const theme = useTheme({ themeTransformer })

  const backgroundFocusColor = getThemeColorOrItself(
    theme,
    backgroundFocusThemeColor,
    { enableCSSVariable },
  )
  const backgroundHoverColor = getThemeColorOrItself(
    theme,
    backgroundHoverThemeColor,
    { enableCSSVariable },
  )
  const backgroundColor = getThemeColorOrItself(theme, backgroundThemeColor, {
    enableCSSVariable,
  })
  const borderFocusColor = getThemeColorOrItself(theme, borderFocusThemeColor, {
    enableCSSVariable,
  })
  const borderHoverColor = getThemeColorOrItself(theme, borderHoverThemeColor, {
    enableCSSVariable,
  })
  const borderColor = getThemeColorOrItself(theme, borderThemeColor, {
    enableCSSVariable,
  })
  const placeholderTextColor = getThemeColorOrItself(
    theme,
    placeholderTextThemeColor,
    {
      enableCSSVariable,
    },
  )
  const textFocusColor = getThemeColorOrItself(theme, textFocusThemeColor, {
    enableCSSVariable,
  })
  const textHoverColor = getThemeColorOrItself(theme, textHoverThemeColor, {
    enableCSSVariable,
  })
  const textColor = getThemeColorOrItself(theme, textThemeColor, {
    enableCSSVariable,
  })

  return (
    <TextInput
      key={`themed-text-input-${otherProps.textInputKey}`}
      {...otherProps}
      ref={ref}
      backgroundFocusColor={backgroundFocusColor}
      backgroundHoverColor={backgroundHoverColor}
      backgroundColor={backgroundColor}
      borderFocusColor={borderFocusColor}
      borderHoverColor={borderHoverColor}
      borderColor={borderColor}
      placeholderTextColor={placeholderTextColor}
      textFocusColor={textFocusColor}
      textHoverColor={textHoverColor}
      textColor={textColor}
    />
  )
})

export type ThemedTextInput = typeof ThemedTextInput
