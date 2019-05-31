import { getLuminance } from 'polished'
import React from 'react'

import { isItemRead, ThemeColors } from '@devhub/core'
import { Separator } from '../../common/Separator'
import { useTheme } from '../../context/ThemeContext'

export function getCardItemSeparatorThemeColor(
  backgroundColor: string,
  muted?: boolean,
): keyof ThemeColors {
  const luminance = getLuminance(backgroundColor)

  if (luminance <= 0.02)
    return muted ? 'backgroundColorLighther2' : 'backgroundColor'

  if (luminance >= 0.6)
    return muted ? 'backgroundColorDarker2' : 'backgroundColorDarker1'

  return muted ? 'backgroundColorDarker1' : 'backgroundColor'
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

  return (
    <Separator
      backgroundThemeColor={getCardItemSeparatorThemeColor(
        theme.backgroundColor,
        muted,
      )}
      horizontal
    />
  )
}
