import React from 'react'
import { StyleSheet, View } from 'react-native'

import { AppViewMode, ThemeColors } from '@devhub/core'
import { useAppViewMode } from '../../hooks/use-app-view-mode'
import {
  Separator,
  SeparatorProps,
  separatorThickSize,
} from '../common/Separator'
import { useAppLayout } from '../context/LayoutContext'

export function getColumnCardBackgroundThemeColor(
  _backgroundColor: string,
  _appViewMode: AppViewMode,
): keyof ThemeColors {
  return 'backgroundColor'
}

export function getColumnSeparatorSize() {
  return separatorThickSize
}

export interface ColumnSeparatorProps
  extends Pick<SeparatorProps, 'half' | 'zIndex'> {}

const styles = StyleSheet.create({
  separatorCenterContainer: {
    width: separatorThickSize,
    alignItems: 'center',
  },

  separatorCenterContainer__half: {
    width: separatorThickSize / 2,
  },
})

export function ColumnSeparator(props: ColumnSeparatorProps) {
  const { half, zIndex } = props

  const { sizename } = useAppLayout()
  const { appViewMode } = useAppViewMode()

  if (appViewMode === 'single-column' || sizename === '1-small') {
    return (
      <View
        style={[
          styles.separatorCenterContainer,
          half && styles.separatorCenterContainer__half,
          !!zIndex && { zIndex },
        ]}
      >
        <Separator horizontal={false} zIndex={zIndex} />
      </View>
    )
  }

  return (
    <Separator
      backgroundThemeColor1="backgroundColorDarker2"
      half={half}
      horizontal={false}
      thick
      zIndex={zIndex}
    />
  )
}
