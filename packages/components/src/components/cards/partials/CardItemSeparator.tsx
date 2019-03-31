import { getLuminance } from 'polished'
import React from 'react'

import { isItemRead, ThemeColors } from '@devhub/core'
import { Separator } from '../../common/Separator'
import { useTheme } from '../../context/ThemeContext'

export function getCardItemSeparatorThemeColor(
  backgroundColor: string,
  isRead?: boolean,
): keyof ThemeColors {
  const luminance = getLuminance(backgroundColor)

  if (luminance <= 0.02)
    return isRead ? 'backgroundColorLighther2' : 'backgroundColorLighther1'

  return isRead ? 'backgroundColorDarker2' : 'backgroundColorDarker1'
}

export function CardItemSeparator(props: any) {
  const { leadingItem } = props

  const theme = useTheme()

  const isRead = leadingItem ? isItemRead(leadingItem) : false

  return (
    <Separator
      backgroundThemeColor={getCardItemSeparatorThemeColor(
        theme.backgroundColor,
        isRead,
      )}
      horizontal
    />
  )
}
