import React from 'react'

import { View } from 'react-native'
import { sharedStyles } from '../../styles/shared'
import { contentPadding } from '../../styles/variables'
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
    <View
      style={[
        sharedStyles.horizontal,
        sharedStyles.justifyContentFlexStart,
        sharedStyles.alignSelfStretch,
        sharedStyles.alignItemsCenter,
        {
          padding: contentPadding,
        },
      ]}
    >
      {!!iconName && (
        <ColumnHeaderItem
          fixedIconSize
          iconName={iconName}
          noPadding
          size={18}
          titleStyle={{ fontWeight: '400' }}
          tooltip={undefined}
        />
      )}

      {!!iconName && !!title && <Spacer width={contentPadding / 2} />}

      {!!title && (
        <H2 muted={muted} withMargin={false}>
          {title}
        </H2>
      )}

      {children}
    </View>
  )
}
