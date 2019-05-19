import React from 'react'
import {
  RefreshControl as RefreshControlOriginal,
  RefreshControlProps as RefreshControlPropsOriginal,
} from 'react-native'

import { Omit } from '@devhub/core'
import { useTheme } from '../context/ThemeContext'
import { IntervalRefreshProps } from './IntervalRefresh'

export interface RefreshControlProps
  extends Omit<RefreshControlPropsOriginal, 'title'> {
  intervalRefresh?: IntervalRefreshProps['date']
  title: string
}

export const RefreshControl = React.memo((props: RefreshControlProps) => {
  const { intervalRefresh, title, ...otherProps } = props

  const theme = useTheme()

  return (
    <RefreshControlOriginal
      colors={[theme.primaryBackgroundColor]}
      progressBackgroundColor={theme.backgroundColorDarker1}
      tintColor={theme.primaryBackgroundColor}
      titleColor={theme.foregroundColorMuted60}
      title={title}
      {...otherProps}
    />
  )
})
