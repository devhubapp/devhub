import _ from 'lodash'
import React from 'react'
import { View, ViewStyle } from 'react-native'

import { GitHubIcon } from '@devhub/core'
import * as colors from '../../styles/colors'
import {
  columnHeaderItemContentSize,
  contentPadding,
} from '../../styles/variables'
import { Spacer } from '../common/Spacer'
import {
  TouchableOpacity,
  TouchableOpacityProps,
} from '../common/TouchableOpacity'
import { ColumnHeaderItem } from './ColumnHeaderItem'

export interface ColumnOptionsRowProps {
  analyticsLabel: TouchableOpacityProps['analyticsLabel']
  children: React.ReactNode
  containerStyle?: ViewStyle
  contentContainerStyle?: ViewStyle
  hasChanged: boolean
  iconName: GitHubIcon
  onToggle: () => void
  opened: boolean
  title: string
}

export function ColumnOptionsRow(props: ColumnOptionsRowProps) {
  const {
    analyticsLabel,
    children,
    containerStyle,
    contentContainerStyle,
    hasChanged,
    iconName,
    onToggle,
    opened,
    title,
  } = props

  return (
    <>
      <TouchableOpacity
        analyticsAction={opened ? 'hide' : 'show'}
        analyticsCategory="option_row"
        analyticsLabel={analyticsLabel}
        onPress={() => onToggle()}
      >
        <View
          style={[
            { flexDirection: 'row', paddingHorizontal: contentPadding / 2 },
            containerStyle,
          ]}
        >
          <ColumnHeaderItem
            analyticsLabel={undefined}
            fixedIconSize
            iconName={iconName}
            selectable={false}
            text={title}
            iconStyle={
              hasChanged ? { color: colors.brandBackgroundColor } : undefined
            }
          />
          <Spacer flex={1} />
          <ColumnHeaderItem
            analyticsLabel={undefined}
            iconName={opened ? 'chevron-up' : 'chevron-down'}
            selectable={false}
          />
        </View>
      </TouchableOpacity>

      {!!opened && (
        <View
          style={[
            {
              paddingLeft: columnHeaderItemContentSize + 1.5 * contentPadding,
              paddingBottom: contentPadding / 2,
            },
            contentContainerStyle,
          ]}
        >
          {children}
        </View>
      )}
    </>
  )
}
