import React from 'react'

import { ThemeColors } from '@devhub/core'
import { Separator, separatorSize } from '../../common/Separator'
import { useTheme } from '../../context/ThemeContext'

export const cardItemSeparatorSize = separatorSize

export function getCardItemSeparatorThemeColor({
  isDark,
}: {
  isDark: boolean
  // muted: boolean
}): keyof ThemeColors {
  return isDark ? 'backgroundColorLighther2' : 'backgroundColorDarker1'
}

export interface CardItemSeparatorProps {
  leadingItem?: any
  leftOffset?: number
  muted?: boolean
}

export function CardItemSeparator(props: CardItemSeparatorProps) {
  const { leftOffset } = props

  const theme = useTheme()

  // const muted =
  //   typeof _muted === 'boolean'
  //     ? _muted
  //     : leadingItem
  //     ? isItemRead(leadingItem)
  //     : false

  const cardItemSeparatorThemeColor = getCardItemSeparatorThemeColor({
    isDark: theme.isDark,
    // muted,
  })

  return (
    <Separator
      backgroundThemeColor={cardItemSeparatorThemeColor}
      horizontal
      leftOffset={leftOffset}
      thick={false}
    />
  )
}
