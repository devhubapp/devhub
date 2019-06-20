import React from 'react'

import { AppViewMode, ThemeColors } from '@devhub/core'
import { useAppViewMode } from '../../hooks/use-app-view-mode'
import { Separator, SeparatorProps } from '../common/Separator'
import { useAppLayout } from '../context/LayoutContext'

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

  const horizontalSidebar = appOrientation === 'portrait'

  return (
    <Separator
      backgroundThemeColor1={
        appViewMode === 'single-column'
          ? 'backgroundColor'
          : 'backgroundColorDarker2'
      }
      horizontal={horizontalSidebar}
      thick={!horizontalSidebar}
      {...props}
    />
  )
}
