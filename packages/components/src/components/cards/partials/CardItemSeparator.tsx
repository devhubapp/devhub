import { getLuminance } from 'polished'
import React from 'react'

import { ThemeColors } from '@devhub/core'
import { Separator } from '../../common/Separator'
import { useTheme } from '../../context/ThemeContext'

export function getCardItemSeparatorThemeColor(
  backgroundColor: string,
): keyof ThemeColors {
  const luminance = getLuminance(backgroundColor)

  if (luminance <= 0.02) return 'backgroundColorLess2'
  return 'backgroundColorDarker1'
}

export function CardItemSeparator() {
  const theme = useTheme()

  return (
    <Separator
      backgroundThemeColor={getCardItemSeparatorThemeColor(
        theme.backgroundColor,
      )}
      horizontal
    />
  )
}
