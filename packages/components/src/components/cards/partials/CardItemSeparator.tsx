import React from 'react'

import { isItemRead, ThemeColors } from '@devhub/core'
import { Separator } from '../../common/Separator'
import { useTheme } from '../../context/ThemeContext'

export function getCardItemSeparatorThemeColors(
  _backgroundColor: string,
  muted?: boolean,
): [keyof ThemeColors, keyof ThemeColors | undefined] {
  return muted
    ? ['backgroundColorDarker2', 'backgroundColor']
    : ['backgroundColorDarker1', 'backgroundColorLighther2']
}

export interface CardItemSeparatorProps {
  inverted?: boolean
  leadingItem?: any
  muted?: boolean
}

export function CardItemSeparator(props: CardItemSeparatorProps) {
  const { inverted, leadingItem, muted: _muted } = props

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
      inverted={inverted}
    />
  )
}
