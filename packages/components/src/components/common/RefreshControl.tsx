import React from 'react'
import {
  RefreshControl as RefreshControlOriginal,
  RefreshControlProps as RefreshControlPropsOriginal,
} from 'react-native'

import { Omit } from '@devhub/core'
import { useTheme } from '../context/ThemeContext'
import { IntervalRefresh, IntervalRefreshProps } from './IntervalRefresh'

export interface RefreshControlProps
  extends Omit<RefreshControlPropsOriginal, 'title'> {
  intervalRefresh?: IntervalRefreshProps['date']
  title: string | (() => string)
}

export function RefreshControl(props: RefreshControlProps) {
  const { intervalRefresh, title, ...otherProps } = props

  const theme = useTheme()

  return (
    <IntervalRefresh date={intervalRefresh}>
      {() => (
        <RefreshControlOriginal
          colors={[theme.primaryBackgroundColor]}
          progressBackgroundColor={theme.backgroundColorDarker1}
          tintColor={theme.primaryBackgroundColor}
          titleColor={theme.foregroundColorMuted50}
          title={typeof title === 'function' ? title() : title}
          {...otherProps}
        />
      )}
    </IntervalRefresh>
  )
}
