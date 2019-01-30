import React from 'react'

import { contentPadding } from '../../styles/variables'
import { SpringAnimatedView } from '../animated/spring/SpringAnimatedView'
import { getColumnHeaderThemeColors } from '../columns/ColumnHeader'
import {
  ColumnHeaderItem,
  ColumnHeaderItemProps,
} from '../columns/ColumnHeaderItem'
import { useSpringAnimatedTheme } from '../context/SpringAnimatedThemeContext'
import { useTheme } from '../context/ThemeContext'
import { getSeparatorThemeColor } from './Separator'
import { Spacer } from './Spacer'

export interface SubHeaderProps extends ColumnHeaderItemProps {
  children?: React.ReactNode
}

export function SubHeader(props: SubHeaderProps) {
  const { children, ...restProps } = props

  const springAnimatedTheme = useSpringAnimatedTheme()
  const theme = useTheme()

  return (
    <SpringAnimatedView
      style={{
        alignSelf: 'stretch',
        flexDirection: 'row',
        paddingHorizontal: contentPadding / 2,
        backgroundColor:
          springAnimatedTheme[
            getColumnHeaderThemeColors(theme.backgroundColor).normal
          ],
      }}
    >
      <ColumnHeaderItem
        analyticsLabel={undefined}
        fixedIconSize
        size={18}
        {...restProps}
        style={[{ paddingVertical: contentPadding / 2 }, restProps.style]}
        title={`${restProps.title || ''}`.toLowerCase()}
        titleStyle={{ fontWeight: '400' }}
      />

      <Spacer flex={1} minWidth={contentPadding / 2} />

      {children}
    </SpringAnimatedView>
  )
}
