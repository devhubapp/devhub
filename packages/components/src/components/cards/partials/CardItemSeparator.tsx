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
    return isRead ? 'backgroundColorLighther2' : 'backgroundColor'

  if (luminance >= 0.6)
    return isRead ? 'backgroundColorDarker2' : 'backgroundColorDarker1'

  return isRead ? 'backgroundColorDarker1' : 'backgroundColor'
}

export function CardItemSeparator(props: {
  isRead?: boolean
  leadingItem?: any
}) {
  const { leadingItem, isRead: _isRead } = props

  const theme = useTheme()

  const isRead =
    typeof _isRead === 'boolean'
      ? _isRead
      : leadingItem
      ? isItemRead(leadingItem)
      : false

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
