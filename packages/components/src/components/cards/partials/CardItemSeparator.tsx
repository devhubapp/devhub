import { getLuminance } from 'polished'
import React from 'react'

import { isItemRead, ThemeColors } from '@devhub/core'
import { Separator } from '../../common/Separator'
import { useTheme } from '../../context/ThemeContext'

export function getCardItemSeparatorThemeColors(
  backgroundColor: string,
  muted?: boolean,
): [keyof ThemeColors, keyof ThemeColors | undefined] {
  const luminance = getLuminance(backgroundColor)

  if (luminance >= 0.6)
    return muted
      ? ['backgroundColorDarker3', 'backgroundColor']
      : ['backgroundColorDarker1', 'backgroundColorLighther2']

  if (luminance <= 0.01)
    return muted
      ? ['backgroundColorDarker3', 'backgroundColorLighther2']
      : ['backgroundColorLighther1', 'backgroundColorLighther4']

  return muted
    ? ['backgroundColorDarker2', 'backgroundColorLighther2']
    : ['backgroundColor', 'backgroundColorLighther4']
}

export function CardItemSeparator(props: {
  muted?: boolean
  leadingItem?: any
}) {
  const { leadingItem, muted: _muted } = props

  const theme = useTheme()

  const muted =
    typeof _muted === 'boolean'
      ? _muted
      : leadingItem
      ? isItemRead(leadingItem)
      : false

  const cardItemSeparatorThemeColors = getCardItemSeparatorThemeColors(
    theme.backgroundColor,
    muted,
  )

  return (
    <Separator
      backgroundThemeColor1={cardItemSeparatorThemeColors[0]}
      backgroundThemeColor2={cardItemSeparatorThemeColors[1]}
      horizontal
    />
  )
}
