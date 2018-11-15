import _ from 'lodash'
import React from 'react'
import { TouchableWithoutFeedback, View } from 'react-native'
import { contentPadding } from '../../styles/variables'
import { Column, GitHubIcon } from '../../types'
import { Spacer } from '../common/Spacer'
import {
  ColumnHeaderItem,
  columnHeaderItemContentSize,
} from './ColumnHeaderItem'

export interface ColumnOptionsRowProps {
  children: React.ReactNode
  iconName: GitHubIcon
  onToggle: () => void
  opened: boolean
  title: string
}

export function ColumnOptionsRow(props: ColumnOptionsRowProps) {
  const { children, iconName, onToggle, opened, title } = props

  return (
    <>
      <TouchableWithoutFeedback onPress={() => onToggle()}>
        <View style={{ flexDirection: 'row' }}>
          <ColumnHeaderItem
            fixedIconSize
            iconName={iconName}
            selectable={false}
            text={title}
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
          style={{
            paddingLeft: columnHeaderItemContentSize + 1.5 * contentPadding,
          }}
        >
          {children}
        </View>
      )}
    </>
  )
}
