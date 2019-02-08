import React from 'react'

import { contentPadding } from '../../styles/variables'
import { SpringAnimatedView } from '../animated/spring/SpringAnimatedView'
import {
  ColumnHeaderItem,
  ColumnHeaderItemProps,
} from '../columns/ColumnHeaderItem'
import { H2 } from './H2'
import { Spacer } from './Spacer'

export interface SubHeaderProps {
  children?: React.ReactNode
  iconName?: ColumnHeaderItemProps['iconName']
  muted?: boolean
  title?: ColumnHeaderItemProps['title']
}

export function SubHeader(props: SubHeaderProps) {
  const { children, iconName, muted, title } = props

  return (
    <SpringAnimatedView
      style={{
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignSelf: 'stretch',
        alignItems: 'center',
        padding: contentPadding,
      }}
    >
      {!!iconName && (
        <ColumnHeaderItem
          analyticsLabel={undefined}
          fixedIconSize
          iconName={iconName}
          noPadding
          size={18}
          titleStyle={{ fontWeight: '400' }}
        />
      )}

      {!!iconName && !!title && <Spacer width={contentPadding / 2} />}

      {!!title && (
        <H2 muted={muted} withMargin={false}>
          {title}
        </H2>
      )}

      {children}
    </SpringAnimatedView>
  )
}
