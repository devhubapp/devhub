import React from 'react'
import { Image, StyleProp } from 'react-native'

import { Theme, ThemeColors, ThemeTransformer } from '@devhub/core'
import {
  ImageWithLoading,
  ImageWithLoadingProps,
} from '../common/ImageWithLoading'
import { useTheme } from '../context/ThemeContext'
import { getThemeColorOrItself } from './helpers'

export interface ThemedImageWithLoadingProps
  extends Omit<
    ImageWithLoadingProps,
    | 'backgroundColorFailed'
    | 'backgroundColorLoaded'
    | 'backgroundColorLoading'
    | 'style'
  > {
  backgroundColor?: keyof ThemeColors | ((theme: Theme) => string)
  backgroundColorFailed?:
    | keyof ThemeColors
    | string
    | ((theme: Theme) => string)
  backgroundColorLoaded?:
    | keyof ThemeColors
    | string
    | ((theme: Theme) => string)
  backgroundColorLoading?:
    | keyof ThemeColors
    | string
    | ((theme: Theme) => string)
  borderColor?: keyof ThemeColors | ((theme: Theme) => string)
  children?: React.ReactNode
  style?: Omit<
    ImageWithLoadingProps['style'],
    'backgroundColor' | 'borderColor'
  >

  themeTransformer?: ThemeTransformer
}

export const ThemedImageWithLoading = React.forwardRef<
  Image,
  ThemedImageWithLoadingProps
>((props, ref) => {
  const {
    backgroundColor,
    backgroundColorFailed: _backgroundColorFailed,
    backgroundColorLoaded: _backgroundColorLoaded,
    backgroundColorLoading: _backgroundColorLoading,
    borderColor,
    style,
    themeTransformer,
    ...otherProps
  } = props

  const theme = useTheme({ themeTransformer })

  const backgroundColorFailed = getThemeColorOrItself(
    theme,
    _backgroundColorFailed,
    { enableCSSVariable: true },
  )
  const backgroundColorLoaded = getThemeColorOrItself(
    theme,
    _backgroundColorLoaded,
    { enableCSSVariable: true },
  )
  const backgroundColorLoading = getThemeColorOrItself(
    theme,
    _backgroundColorLoading,
    {
      enableCSSVariable: true,
    },
  )

  return (
    <ImageWithLoading
      {...otherProps}
      ref={ref}
      backgroundColorFailed={backgroundColorFailed}
      backgroundColorLoaded={backgroundColorLoaded}
      backgroundColorLoading={backgroundColorLoading}
      style={{ ...style, ...getStyle(theme, { backgroundColor, borderColor }) }}
    />
  )
})

ThemedImageWithLoading.displayName = 'ThemedImageWithLoading'

export type ThemedImageWithLoading = typeof ThemedImageWithLoading

function getStyle(
  theme: Theme,
  {
    backgroundColor: _backgroundColor,
    borderColor: _borderColor,
  }: Pick<ThemedImageWithLoadingProps, 'backgroundColor' | 'borderColor'>,
) {
  const backgroundColor = getThemeColorOrItself(theme, _backgroundColor, {
    enableCSSVariable: true,
  })
  const borderColor = getThemeColorOrItself(theme, _borderColor, {
    enableCSSVariable: true,
  })

  const style: ImageWithLoadingProps['style'] = {}
  if (backgroundColor) style.backgroundColor = backgroundColor
  if (borderColor) style.borderColor = borderColor

  return style
}
