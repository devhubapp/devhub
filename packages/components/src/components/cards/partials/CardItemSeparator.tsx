import React from 'react'

import { isItemRead, ThemeColors } from '@devhub/core'
import { Separator, separatorSize } from '../../common/Separator'
import { useTheme } from '../../context/ThemeContext'

export const cardItemSeparatorSize = separatorSize

export function getCardItemSeparatorThemeColors({
  isDark,
  muted,
}: {
  isDark: boolean
  muted: boolean
}): [keyof ThemeColors, keyof ThemeColors | undefined] {
  return isDark
    ? muted
      ? ['backgroundColorDarker3', 'backgroundColorLighther1']
      : ['backgroundColorDarker1', 'backgroundColorLighther2']
    : muted
    ? ['backgroundColorDarker2', 'backgroundColor']
    : ['backgroundColorDarker1', 'backgroundColorLighther2']
}

export interface CardItemSeparatorProps {
  leadingItem?: any
  muted?: boolean
}

export function CardItemSeparator(props: CardItemSeparatorProps) {
  const { leadingItem, muted: _muted } = props

  const theme = useTheme()

  const muted =
    typeof _muted === 'boolean'
      ? _muted
      : leadingItem
      ? isItemRead(leadingItem)
      : false

  const cardItemSeparatorThemeColors = getCardItemSeparatorThemeColors({
    isDark: theme.isDark,
    muted,
  })

  return (
    <Separator
      backgroundThemeColor1={cardItemSeparatorThemeColors[0]}
      backgroundThemeColor2={cardItemSeparatorThemeColors[1]}
      horizontal
      thick={false}
    />
  )
}
