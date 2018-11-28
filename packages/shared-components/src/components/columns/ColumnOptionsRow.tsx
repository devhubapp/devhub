import _ from 'lodash'
import React from 'react'
import { TouchableWithoutFeedback, View, ViewStyle } from 'react-native'

import { GitHubIcon } from 'shared-core/dist/types'
import * as colors from '../../styles/colors'
import {
  columnHeaderItemContentSize,
  contentPadding,
} from '../../styles/variables'
import { Spacer } from '../common/Spacer'
import { ColumnHeaderItem } from './ColumnHeaderItem'

export interface ColumnOptionsRowProps {
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
      <TouchableWithoutFeedback onPress={() => onToggle()}>
        <View
          style={[
            { flexDirection: 'row', paddingHorizontal: contentPadding / 2 },
            containerStyle,
          ]}
        >
          <ColumnHeaderItem
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
            iconName={opened ? 'chevron-up' : 'chevron-down'}
            selectable={false}
          />
        </View>
      </TouchableWithoutFeedback>

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
