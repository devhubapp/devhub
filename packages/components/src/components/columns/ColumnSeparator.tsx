import React from 'react'

import { AppViewMode, ThemeColors } from '@devhub/core'
import { useAppViewMode } from '../../hooks/use-app-view-mode'
import { Separator, SeparatorProps } from '../common/Separator'
import { useAppLayout } from '../context/LayoutContext'
import { useTheme } from '../context/ThemeContext'

export function getColumnCardBackgroundThemeColor(
  _backgroundColor: string,
  _appViewMode: AppViewMode,
): keyof ThemeColors {
  return 'backgroundColor'
}

export interface ColumnSeparatorProps extends SeparatorProps {}

export function ColumnSeparator(props: ColumnSeparatorProps) {
  const { appOrientation } = useAppLayout()
  const { appViewMode } = useAppViewMode()
  const theme = useTheme()

  const horizontalSidebar = appOrientation === 'portrait'

  return (
    <Separator
      backgroundThemeColor={getColumnCardBackgroundThemeColor(
        theme.backgroundColor,
        appViewMode,
      )}
      horizontal={horizontalSidebar}
      thick={!horizontalSidebar}
      {...props}
    />
  )
}
